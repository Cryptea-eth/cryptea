// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import * as ethers from "ethers";
import { tokenTrackers } from "../../../../../../app/contexts/Cryptea/connectors/chains";
import logger from "../../../../../../app/functions/logger";

type Data = {
  message: string;
  ref?: {
    name: string;
    link: string
  };
  errorType?: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    const { authorization } = req.headers;

    const {
      addressTo,
      pin,
      amountCrypto,
      token,
      fee,
      settlement: userAccts,
    } = req.body;

    if (pin.length != 5) {
      res.status(400).json({
        error: true,
        message: "Your pin is incorrect",
      });
    } else if (!ethers.utils.isAddress(addressTo)) {
      res.status(400).json({
        error: true,
        message: "A valid address is required",
        errorType: "address",
      });
    }

    (async () => {

      try {

        await axios
          .get("https://ab.cryptea.me/user", {
            headers: {
              Authorization: authorization as string,
            },
          });

          const provider = new ethers.providers.JsonRpcProvider(
            token.rpc || ""
          );

          const balance =
            token.type == "native"
              ? Number(
                  ethers.utils.formatEther(
                    await provider.getBalance(userAccts.address)
                  )
                ) - fee
              : 0;

          if (amountCrypto > balance) {
            res.status(400).json({
              message: "Insufficient funds",
              errorType: "amount",
              error: true,
            });
          }

          const sendAmount = ethers.utils.parseEther(String(amountCrypto));

          const gasPrice = await provider.getGasPrice();

          const tx = {
            to: addressTo,
            value: sendAmount,
            gasLimit: 21_000,
            gasPrice,
          };

          const estimate = await provider.estimateGas(tx);

          const trxFee = gasPrice.mul(estimate);

          const newBalance = tx.value.sub(trxFee);

          if (
            ethers.utils.parseEther(String(balance)).sub(sendAmount).lt(trxFee)
          ) {
            tx.value = newBalance;
          }

          const wallet = await ethers.Wallet.fromEncryptedJson(
            userAccts.account,
            pin
          );

          const walletConnect = wallet.connect(provider);

          // await walletConnect.signTransaction(tx);

          const trx = await walletConnect.sendTransaction(tx);

          const StoredData = {
            type: "crypto",
            amount: amountCrypto,
            data: JSON.stringify({
              token: token.name,
              receiver: addressTo,
              explorer: tokenTrackers[token.value].link(trx.hash),
            }),
            desc: `${token.name} Crypto Withdrawal`,
          };

          await axios.post(
            "https://ab.cryptea.me/settlements/new",
            StoredData,
            {
              headers: {
                Authorization: authorization as string,
              },
            }
          );

          res.status(201).json({
            error: false,
            message: "Transaction Successful",
            ref: {
              link: tokenTrackers[token.value].link(trx.hash),
              name: tokenTrackers[token.value].name,
            },
          });
        

    } catch (err) {

        const error = err as any;

        logger.error(error);

        res
          .status(Number(error?.response?.status || error?.status || "400"))
          .json({
            error: true,
            message: error?.response?.data?.message || error.message || "Something went wrong, please try again"
          });

    }

    })()
  } else {
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }
}
