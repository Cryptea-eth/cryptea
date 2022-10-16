import { useAccount, useDisconnect } from "wagmi";
import { post_request } from "../app/contexts/Cryptea/requests";
import { data } from "../app/templates/carbon/data";
import { useSigner, useConnect } from 'wagmi';
import { useEffect, useState } from 'react';


const XX = () => {

    const { address, isConnected } = useAccount();

   const { connect, connectAsync, connectors, isLoading, pendingConnector } =
     useConnect();

    const { disconnect } = useDisconnect();

    const { data } = useSigner();


    useEffect(() => {
        console.log(data)
    }, [])

    console.log(data)

    return (
      <>
        <button
          onClick={async () => await connectAsync({ connector: connectors[2] })}
        >
          Connect
        </button>
        <button onClick={() => disconnect()}>Disconnect</button>
      </>
    );

}

export default XX;