import type { NextApiRequest, NextApiResponse } from "next";
import icons from "base64-cryptocurrency-icons";
import fs from 'fs';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method == "GET") {
    const symbol = String(req.query["symbol"]).toUpperCase();

    if (icons[symbol] !== undefined) {

      return res
        .status(200)
        .json(
          icons[symbol]?.icon || ""
        );
      
    } else {

      return res.status(200).json(icons["GENERIC"]?.icon || "");

    }
  }
}
