// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { tokenTrackers } from "../../../../../../app/contexts/Cryptea/connectors/chains";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  decryptData,
  encryptData,
} from "../../../../../../app/functions/crypto-data";
import { validateSol } from "../../../../../../app/contexts/Cryptea/blockchains";
import logger from "../../../../../../app/functions/logger";
const bs58 = require("bs58");


type Data = {
  message: string;
  ref?: {
    name: string;
    link: string;
  };
  errorType?: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    const { authorization } = req.headers;

    const {
      addressTo,
      pin,
      amountCrypto,
      username,
      token,
      fee,
      settlement: userAccts,
    } = req.body;

    if (pin.length != 5) {
      res.status(400).json({
        error: true,
        message: "Your pin is incorrect",
      });
    } else if (!validateSol(addressTo)) {
      res.status(400).json({
        error: true,
        message: "A valid address is required",
        errorType: "address",
      });
    }

    (async () => {
     
      try {
        
        await axios.get("https://ab.cryptea.me/user", {
          headers: {
            Authorization: authorization as string,
          },
        });

        const provider = new Connection(token.rpc || "");

        const userAddr = new PublicKey(userAccts.address);

        const mbalance = await provider.getBalance(userAddr);

        const balance =
          token.type == "native"
            ? Number(mbalance / LAMPORTS_PER_SOL) - fee
            : 0;

        if (amountCrypto > balance) {
          res.status(400).json({
            message: "Insufficient funds",
            errorType: "amount",
            error: true,
          });
        }

        const sendAmount = amountCrypto * LAMPORTS_PER_SOL;
         

        const tx = {
          fromPubkey: userAddr,
          toPubkey: new PublicKey(addressTo),
          lamports: sendAmount,
        };


        const trxFee = 1000000 / LAMPORTS_PER_SOL;

        const newBalance = tx.lamports - 1000000;

        if (balance - amountCrypto < trxFee) {
          tx.lamports = newBalance;
        }


        const secretKeyString =
          typeof userAccts.account == "string"
            ? JSON.parse(userAccts.account)
            : userAccts.account;

        let secretKey;

        if (userAccts.init == 0) {

          secretKey = decryptData(secretKeyString, username);

          try{

              bs58.decode(secretKey);

          }catch (err) {
              res
                .status(400)
                .json({
                  message: "Invalid pin",
                  error: true,
                  errorType: "pin",
                });
          }

          await axios.patch(
            `https://ab.cryptea.me/settlements/update/${userAccts.address}`,
            {
              account: JSON.stringify(encryptData(secretKey, pin)),
            },
            {
              headers: {
                Authorization: authorization as string,
              }
            }
          );

        } else {
          secretKey = decryptData(JSON.parse(secretKeyString),
            pin
          );
        }

        let mainSecret;

        try {

          mainSecret = bs58.decode(secretKey);

        } catch (err) {
          res
            .status(400)
            .json({ message: "Invalid pin", error: true, errorType: "pin" });
        }

        const wallet = Keypair.fromSecretKey(mainSecret);

        const transaction = new Transaction().add(SystemProgram.transfer(tx));

        const trx = await sendAndConfirmTransaction(provider, transaction, [
          wallet,
        ]);

        const StoredData = {
          type: "crypto",
          amount: amountCrypto,
          data: JSON.stringify({
            token: token.name,
            receiver: addressTo,
            explorer: tokenTrackers[token.value].link(trx),
          }),
          desc: `${token.name} Crypto Withdrawal`,
        };

        await axios.post("https://ab.cryptea.me/settlements/new", StoredData, {
          headers: {
            Authorization: authorization as string,
          },
        });

        res.status(201).json({
          error: false,
          message: "Transaction Successful",
          ref: {
            link: tokenTrackers[token.value].link(trx),
            name: tokenTrackers[token.value].name,
          },
        });
      } catch (err) {
        const error = err as any;

        // console.log(error)

        logger.error(error);

        res
          .status(Number(error?.response?.status || error?.status || "400"))
          .json({
            error: true,
            message:
              error?.response?.data?.message || "Something went wrong, please try again",
          });
      }
    })();
  } else {
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }
}
