import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.headers);

  res.status(404).json({ message: "endpoint does not exist" });


}
