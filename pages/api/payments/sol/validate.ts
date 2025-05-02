export {

}

// import type { NextApiRequest, NextApiResponse } from "next";
// import * as ethers from "ethers";
// import axios from "axios";
// import { Connection } from '@solana/web3.js';


// type Data = {
//   error: boolean;
//   message: string;
// };

// const addressEqual = (address1: string, address2: string): boolean => {
//   if (address1.toLowerCase() == address2.toLowerCase()) {
//     return true;
//   }

//   return false;
// };

// const providers: { [index: string]: string } = {
//   "112211_2211223": process.env.SOLANA_MAINNET || '',
//   "112211_2211224": process.env.SOLANA_DEVNET || '',
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method == "POST") {
//     const data = req.body;

//     let begin = true;

//     [data.hash, data.address, data.amountCrypto].forEach((e: any) => {
//       if (e == undefined) {
//         begin = false;
//       }
//     });

//     if (begin) {

//       const provider = new Connection(
//         providers[data.chain]
//       );


//       provider
//         .getParsedTransaction(data.hash)
//         .then(async (trx) => {

//           let valid = true;

//           if (
//             !addressEqual(trx.from, data.address) &&
//             data.paytype == "auto" &&
//             !addressEqual(trx.to as string, data.contractAddr)
//           ) {
//             valid = false;
//           }

//           if (valid) {
//             const resMain = await http.post(
//               `/link/payments/${data.linkId}`,
//               data,
//               {
//                 headers: {
//                   Authorization: process.env.APP_KEY || "",
//                 },
//                 timeout: 9000000,
//               }
//             );

//             res.status(resMain.status).json(resMain.data);
//           } else {
//             res.status(400).json({ error: true, message: "data incorrect" });
//           }
//         });
//     } else {
//       res.status(400).json({ error: true, message: "Data Incomplete" });
//     }
//   } else {
//     res.status(422).json({
//       message: "Method not supported",
//       error: true,
//     });
//   }
// }
