import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers'

const Xx = () => {

 const router = useRouter();

 useEffect(() => {

  ethers.Wallet.fromEncryptedJson(
    JSON.stringify({
      address: "59e5d2985f43ea0cc3c061b0413eed48ffb3d2a6",
      id: "d9c7f875-6af3-4af9-880f-f6756b394a6e",
      version: 3,
      Crypto: {
        cipher: "aes-128-ctr",
        cipherparams: { iv: "01d27e1b98f322095113ac990346e7a7" },
        ciphertext:
          "b735b1d83c8042338a95dc1643352c287c058e9f428322c900456929d5aa1dea",
        kdf: "scrypt",
        kdfparams: {
          salt: "f825ebd39c90aff828a2f68cad2a5eedcf8033485fbbbae307c27444a48f8326",
          n: 131072,
          dklen: 32,
          p: 1,
          r: 8,
        },
        mac: "59a18b3b8477f7c44e71ec8436cb3e0d859fcd78406f02ab4e487b796103e282",
      },
      "x-ethers": {
        client: "ethers.js",
        gethFilename:
          "UTC--2022-10-31T14-24-44.0Z--59e5d2985f43ea0cc3c061b0413eed48ffb3d2a6",
        mnemonicCounter: "14c63de07f8e9f257d35d50d10a05c7e",
        mnemonicCiphertext: "dfb23b305e77508214cb8c76523eb090",
        path: "m/44'/60'/0'/0/0",
        locale: "en",
        version: "0.1",
      },
    }),
    "12346"
  ).then(e => {
    console.log(e)
  }).catch(ee => {
    console.log(ee)
  });

 }, []);


  return (
    <>
    Welcome, we have been expecting you.  
    </>
  );
}

export default Xx;