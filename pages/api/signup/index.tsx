// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import url from 'url';

type Data = {
  message: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


    if (req.body != 'POST') {

        const { authorization } = req.headers;

        const { user, link, pins, host } = req.body;

        axios.patch('https://ab.cryptea.me/user', user, {
            headers: {
                Authorization: authorization as string
            }
        }).then(() => {

            axios.post('https://ab.cryptea.me/link', link, {
                headers: {
                    Authorization: authorization as string
                }
            }).then(() => {

                axios
                  .post(`${host}/api/settlement/new`, pins, {
                    headers: {
                      Authorization: authorization as string,
                    },
                  })
                  .then(() => {

                        res.status(201).json({
                            error: false,
                            message: "Process Successful"
                        });

                  })
                  .catch((err) => {
                    const error = err as any;

                    console.log(error);

                    res
                      .status(
                        Number(error.response.status || error.status || "400")
                      )
                      .json({
                        error: true,
                        message:
                          (error.response === undefined
                            ? error.message
                            : error.response.data.message) ||
                          "Something went wrong, please try again",
                      });
                  });                

            }).catch((err) => {
                const error = err as any;

                res
                  .status(
                    Number(error.response.status || error.status || "400")
                  )
                  .json({
                    error: true,
                    message:
                      (error.response === undefined
                        ? error.message
                        : error.response.data.message) ||
                      "Something went wrong please try again",
                  });

            });

        }).catch((err) => {

            const error = err as any;

            res.status(Number(error.response.status || error.status || "400")).json({
              error: true,
              message:
                (error.response === undefined
                  ? error.message
                  : error.response.data.message) || 'Something went wrong please try again',
            });


        });

    }else{
         res.status(422).json({
           message: "Method not supported",
           error: true,
         });
    }

}
