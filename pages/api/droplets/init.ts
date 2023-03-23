// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcrypt');

type Data = {
  expire?: number;
  date?: number
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
 
    if (req.method == "GET") {

        const { time } = req.query;

        if (time) {

            const expire = new Date().getTime() + (Number(time) * 86_400_000);

             res.status(200).json({ date: new Date().getTime(), expire });

        }

    }else{
        res.status(422).json({ 
          message: 'Method not supported',
      });
    }

}
