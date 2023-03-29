// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import logger from "../../../app/functions/logger";

type Data = {
  message: string;
  error: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
    
    if (req.method == 'POST') {

        const { date, link, linkId } = req.body;

        (async () => {
            
            try {

                const { data: { data: subData } } = await axios.get(`/payments/${linkId}/link`, {
                    baseURL: "https://ab.cryptea.me",
                    headers: {
                        Authorization: process.env.APP_KEY || "",
                    }
                });


               if (subData.length) {

                    let total = 0;

                    const backers:string[] = [];

                    subData.forEach(({ address, amount, created_at }: any) => {

                        const mdate = new Date(created_at).getTime();

                        if (mdate >= date) {


                            total += Number(amount);


                            if ( !backers.includes(address) ) {

                                backers.push(address);

                            }
                       
                        }
                    });


                    const { data: linkData } = await axios.get(`/link/${link}`, {
                        baseURL: "https://ab.cryptea.me",
                    });    
                   


                    const { name, data: udata } = JSON.parse(
                      linkData?.data?.link?.template_data || '{ "name": "", "data": "" }'
                    );


                    udata.config = {
                        ...udata.config,
                        backers: backers.length,
                        raised: total,
                    }

                    const nData = JSON.stringify({name, data: udata});

                    await axios.patch(`/link/${linkId}/update`, {
                        template_data: nData
                    }, {
                        baseURL: "https://ab.cryptea.me",
                        headers: {
                            Authorization: process.env.APP_KEY || "",
                        }
                    });
               }

               res.status(200).json({ message: "Success", error: false });

            }catch (err) {

                const errx = err as any;

                logger.error(errx?.response?.data || errx);

                res.status(400).json({
                    message: errx?.response?.data.message || "Something went wrong, please try again",
                    error: true,
                });

            }
            
        })()        

    }else{
        res.status(422).json({ 
          message: 'Method not supported',
          error: true
      });
    }

}
