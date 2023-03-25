import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import axios from "axios";
import { tokenTrackers } from "../../../../app/contexts/Cryptea/connectors/chains";
import mainIx from "../../../../app/functions/interval";
import logger from "../../../../app/functions/logger";

type Data = {
  proceed: boolean;
  error?: boolean;
  message?: string;
  hash?: string;
};


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    const body = req.body;

    let provider = new ethers.providers.JsonRpcProvider(body.rpc);

    (async () => {

      try {

      const mbalance = await provider.getBalance(body.account);

      
      const currentBalance = Number(ethers.utils.formatEther(mbalance));

      if (
        body.initial != currentBalance &&
        (body.initial + Number(body.price)).toFixed(6) ==
          currentBalance.toFixed(6)
      ) {

        const gasPrice = await provider.getGasPrice();

        const nonce = await provider.getTransactionCount(body.account);

        const tx: any = {
          to: body.uAddress,
          // value: mbalance,
          gasLimit: 21_000,
          gasPrice,
          nonce
        };

        const estimate = await provider.estimateGas(tx);

        const trxFee = gasPrice.mul(estimate);

        const mainTrxFee = ethers.utils.formatEther(trxFee);

        const newBalance = mbalance.sub(trxFee);

        tx.value = newBalance;

        let trxData = {
          ...body.rx,
          type: body.type,
          gas: mainTrxFee,
          amount: body.amount,
          pay_type: body.pay_type,
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

        const { data } = await axios
          .post(
            `https://ab.cryptea.me/link/pay/accounts/${body.account}`,
            {
              data: JSON.stringify(trxData),
              amount: ethers.utils.formatEther(mbalance),
              receiver: body.uAddress,
              linkId: body.linkId,
            },
            {
              headers: {
                Authorization: process.env.APP_KEY || "",
              },
            }
          )
          
          if (Boolean(data.private)) {
          
              const wallet = await ethers.Wallet.fromEncryptedJson(
                data.private,
                process.env.KEY || ""
              );

              const walletConnect = wallet.connect(provider);

              // await walletConnect.signTransaction(tx);

              const trx = await walletConnect.sendTransaction(tx);

              let post: any = {
                ...trxData,
                date: new Date().getTime(),
                address: walletConnect.address,
                hash: trx.hash,
                explorer: tokenTrackers[body.chain].link(trx.hash),
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
           
          } else {
            res.status(404).json({ proceed: true });
          }

      } else {
        res.status(200).json({ proceed: false });
      }

    } catch (err) {

      const error = err as any;

      logger.error(error);

      res.status(400).json({
        proceed: false,
        error: true,
        message: error.response?.data?.message || error.message,
      });

    }

    })()


  } else {
    res.status(200).json({
      proceed: false,
    });
  }
}
