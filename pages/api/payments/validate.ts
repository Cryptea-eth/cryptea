import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import validator from "validator";
import axios from "axios";
import { AuroraTestnet, CronosTest, OasisEmeraldTestnet, OptimismGoerli } from "../../../app/contexts/Cryptea/connectors/chains";

type Data = {
  error: boolean;
  message: string;
};

const addressEqual = (address1: string, address2: string): boolean => {
  if (address1.toLowerCase() == address2.toLowerCase()) {
    return true;
  }

  return false;
};

const providers: { [index: string]: string } = {
  338: CronosTest.rpcUrls.default,
  80001 : process.env.MATIC_LINK as string,
  42261: OasisEmeraldTestnet.rpcUrls.default,
  1313161555: AuroraTestnet.rpcUrls.default,
  420: OptimismGoerli.rpcUrls.default,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {

    const data = req.body;

    let begin = true;

    [data.hash, data.address, data.amountCrypto].forEach((e: any) => {
      if (e == undefined) {
        begin = false;
      }
    });

    if (begin) {

      const provider = new ethers.providers.JsonRpcProvider(
        providers[data.chain]
      );

      provider
        .getTransaction(data.hash)
        .then(async (trx: ethers.ethers.providers.TransactionResponse) => {
          const amt = data.amountCrypto;

          const fullAmt = Number(ethers.utils.formatEther(trx.value));

          const trxAmt = fullAmt - ((fullAmt * 1) / 100)

          let valid = true;

        //   if (data.paytype == "manual") {
        //     try {
        //       const accounts = await axios.get(
        //         `https://ab.cryptea.me/link/pay/accounts/${trx?.to}`,
        //         {
        //           headers: {
        //             Authorization: process.env.APP_KEY || "",
        //           },
        //           timeout: 600000,
        //         }
        //       );

        //       if (!Boolean(accounts?.data.address)) {
        //         valid = false;
        //       }
        //     } catch (err) {
        //       valid = false;
        //     }
        //   }

          if (
            !addressEqual(trx.from, data.address) ||
            (data.paytype == "auto" &&
              !addressEqual(trx.to as string, data.contractAddress)) ||
            trxAmt != Number(amt)
          ) {
            valid = false;
          }

          if (valid) {
            const resMain = await axios.post(
              `https://ab.cryptea.me/link/payments/${data.linkid}`,
              data,
              {
                headers: {
                  Authorization: process.env.APP_KEY || "",
                },
              }
            );

            return res.status(resMain.status).json(resMain.data);
          }else {

            return res.status(400).json({ error: true, message: "data incorrect" });

          }
        });
    } else {
      return res.status(400).json({ error: true, message: "Data Incomplete" });
    }
  }
}