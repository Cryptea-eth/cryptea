import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios';
import * as ethers from 'ethers'; 

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

      let wallet = ethers.Wallet.createRandom();

      wallet.encrypt(process.env.KEY || '').then(async (encrypted) => {  
        try {
        await axios.post(
          "https://ab.cryptea.me/link/pay/accounts",
          {
            account: wallet.address,
            private: encrypted,
            type,
          },
          {
            headers: {
              Authorization: process.env.APP_KEY || "",
            },
          }
        )

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

      } else {
      res.status(422).json({
        message: "Method not supported",
        error: true,
      });
    }

}