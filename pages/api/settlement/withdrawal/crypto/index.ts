// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from 'axios';
import * as ethers from 'ethers';
import { tokenTrackers } from "../../../../../app/contexts/Cryptea/connectors/chains";

type Data = {
  message: string;
  errorType?: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
 
  if (req.method == 'POST') {

    const { authorization } = req.headers;

  

    const { addressTo, pin, amountCrypto, token, fee } = req.body;


     if (pin.length != 5) {
       res.status(400).json({
         error: true,
         message: "Your pin is incorrect",
       });
     }else if (!ethers.utils.isAddress(addressTo)) {
        res.status(400).json({
          error: true,
          message: "A valid address is required",
          errorType: 'address'
        });
     }

     console.log('here--')

        axios.get("https://ab.cryptea.me/user", {
          headers: {
            Authorization: authorization as string,
          },
        }).then(async ({ data: user }) => {

          console.log("here--s");

        try{

            const userAccts = user.settlement[0];

            const provider = new ethers.providers.JsonRpcProvider(token.rpc || '');

            const balance = token.type == 'native' ? Number(ethers.utils.formatEther(await provider.getBalance(userAccts.address))) - fee : 0;

            if (amountCrypto > balance) {

                res.status(400).json({ message: 'Insufficient funds', errorType: 'amount', error: true });
                
            }
            
            console.log('here1')

            const sendAmount = ethers.utils.parseEther(String(amountCrypto));

            const tx = {
              to: addressTo,
              value: sendAmount,
              gasLimit: 21000,
            };

            const gasPrice = await provider.getGasPrice();

            const estimate = await provider.estimateGas(tx);

            const trxFee = gasPrice.mul(estimate);

            const newBalance = tx.value.sub(trxFee);

            const totalGas = trxFee.add(21000000000000);

            if (ethers.utils.parseEther(String(balance)).sub(sendAmount).lt(totalGas)) {
              tx.value = newBalance.sub(21000000000000);
            }


            const wallet = await ethers.Wallet.fromEncryptedJson(
              userAccts.account,
              pin
            );

            const walletConnect = wallet.connect(provider);

            await walletConnect.signTransaction(tx);

            const trx = await walletConnect.sendTransaction(tx);

            console.log("here2");

            const StoredData = {
              type: "crypto",
              amount: amountCrypto,
              data: JSON.stringify({
                token: token.name,
                receiver: addressTo,
                explorer: `${tokenTrackers[token.value]}${trx.hash}`,
              }),
              desc: `${token.name} Crypto Withdrawal`,
            };

            await axios.post("https://ab.cryptea.me/settlements/new", StoredData, {
                headers: {
                    Authorization: authorization as string
                }
            });
            console.log("here3");

            res.status(201).json({
                error: false,
                message: 'Transaction Successful'
            });

        }catch(err){

        const error = err as any;

        console.log("here13");

        if (error.response !== undefined) {

            res.status(Number(error.status || "400")).json(error.response.data);

        }else{
            console.log(error)
        res
            .status(400)
            .json({ error: true, message: error.message });
        
        }

        }

    }).catch((err) => {

        const error = err as any 

        res.status(Number(error.status || '400')).json(error.response === undefined ? error.message : error.response.data.message);

    });

  }else{
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }

}
