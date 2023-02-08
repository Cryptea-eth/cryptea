import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { get_request } from "../app/contexts/Cryptea/requests";
import * as ethers from 'ethers'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserRejectedRequestError, useAccount, useConnect, useDisconnect } from "wagmi";

const Xx = () => {

 const router = useRouter();

 const { disconnect } = useDisconnect();

 const { data, isLoading, error } = useConnect();


 const { isConnected, connector } = useAccount();

 let timer:any;


 const updateHead = () => {

    const elem = document.querySelector("#rk_connect_title");

    if (elem !== null) {

      elem.innerHTML = `<a class="flex flex-row max-w-[116px] min-w-[116px] items-center justify-between" href="/" style="transform: scale(0.7);left: -8px;margin-bottom: 2px;position: relative;"><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="cryptea" src="/_next/static/media/cryptea-logo.ddb81f5d.svg" decoding="async" data-nimg="intrinsic" class="min-w-[30px]" srcset="/_next/static/media/cryptea-logo.ddb81f5d.svg 1x, /_next/static/media/cryptea-logo.ddb81f5d.svg 2x" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></span><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2782%27%20height=%2715%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="cryptea" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcryptea.f669576e.png&amp;w=256&amp;q=75" decoding="async" data-nimg="intrinsic" class="min-w-[30px]" srcset="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcryptea.f669576e.png&amp;w=96&amp;q=75 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcryptea.f669576e.png&amp;w=256&amp;q=75 2x" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"></span></a> Launch App `;


      (document.querySelector("._1vwt0cg2") || { classList: { add: (xx: string) => {  } } })?.classList.add('cusscroller');

      clearTimeout(timer);

    }else{
        timer = setTimeout(updateHead, 50);
    }

 }

 useEffect(() => {
   if (isConnected && localStorage.getItem("userToken") === null) {
     console.log("Begin Auth");
   }

   if (
     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
       navigator.userAgent
     )
   ) {
     // true for mobile device
      console.log("mobile device");
   } else {
     // false for not mobile device
     console.log("not mobile device");
   }

 }, [isConnected, data, isLoading, error]);





  return (
    <>

    useConnectModal()

      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
            
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            

            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {

                  if (!connected) {

                    return (
                      <button onClick={() => {
                        openConnectModal();

                        updateHead();

                      }} type="button">
                        Connect Wallet
                      </button>
                    );
                  }else{

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                     
                      <button onClick={openAccountModal} type="button">
                        {account.displayName}
                      </button>
                    </div>
                  );

                }
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    </>
  );
}

export default Xx;