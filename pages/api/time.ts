// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  time?: number;
  error?: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    if (req.method == "GET") {

        res.status(200).json({ time: new Date().getTime() });

    }else{
        res.status(422).json({ 
          error: true,
      });
    }

}
