import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import axios from "axios";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  Keypair
} from "@solana/web3.js";
import mainIx  from "../../../../app/functions/interval";
const { decryptData, encryptData } = require("../../../../app/functions/crypto-data");
const bs58 = require('bs58');

import { tokenTrackers } from "../../../../app/contexts/Cryptea/connectors/chains";
import logger from "../../../../app/functions/logger";
import http from "../../../../utils/http";


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

    let provider = new Connection(body.rpc);
    
    const from = new PublicKey(body.account);

    (async () => {
    
      try {

      const mbalance = await provider.getBalance(from);
 
       const currentBalance = mbalance / LAMPORTS_PER_SOL;


       if (
         body.initial != currentBalance &&
         (body.initial + Number(body.price)).toFixed(6) ==
           currentBalance.toFixed(6)
       ) {

        let address = body.uAddress;

        if (!Boolean(address)) {

          const newWal = Keypair.generate();

          address = newWal.publicKey.toBase58();

          const solAccount = encryptData(
            bs58.encode(newWal.secretKey),
            body.username
          );

          const { data: walRes } = await http.post(
            "/update/settlement/init/no-pin",
            {
              username: body.username,
              address,
              type: "sol",
              account: JSON.stringify(solAccount),
            },
            {
              headers: {
                Authorization: process.env.APP_KEY || "",
              },
            }
          );

          if (walRes.address !== undefined) {
            address = walRes.address;
          }

        }

         const receiver = new PublicKey(address);

         const transaction = new Transaction().add(
           SystemProgram.transfer({
             fromPubkey: from,
             toPubkey: receiver,
             lamports: mbalance - 1000000,
           })
         );

         const mainTrxFee = 1000000 / LAMPORTS_PER_SOL;

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

         const { data } = await http.post(
             `/link/pay/accounts/${body.account}`,
             {
               data: JSON.stringify(trxData),
               amount: body.price,
               receiver,
               linkId: body.linkId,
             },
             {
               headers: {
                 Authorization: process.env.APP_KEY || "",
               },
             }
           ); 
           
          
             if (Boolean(data.private)) {

              
                 const secretKey = await decryptData(
                   JSON.parse(data.private),
                   process.env.KEY || ""
                 );

                 const wallet = Keypair.fromSecretKey(bs58.decode(secretKey));

                 const hash = await sendAndConfirmTransaction(
                   provider,
                   transaction,
                   [wallet]
                 );

                 let post: any = {
                   ...trxData,
                   date: new Date().getTime(),
                   address: receiver,
                   hash,
                   explorer: tokenTrackers[body.chain].link(hash),
                 };

                 await http.post(
                   `/link/payments/${body.linkId}`,
                   {
                     ...post,
                     paymentAddress: receiver,
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
                   hash,
                 });

               
             } else {
               res.status(404).json({ proceed: true });
             }

       } else {
         res.status(200).json({ proceed: false });
       }

      //  main

       } catch (err) {

        const error = err as any;

        logger.error(error);

        res.status(400).json({
          proceed: false,
          error: true,
          message: error?.response?.data?.message || error.message,
        });

       }

    })()
 
  } else {
    res.status(200).json({
      proceed: false,
    });
  }
}
