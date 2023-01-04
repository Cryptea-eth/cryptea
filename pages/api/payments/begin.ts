import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import axios, { AxiosError } from 'axios';

type Data = {
  message: string,
  success: boolean
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
    if (req.method == 'POST') {

        const body = req.body;

        const tx = {
            to: body.ethAddress,
            value: ethers.utils.parseEther(body.price),
        };

        axios
          .get(`https://ab.cryptea.me/link/pay/accounts/${body.account}`, {
            headers: {
              Authorization: process.env.APP_KEY || '',
            },
          })
          .then(async ({ data }) => {

            console.log(data);

            if (Boolean(data.private)) {
              try {
                const provider = new ethers.providers.JsonRpcProvider(body.rpc);

                const wallet = await ethers.Wallet.fromEncryptedJson(
                  data.private,
                  process.env.KEY || ''
                );

                const walletConnect = wallet.connect(provider);

                await walletConnect.signTransaction(tx);

                const trx = await walletConnect.sendTransaction(tx);

            //     ...rx,
            // date: new Date().getTime(),
            // address: from,
            // api: apiCode,
            // type,
            // amount: price,
            // hash: init.hash,
            // explorer: tokenTrackers[token.value].link,
            // amountCrypto: ether,
            // token: token.name,
            // contractAddr: token.contractAddr,
            // paytype: "auto",
            // linkId,
          // chain: token.value,

                let post: any = {
                  ...body.rx,
                  date: new Date().getTime(),
                  address: walletConnect.address,
                  type: body.type,
                  amount: body.amount,
                  hash: trx.hash,
                  pay_type: body.pay_type,
                  explorer: body.explorer,
                  amountCrypto: body.price,
                  token: body.label
                };

                if (body.type == "sub") {
                  post = {
                    ...post,
                    remind: new Date().getTime() + mainIx(body.interval) * 1000,
                    renewal: body.interval,
                    interval: body.interval
                  };
                }

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
                    timeout: 600000
                  }
                );

                return res
                  .status(200)
                  .json({ success: true, message: trx.hash });
              } catch (err) {
                const error = err as AxiosError | Error;
                return res
                  .status(400)
                  .json({ success: false, message: String(error.message) });
              }
            } else {
              return res
                .status(404)
                .json({
                  success: false,
                  message:
                    "Something went wrong, please refresh the page or contact support",
                });
            }
          });


    }
}
