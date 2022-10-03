import { useAccount } from "wagmi";
import Carbon from "../app/templates/carbon";
import { data } from "../app/templates/carbon/data";

console.log(data)


const XX = () => {

    const { address } = useAccount();

    console.log(address)

    return <>
    </>

}

export default XX;