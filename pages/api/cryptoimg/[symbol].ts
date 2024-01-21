import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import generic from "../../../public/images/generic.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | object>
) {

  if (req.method == "GET") {

    const crypto = String(req.query["symbol"]).toLowerCase();    

      (async () => {
      
        

        if (crypto == "scroll" || crypto == "taiko" || crypto == "mantle") {
          
          res.status(200).json((generic as any)[crypto].icon);

          return;
        }

        

        try {        
      
          const rs = await axios.get(`https://ab.cryptea.me/crypto/img/${crypto.split(' ').shift()}`, { headers: {
            Authorization: process.env.APP_KEY || "",
          }});

          const mainRs = rs.data.link;

           res.status(200).json(mainRs);

        }catch (err) {

          // console.log(err)

            res.status(200).json(generic['GENERIC'].icon)
        }

      })()

  }else{
      res.status(422).json({ 
        message: 'Method not supported',
        error: true
    });
  }
}
