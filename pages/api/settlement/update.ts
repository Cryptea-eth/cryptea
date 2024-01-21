import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import axios from "axios";
import { decryptData, encryptData } from "../../../app/functions/crypto-data";
import { Keypair } from "@solana/web3.js";
import logger from "../../../app/functions/logger";
const TronWeb = require("tronweb");
const bs58 = require("bs58");

type Data = {
  error: boolean;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method == "POST") {
    
    const data = req.body;


    if (Boolean(data.newpin) && data.newpin.length == 5) {

      (async () => {

        try{

         const rx = await axios
            .get("https://ab.cryptea.me/user", {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            })

            const { settlement, username } = rx?.data;

              if (settlement.length) {

                 const accounts = [];

                if (data.oldpin !== undefined) {


                  for (let i = 0; i < settlement.length; i++) {

                    const main = settlement[i];

                    try {

                      if (main.type == "evm") {
                        const wallet = await ethers.Wallet.fromEncryptedJson(
                          main["account"],
                          data.oldpin as string
                        );

                        const account = wallet.encrypt(data.newpin);

                        accounts.push({
                          address: main.address,
                          account,
                          type: 'evm',
                        });

                      } else if (main.type == "sol") {

                        let secret = decryptData(main.account, data.oldpin);

                        if (!Number(main.init)) {
                          // not initialized

                          secret = decryptData(main.account, username);

                          // display false pin error
                          bs58.decode(secret);

                        } else {

                          // display false pin error
                          bs58.decode(secret);

                        }

                        const account = JSON.stringify(encryptData(secret, data.newpin));


                        accounts.push({
                          address: main.address,
                          account,
                          type: 'sol',
                        });

                      }else if (main.type == 'trx') {
                          
                          let secret = decryptData(main.account, data.oldpin);

                        if (!Number(main.init)) {
                          // not initialized

                          secret = decryptData(main.account, username);

                          // display false pin error
                          bs58.decode(secret);

                        } else {

                          // display false pin error
                          bs58.decode(secret);

                        }

                        const account = JSON.stringify(encryptData(secret, data.newpin));
  
                          accounts.push({
                            address: main.address,
                            account,
                            type: 'trx',
                          });

                      }

                    } catch (error) {


                      res.status(400).json({
                        error: true,
                        message:
                          "Your current pin is incorrect, please try again",
                      });
                    }    

                  }
                                  

                  await axios.post(
                    `https://ab.cryptea.me/user/update`,
                    {
                      pin: data.newpin,
                      oldpin: data.oldpin,
                      accounts,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${data.token}`,
                      },
                    }
                  );

                  res.status(200).json({
                    error: false,
                    message: "verification mail sent successfully",
                  });

              }else{
                res.status(400).json({
                  error: true,
                  message: "Your current pin is required",
                });
              }
              
            } else {

                const wallet = ethers.Wallet.createRandom();

                const address = wallet.address;

                const account = await wallet.encrypt(data.newpin)


                const solWallet = Keypair.generate();

                const solAddress = solWallet.publicKey.toBase58();

                const solAccount = JSON.stringify(encryptData(bs58.encode(solWallet.secretKey), data.newpin));

                const trxWallet = new TronWeb({
                  fullNode: process.env.TRON || "https://api.trongrid.io",
                  solidityNode: process.env.TRON || "https://api.trongrid.io",
                })

                const trxAccount = await trxWallet.createAccount();

                const trxAccountEncrypted = JSON.stringify(encryptData(trxAccount.privateKey, data.newpin));

                    const accounts = [
                      { address, account, type: "evm" },
                      { address: solAddress, account: solAccount, type: "sol" },
                      {
                        address: trxAccount.address.base58,
                        account: trxAccountEncrypted,
                        type: "trx",
                      },
                    ];
                
                    await axios.post(
                      "https://ab.cryptea.me/user/update",
                      {
                        pin: data.newpin,
                        address,
                        accounts,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${data.token}`,
                        },
                      }
                    )

                  res.status(200).json({
                      error: false,
                      message: "verification mail sent successfully",
                    });

              }

        }catch (err) {

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
    } else {
      res.status(400).json({ error: true, message: "new pin is required" });
    }
  } else {
    res.status(422).json({
      message: "Method not supported",
      error: true,
    });
  }
}
