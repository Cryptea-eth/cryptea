import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import generic from "../../../public/images/generic.json";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | object>
) {

  if (req.method == "GET") {

    const crypto = String(req.query["symbol"]).toLowerCase();    

      axios.get(`https://ab.cryptea.me/crypto/img/${crypto}`, { headers: {
          Authorization: process.env.APP_KEY || "",
      } }).then((rs) => {

        const mainRs = rs.data.link;

        return res.status(200).json(mainRs);        

      }).catch((err) => {

        return res.status(200).json(generic['GENERIC'].icon)

      });
  }else{
     return res.status(422).json({ 
        message: 'Method not supported',
        error: true
    });
  }
}
