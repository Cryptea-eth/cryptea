import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import axios from "axios";
import {
  auroraTestnet,
  CronosTest,
  filecoinHyperspace,
  OasisEmeraldTestnet,
  optimismGoerli,
  fantom,
  TaikoTest,
  fantomTestnet,
  polygonZkEvmTestnet,
  gnosis,
  scrollTestnet,
  MantleTest,
  optimism,
} from "../../../../app/contexts/Cryptea/connectors/chains";
import http from "../../../../utils/http";

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
  338: CronosTest.rpcUrls.default.http[0],
  137: process.env.POLYGONMATIC as string,
  80001: process.env.MATIC_LINK as string,
  42261: OasisEmeraldTestnet.rpcUrls.default.http[0],
  1313161555: auroraTestnet.rpcUrls.default.http[0],
  420: optimismGoerli.rpcUrls.default.http[0],
  3141: filecoinHyperspace.rpcUrls.default.http[0],
  250: fantom.rpcUrls.default.http[0],
  4002: fantomTestnet.rpcUrls.default.http[0],
  1442: polygonZkEvmTestnet.rpcUrls.default.http[0],
  100: gnosis.rpcUrls.default.http[0],
  534353: scrollTestnet.rpcUrls.default.http[0],
  167002: TaikoTest.rpcUrls.default.http[0],
  5001: MantleTest.rpcUrls.default.http[0],
  10: optimism.rpcUrls.default.http[0],
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

          let valid = true;

          if (
            !addressEqual(trx.from, data.address) &&
            data.paytype == "auto" &&
            !addressEqual(trx.to as string, data.contractAddr)
          ) {
            valid = false;
          }

          if (valid) {
            const resMain = await http.post(
              `/link/payments/${data.linkId}`,
              data,
              {
                headers: {
                  Authorization: process.env.APP_KEY || "",
                },
                timeout: 9000000,
              }
            );

            res.status(resMain.status).json(resMain.data);

            console.log(resMain.data)

          } else {
            res.status(400).json({ error: true, message: "data incorrect" });
          }
        });
    } else {
      res.status(400).json({ error: true, message: "Data Incomplete" });
    }
  } else {
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }
}
