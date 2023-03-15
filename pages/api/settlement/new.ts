import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import axios from 'axios';
import { Keypair } from "@solana/web3.js";
import { encryptData } from "../../../app/functions/crypto-data";
import { logger } from "../../../app/functions/logger";

const bs58 = require("bs58");
type Data = {
  message: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    if (req.method == "POST") {


      const { body, headers } = req;

      const pin = body.newpin;

      const { authorization } = headers;

      if (pin.length != 5) {
        res.status(400).json({
          error: true,
          message: "Your pin is incorrect",
        });
      }

      const wallet = ethers.Wallet.createRandom();

      const address = wallet.address;

      (async () => {

        try {

        const account = await wallet.encrypt(pin);

        await axios
            .post(
              "https://ab.cryptea.me/update/settlement/pin",
              {
                pin,
                address,
                type: 'evm',
                account,
              },
              {
                headers: {
                  Authorization: authorization as string,
                },
              }
            );

              const solWallet = Keypair.generate();

              const solAddress = solWallet.publicKey.toBase58();

              const solAccount = encryptData(bs58.encode(solWallet.secretKey), pin);

              await axios.post(
                "https://ab.cryptea.me/update/settlement/pin",
                {
                  pin,
                  address: solAddress,
                  type: "sol",
                  account: JSON.stringify(solAccount),
                },
                {
                  headers: {
                    Authorization: authorization as string,
                  },
                }
              )
            
            
            res.status(200).json({
              error: false,
              message: "Pin updated successfully",
            });            
            
          } catch (err) {

            const error = err as any;

            logger.error(error);

            res.status(400).json({
              error: true,
              message:
                error?.response?.data?.message || "Something went wrong, please try again",
            });
            
          }

      })()

    } else {
      res.status(422).json({
        message: "Method not supported",
        error: true,
      });
    }
}
