import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import * as ethers from 'ethers'; 

type Data = {
  error: boolean,
  data?: string | object,
  message?: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const timeout = (address: string) => setTimeout(() => {
    
    axios.post("https://ab.cryptea.me/link/pay/accounts/revert", {
      address 
    }, {
      headers: {
          Authorization: process.env.APP_KEY || ''
      }
    });

  }, 780000)
  
    if(req.method == 'GET'){

      const { query } = req;

      const type = Boolean(query['type']) ? query['type'] : 'evm';


      axios
        .get(`https://ab.cryptea.me/link/pay/account/${type}`, {
          headers: {
            Authorization: process.env.APP_KEY || "",
          },
        })
        .then(async (accounts) => {

          const selected: any = accounts.data.data;


          if (Boolean(selected.private)) {
            const encrypted = selected.private;


            try {

            let wallet = ethers.Wallet.fromEncryptedJsonSync(
              encrypted,
              process.env.KEY || ""
            );

            console.log(wallet.address);

            timeout(wallet.address);

            return res.status(200).json({ error: false, data: wallet.address });
            
            }catch (err) {
              const error = err as Error;

              return res.status(400).json({ error: true, message: error.message });
            }

          }else {
              console.log('here')
          }
          // } else {

          //   console.log('here')

          //   let wallet = ethers.Wallet.createRandom();

          //   const encrypted = await wallet.encrypt("123456");

          //   await axios.post(
          //     "https://ab.cryptea.me/link/pay/accounts",
          //     {
          //       account: wallet.address,
          //       private: encrypted,
          //       type,
          //     },
          //     {
          //       headers: {
          //         Authorization: process.env.APP_KEY || "",
          //       },
          //     }
          //   );

          //   timeout(wallet.address);

          //   return res.status(200).json({ error: false, data: wallet.address });
          // }
        })
        .catch((err) => {
          // console.log(err);
          return res
            .status(408)
            .json({
              error: true,
              message: "Something went wrong please try again",
            });
        });         
        
    }

}