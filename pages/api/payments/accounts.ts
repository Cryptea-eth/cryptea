import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios';
import * as ethers from 'ethers'; 
import { Keypair } from '@solana/web3.js';

const bs58 = require('bs58');
const { encryptData } = require('../../../app/functions/crypto-data');

type Data = {
  error: boolean,
  data?: string | object,
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  
    if (req.method == "GET") {
      const { query } = req;

      const type = Boolean(query["type"]) ? query["type"] : "evm";

      if (type == 'evm') {

      let wallet = ethers.Wallet.createRandom();
      

      wallet.encrypt(process.env.KEY || '').then(async (encrypted) => {  
        try {
        await axios.post(
          "/link/pay/accounts",
          {
            account: wallet.address,
            private: encrypted,
            type,
          },
          {
            headers: {
              Authorization: process.env.APP_KEY || "",
            },
            baseURL: "https://ab.cryptea.me",
          }
        );

        res.status(200).json({ error: false, data: wallet.address });

        }catch (err) {

          const errx = err as any;

          res.status(400).json({
            message: errx.response.data.message,
            error: true,
          });

        }

      }).catch(error => {

        res.status(400).json({
          message: error.message,
          error: true,
        });

      });

    }else if(type == 'sol'){

        let wallet = Keypair.generate();

        const encrypted = encryptData(bs58.encode(wallet.secretKey), process.env.KEY || '');
        

        (async () => {

          try {
          await axios.post(
            "/link/pay/accounts",
            {
              account: wallet.publicKey.toBase58(),
              private: encrypted,
              type,
            },
            {
              headers: {
                Authorization: process.env.APP_KEY || "",
              },
              baseURL: "https://ab.cryptea.me",
            }
          );
              
          res.status(200).json({ error: false, data: wallet.publicKey.toBase58() });
  
          }catch (err) {
  
            const errx = err as any;

            console.log(errx);
  
            res.status(400).json({
              message: errx.response.data.message,
              error: true,
            });
  
          }

        })() 

    }

      } else {
      res.status(422).json({
        message: "Method not supported",
        error: true,
      });
    }

}