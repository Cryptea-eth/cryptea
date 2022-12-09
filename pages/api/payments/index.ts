import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import { balanceABI } from "../../../app/functions/abi";


type Data = {
  proceed: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if (req.method == 'POST') {

        const body = req.body;

        let provider = new ethers.providers.JsonRpcProvider(body.rpc);

        let balance = new ethers.Contract(body.tokenAddr, balanceABI, provider);
        
        balance.balanceOf(body.account).then(async (mbalance: any) => {
            const currentBalance = Number(ethers.utils.formatEther(mbalance));

            console.log(body.initial + Number(body.price), currentBalance);

            if (
              body.initial != currentBalance &&
              (body.initial + Number(body.price)).toFixed(6) == currentBalance.toFixed(6)
            ) {
              
                return res.status(200).json({ proceed: true });

            }else{

                 return res.status(200).json({ proceed: false });
            }

        });

    }

}
