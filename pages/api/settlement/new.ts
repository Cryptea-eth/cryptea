import type { NextApiRequest, NextApiResponse } from "next";
import * as ethers from 'ethers';
import axios from 'axios';

type Data = {
  message: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    if (req.method == "POST") {
      const { body } = req;

      const pin = body.newpin;

      if (pin.length != 5) {
        res.status(400).json({
          error: true,
          message: "Your pin is incorrect",
        });
      }

      const wallet = ethers.Wallet.createRandom();

      const address = wallet.address;

      wallet
        .encrypt(pin)
        .then((account) => {
          axios
            .post(
              "https://ab.cryptea.me/update/settlement/pin",
              {
                pin,
                address,
                account,
              },
              {
                headers: {
                  Authorization: `Bearer ${body.token}`,
                },
              }
            )
            .then(() => {
              res.status(200).json({
                error: false,
                message: "Pin updated successfully",
              });
            })
            .catch((err) => {
              res.status(400).json({
                error: true,
                message: err.response.data.message,
              });
            });
        })
        .catch((err) => {
          res.status(200).json({
            error: false,
            message: "Something went wrong, please try again later",
          });
        });
    } else {
      res.status(422).json({
        message: "Method not supported",
        error: true,
      });
    }
}
