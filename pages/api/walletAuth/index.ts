// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import nacl from "tweetnacl";
import * as ethers from 'ethers';
import http from '../../../utils/http';

// authentication for wallets from different blockchains


type Data = {
  data?: any;
  token?: string; 
  message: string
  error: boolean
}

const bs58 = require("bs58");

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const key: string = process.env.APP_KEY || '';

  const getToken = async (address: string, tz?: any) => {

    try {

    const rs = await http
      .post(
        "/login/walletAuth",
        {
          address,
          tz
        },
        {
          headers: {
            Authorization: key,
          },
        }
      )

      const { data, token } = rs.data;

      res.status(200).json({
        data,
        token,
        message: "Successfully authenticated",
        error: false,
      });
    
      
    } catch(err) {

        const errx = err as any;

        console.log(process.env.APP_KEY, 'sss', "ss");

        res.status(errx?.response?.status || 400).json({
          message:
            errx.response?.data?.message ||
            "Something went wrong, please try again",
          error: true,
        }); 
   }
}

    if (req.method == 'POST') {

        const { blocktype, address, signature, message, tz } = req.body;

        if (blocktype == 'evm') {

          const messageAddress = ethers.utils.verifyMessage(message, signature);


          if ((messageAddress).toLowerCase() == address.toLowerCase()) {

            getToken(address, tz);

          } else {

            res.status(400).json({
              message: "Signature verification failed",
              error: true,
            });
          }             

        }else if (blocktype == 'sol') {

          const verified = nacl.sign.detached.verify(
            Buffer.from(message),
            bs58.decode(signature),
            bs58.decode(address)
          );

          if (verified) {
  
            getToken(address, tz);              

          } else {
            res.status(400).json({
              message: "Signature verification failed",
              error: true,
            });
          }

        }

    }else{
        res.status(422).json({
           message: "Method not supported",
           error: true,
         });
    }

}
