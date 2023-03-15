// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const bcrypt = require('bcrypt');

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  (async () => {
    // replace(/^\$2y(.+)$/i, '$2a$1')
    console.log(
      await bcrypt.compare(
        "password",
        "$2a$10$vTHrZ2Swn7vpfW7RO5ZxZOQXkGCWL14ZBpXwMClIaOR7IeEkqFgYu"
      )
    );
  })()
  

  res.status(200).json({ name: 'John Doe' })
}
