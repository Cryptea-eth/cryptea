// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import http from "../../../utils/http";

type Data = {
  message: string;
  user?: any;
  token?: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


    if (req.method == 'POST') {

        const { authorization } = req.headers;

        const { user, link, pins, host } = req.body;

        ( authorization == 'null' ?
          http.post("/user", user) :
          http.patch("/user", user)
        )
          .then(({data: results}) => {

            const rel: any = {
              error: false,
              message: "Process Successful",
            };


            if (results.user !== undefined) {
              
              rel["user"] = results.user;

              rel["token"] = results.token;

            }
            

            axios
              .post("https://ab.cryptea.me/link", link, {
                headers: {
                  Authorization: `Bearer ${
                    authorization == 'null' ? rel["token"] : authorization
                  }`,
                },
              })
              .then(() => {
                axios
                  .post(`${host}/api/settlement/new`, pins, {
                    headers: {
                      Authorization: `Bearer ${
                        authorization == 'null' ? rel["token"] : authorization
                      }`,
                    },
                  })
                  .then(() => {
                    res.status(201).json(rel);
                  })
                  .catch((err) => {
                    const error = err as any;

                    console.log(error);

                    res
                      .status(
                        Number(error.response?.status || error.status || "400")
                      )
                      .json({
                        error: true,
                        message:
                          (error.response === undefined
                            ? error.message
                            : error.response?.data?.message) ||
                          "Something went wrong, please try again",
                      });
                  });
              })
              .catch((err) => {
                const error = err as any;

                res
                  .status(
                    Number(error.response?.status || error.status || "400")
                  )
                  .json({
                    error: true,
                    message:
                      (error.response === undefined
                        ? error.message
                        : error.response?.data?.message) ||
                      "Something went wrong please try again",
                  });
              });
          })
          .catch((err) => {
            const error = err as any;

            res
              .status(Number(error?.response?.status || error.status || "400"))
              .json({
                error: true,
                message:
                  (error.response === undefined
                    ? error.message
                    : error.response?.data?.message) ||
                  "Something went wrong please try again",
              });
          });

    }else{
         res.status(422).json({
           message: "Method not supported",
           error: true,
         });
    }

}
