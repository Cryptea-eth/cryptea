import type { NextApiRequest, NextApiResponse } from 'next'
import logger from '../../../app/functions/logger';
import axios from 'axios';
import { CryptoList } from '../../../app/contexts/Cryptea/connectors/chains';
import { blockchains } from '../../../app/contexts/Cryptea/blockchains';
import { token } from '../../../app/contexts/Cryptea/types';
import { SolanaCryptoList } from '../../../app/contexts/Cryptea/connectors/solana';

type base = { [index: string]: any }; 

type Data = {
  error: boolean;
  message: string;
  breakdown?: base;
  total?: number;
  pending?: number;
  prices?: base;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
 
    if (req.method == 'GET') {

        (async () => {

            const { authorization } = req.headers;

            if (!authorization) {
              res.status(404).json({
                error: true,
                message: "not found",
              });
            }

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

                    sAddresses[v.type] = v.address;

                })

                payments.forEach((value: any) => {
                  if (value.meta !== null) {

                    const metadata = JSON.parse(value.meta);

                    fees[metadata["chain"]] = Number(metadata["discount"]);

                  }
                });

                 const prices: base = {};
                
                let finalBal = 0;

                const cryptoListObj: { [index: string]: any} = {};

                const bdown: base = {};

                const totalCryptos = [...CryptoList, ...SolanaCryptoList];

                for (let i = 0; i < totalCryptos.length; i++) {

                  const token = totalCryptos[i];

                  cryptoListObj[token.value] = token;

                  const account = sAddresses[token.blocktype];

                  if(user.live == 'Yes' && token.testnet) continue;

                  if (token.type == "native") {

                    const nSplit = token.name.split(" ");

                    try {

                      const amount = await blockchains[token.blocktype].balance(
                        account,
                        token.rpc
                      );
                      
                      const name = nSplit[0];

                      const { testnet: test, symbol, value, useSymbol = null } = token;

                      const total =
                        amount -
                        (fees[value] !== undefined &&
                        fees[value] < amount
                          ? fees[value]
                          : 0);

                     let price = prices?.[value];

                     if (!price) {

                      const res = await axios.get(
                        `/token/price/${useSymbol ? symbol : name}`,
                        {
                            baseURL: 'https://ab.cryptea.me'
                        }
                      );
                   
                      prices[value] = price = res?.data.price;

                    }

                      finalBal += total * price;


                      bdown[value] = {
                        amount: total,
                        amtFiat: total * price,
                        token: name + (nSplit[1] ? (nSplit[1].indexOf('(') == -1 ? ' '+nSplit[1] : '') : ''),
                        test,
                        blocktype: token.blocktype,
                        symbol,
                      };

                    } catch (err) {                      
                     

                      bdown[token.value] = {
                        amount: 0,
                        amtFiat: 0,
                        token: nSplit[0] + (nSplit[1] ? (nSplit[1].indexOf('(') == -1 ? ' '+nSplit[1] : '') : ''),
                        test: token.testnet,
                        symbol: token.symbol,
                      };
                    }

                  } else if (token.type == "non-native") {
                    // do stuff here
                  }

                }

                let totalPending = 0;

                if (pending.length) {

                  pending.forEach(async (dax: any) => {

                    const data = JSON.parse(dax.data);

                    const amt = dax.amountCrypto;

                    const tObj = cryptoListObj[data.chainId];

                    const token = dax.token.split(" ")[0];

                    let price = prices?.[data.chainId];

                    if (!price) {
                      const res = await axios.get(
                        `/token/price/${tObj?.useSymbol ? tObj.symbol : token.toLowerCase()}`,
                        {
                          baseURL: "https://ab.cryptea.me",
                        }
                      );

                      prices[data.chainId] = price = res?.data.price;
                    }

                    totalPending += amt * price;
                  });
                }

                res.status(200).json({
                    error: false,
                    message: 'Success',
                    total: finalBal,
                    breakdown: bdown,
                    prices,
                    pending: totalPending
                });

            }catch(err){

               const error = err as any;

               logger.error(error);

               res.status(error?.status || 400).json({
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
