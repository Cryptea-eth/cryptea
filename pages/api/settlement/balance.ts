// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import logger from '../../../app/functions/logger';
import axios from 'axios';
import { CryptoList } from '../../../app/contexts/Cryptea/connectors/chains';
import { blockchains } from '../../../app/contexts/Cryptea/blockchains';

type base = { [index: string]: any }; 

type Data = {
  error: boolean;
  message: string;
  breakdown?: base;
  total?: number;
  prices?: base;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
 
    if (req.method == 'GET') {

        (async () => {

            const { authorization } = req.headers;

            try{

                const { data } = await axios.get('https://ab.cryptea.me/user/extra', {
                    headers: {
                        Authorization: authorization as string
                    }
                })

                const { user, accounts, pending, payments } = data;

                const fees: { [index: string]: number } = {};
                
                const sAddresses: any = {};

                accounts.map((v: any) => {

                    sAddresses[v.blocktype] = v.address;

                })

                payments.forEach((value: any) => {
                  if (value.meta !== null) {
                    const metadata = JSON.parse(value.meta);

                    fees[metadata["chain"]] = Number(metadata["discount"]);
                  }
                });

                
                let finalBal = 0;


                const bdown: base = {};

                const prices: base = {}

                for (let i = 0; i < CryptoList.length; i++) {

                  const token = CryptoList[i];

                  const account = sAddresses[token.blocktype];

                  if(user.live == 'Yes' && token.testnet) continue;

                  if (token.type == "native") {

                    try {

                      const amount = await blockchains[token.blocktype].balance(
                        account,
                        token.rpc
                      );

                      const name = token.name.split(" ")[0];

                      const { testnet: test, symbol, value } = token;

                      const total =
                        amount -
                        (fees[value] !== undefined &&
                        fees[value] > amount
                          ? fees[value]
                          : 0);

                      const res = await axios.get(
                        `/token/price/${name}`,
                        {
                            baseURL: 'https://ab.cryptea.me'
                        }
                      );

                   
                      const price = res?.data.price;

                      prices[value] = price;

                      finalBal += total * price;

                      bdown[value] = {
                        amount: total,
                        amtFiat: total * price,
                        token: name,
                        test,
                        symbol,
                      };

                    } catch (err) {
                      
                        

                      bdown[token.value] = {
                        amount: 0,
                        amtFiat: 0,
                        token: token.name.split(" ")[0],
                        test: token.testnet,
                        symbol: token.symbol,
                      };
                    }



                  } else if (token.type == "non-native") {
                    // do stuff here
                  }

                }

                res.status(200).json({
                    error: false,
                    message: 'Success',
                    total: finalBal,
                    breakdown: bdown,
                    prices
                });

            }catch(err){

               const error = err as any;

               logger.error(error);

               res.status(400).json({
                 error: true,
                 message:
                   error?.response?.data?.message ||
                   "Something went wrong, please try again",
               });
            }

        })()

    }else{

        res.status(422).json({ error: true, message: 'Invalid request method' });

    }
   

}
