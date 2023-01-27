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

      const { body, headers } = req;

      const pin = body.newpin;

      const { authorization } = headers;

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
                  Authorization: authorization as string,
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
                message: err.response.data.message || 'Something went wrong, please try again',
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
