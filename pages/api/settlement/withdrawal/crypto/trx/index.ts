// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import {
  decryptData,
  encryptData,
} from "../../../../../../app/functions/crypto-data";
import logger from "../../../../../../app/functions/logger";
import { tronTokenTrackers } from "../../../../../../app/contexts/Cryptea/connectors/tron";
import http from "../../../../../../utils/http";
const bs58 = require("bs58");
const TronWeb = require("tronweb");

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

    if (!authorization) {

      res.status(404).json({
        error: true,
        message: "not found",
      });

    }

    if (pin.length != 5) {
      res.status(400).json({
        error: true,
        message: "Your pin is incorrect",
      });

    } else if (!TronWeb.isAddress(addressTo)) {
      res.status(400).json({
        error: true,
        message: "A valid address is required",
        errorType: "address",
      });
    }

    (async () => {
      try {
        await http.get("/user");


        const tron = new TronWeb({
            fullNode: token.rpc || "",
            solidityNode: token.rpc || "",
        });

        const balance = token.type == "native" ? TronWeb.fromSun(await tron.trx.getBalance(userAccts.address)) - fee : 0;


        if (amountCrypto > balance) {
          res.status(400).json({
            message: "Insufficient funds",
            errorType: "amount",
            error: true,
          });
        }

        const sendAmount = TronWeb.toSun(amountCrypto);

        const secretKeyString =
          typeof userAccts.account == "string"
            ? JSON.parse(userAccts.account)
            : userAccts.account;

        const secretKey = decryptData(JSON.parse(secretKeyString), pin);

        
        if (token.type == 'native') { 

             const tx = await tron.trx.sendTransaction(
               addressTo,
               sendAmount,
               secretKey
             );

            const StoredData = {
            type: "crypto",
            amount: amountCrypto,
            data: JSON.stringify({
                token: token.name,
                receiver: addressTo,
                explorer: tronTokenTrackers[token.value].link(tx.txid),
            }),
            desc: `${token.name} Crypto Withdrawal`,
            };

            await http.post(
            "/settlements/new",
            StoredData,
            );

        }else{
            // more work here for tokens
            
        }


        res.status(201).json({
          error: false,
          message: "Transaction Successful",
          ref: {
            link: "",
            name: "",
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
              error?.response?.data?.message ||
              "Something went wrong, please try again",
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
