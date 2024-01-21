import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import axios from 'axios';
import { Keypair } from "@solana/web3.js";
import { encryptData } from "../../../app/functions/crypto-data";
import logger from "../../../app/functions/logger";
// <reference types="@types/tronweb" />
const TronWeb = require("tronweb");

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
      }

      const wallet = ethers.Wallet.createRandom();

      const address = wallet.address;

      (async () => {

        try {

        const account = await wallet.encrypt(pin);

        const ethObj = [
          {
            address,
            type: "evm",
            account,
          },
        ];

        // await axios
        //     .post(
        //       "https://ab.cryptea.me/update/settlement/pin",
        //       {
        //         pin,
        //         address,
        //         type: 'evm',
        //         account,
        //       },
        //       {
        //         headers: {
        //           Authorization: authorization as string,
        //         },
        //       }
        //     );

              const solWallet = Keypair.generate();

              const solAddress = solWallet.publicKey.toBase58();

              const solAccount = encryptData(bs58.encode(solWallet.secretKey), pin);

              ethObj.push({
                address: solAddress,
                type: "sol",
                account: JSON.stringify(solAccount),
              });

              // create tron account
              const tronWeb = new TronWeb({
                fullNode: process.env.TRON_MAINNET || "https://api.trongrid.io",
                solidityNode: process.env.TRON_MAINNET_SOLIDITY || "https://api.trongrid.io",
              });

              const tronAccount = await tronWeb.createAccount();

              ethObj.push({
                address: tronAccount.address.base58,
                type: "trx",
                account: tronAccount.privateKey,
              })

              await axios.post(
                "https://ab.cryptea.me/update/settlement/pin",
                {
                   data: ethObj,
                   pin
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

            res.status(error?.status || 400).json({
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
