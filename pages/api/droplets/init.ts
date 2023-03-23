// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcrypt');

type Data = {
  date?: number
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
 
    if (req.method == "GET") {
        res.status(200).json({ date: new Date().getTime() })
    }else{
        res.status(422).json({ 
          message: 'Method not supported',
      });
    }

}
