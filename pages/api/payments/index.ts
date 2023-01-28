import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import axios from 'axios';


type Data = {
  proceed: boolean;
  error?:boolean; 
  message?: string;
  hash?: string;
};

const mainIx = (inter: string) => {
  const date = new Date();

  if (inter == "monthly") {
    const datex: number = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    return datex * 86400;
  } else if (inter == "yearly") {
    const year = date.getFullYear();

    return year % 4 ? 31536000 : 31622400;
  } else if (inter == "daily") {
    return 86400;
  } else if (inter == "weekly") {
    return 604800;
  }

  return 0;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if (req.method == "POST") {
      
      const body = req.body;

      let provider = new ethers.providers.JsonRpcProvider(body.rpc);

      provider.getBalance(body.account).then(async (mbalance) => {

        const currentBalance = Number(ethers.utils.formatEther(mbalance));

        if (
          body.initial != currentBalance &&
          (body.initial + Number(body.price)).toFixed(6) ==
            currentBalance.toFixed(6)
        ) {

          const gasPrice = await provider.getGasPrice();

          const tx = {
            to: body.ethAddress,
            value: mbalance,
            gasLimit: 21_000,
            gasPrice,
          };  

          const estimate = await provider.estimateGas(tx);

          const trxFee = gasPrice.mul(estimate);

          const mainTrxFee = ethers.utils.formatEther(trxFee);
          
          const newBalance = tx.value.sub(trxFee);

          tx.value = newBalance;          

          let trxData = {
            ...body.rx,
            type: body.type,
            gas: mainTrxFee,
            amount: body.amount,
            pay_type: body.pay_type,
            explorer: body.explorer,
            amountCrypto: body.price,
            token: body.label,
            chainId: body.chain,
          }; 

          if (body.type == "sub") {
            trxData = {
              ...trxData,
              remind: new Date().getTime() + mainIx(body.interval) * 1000,
              renewal: body.interval,
              interval: body.interval,
            };
          }

          axios
            .post(
              `https://ab.cryptea.me/link/pay/accounts/${body.account}`,
              {
                data: JSON.stringify(trxData),
                amount: ethers.utils.formatEther(mbalance),
                receiver: body.ethAddress,
                linkId: body.linkId
              },
              {
                headers: {
                  Authorization: process.env.APP_KEY || "",
                },
              }
            )
            .then(async ({ data }) => {
              
              if (Boolean(data.private)) {

                try {
                  const wallet = await ethers.Wallet.fromEncryptedJson(
                    data.private,
                    process.env.KEY || ""
                  );

                  const walletConnect = wallet.connect(provider);

                  await walletConnect.signTransaction(tx);

                  const trx = await walletConnect.sendTransaction(tx);

                  let post: any = {
                    ...trxData,
                    date: new Date().getTime(),
                    address: walletConnect.address,
                    hash: trx.hash,
                  };

                  await axios.post(
                    `https://ab.cryptea.me/link/payments/${body.linkId}`,
                    {
                      ...post,
                      paymentAddress: walletConnect.address,
                    },
                    {
                      headers: {
                        Authorization: process.env.APP_KEY || "",
                      },
                      timeout: 600000,
                    }
                  );

                  res.status(200).json({
                    proceed: true,
                    message: "successful",
                    error: false,
                    hash: trx.hash,
                  });
                } catch (err) {
                  const error = err as any;

                  res.status(400).json({
                    proceed: false,
                    error: true,
                    message: error.response.data.message || error.message,
                  });

                }
              } else {
                res.status(404).json({ proceed: true });
              }
            });

        } else {

          res.status(200).json({ proceed: false });
        }
      });
    } else {
      res.status(200).json({

        proceed: false
        
      });
    }

}
