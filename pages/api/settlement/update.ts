import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from "ethers";
import axios from "axios";

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

      axios
        .get("https://ab.cryptea.me/user", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        })
        .then((rx) => {
          
          const { settlement } = rx?.data;

          if (settlement.length) {

            if (data.oldpin !== undefined) {
              const main = settlement[0];

              ethers.Wallet.fromEncryptedJson(
                main["account"],
                data.oldpin as string
              )
                .then((wallet) => {

                  wallet
                    .encrypt(data.newpin)
                    .then((account) => {
                        
                      axios
                        .post(
                          "https://ab.cryptea.me/user/update",
                          {
                            pin: data.newpin,
                            oldpin: data.oldpin,
                            account,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${data.token}`,
                            },
                          }
                        )
                        .then((success) => {
                          res.status(200).json({
                            error: false,
                            message: "verification mail sent successfully",
                          });
                        })
                        .catch((err) => {
                          res.status(400).json({
                            error: true,
                            message: err.response.data.message,
                          });
                        });
                    })
                    .catch(() => {
                      res.status(400).json({
                        error: true,
                        message: "Something went wrong, please try again later",
                      });
                    });
                })
                .catch((error) => {
                    console.log(error.message)
                  res.status(400).json({
                    error: true,
                    message:
                      "Your current pin is incorrect, please check and try again",
                  });
                });
            } else {
              res.status(400).json({
                error: true,
                message: "The current pin entered is incorrect",
              });
            }
          } else {
            const wallet = ethers.Wallet.createRandom();

            const address = wallet.address;

            wallet
              .encrypt(data.newpin)
              .then((account) => {
                axios
                  .post(
                    "https://ab.cryptea.me/user/update",
                    {
                      pin: data.newpin,
                      address,
                      account,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${data.token}`,
                      },
                    }
                  )
                  .then(() => {
                    res.status(200).json({
                      error: false,
                      message: "verification mail sent successfully",
                    });
                  })
                  .catch((err) => {
                    res.status(400).json({
                      error: true,
                      message: err.response.data.message,
                    });
                  });
              })
              .catch(() => {
                res.status(400).json({
                  error: true,
                  message: "Something went wrong, please try again later",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);

          

          res.status(400).json({
            error: true,
            message: "Something went wrong, please try again later",
          });
        });
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
