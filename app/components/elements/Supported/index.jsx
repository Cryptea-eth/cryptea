import ether from "../../../images/ethereum.png";
import avax from "../../../images/avax.png";
import matic from "../../../images/polygon.png";
import Image from "next/image";

const Supported = () => {
  return (
    <div className="mt-10 mx-auto rounded-[10px] justify-between border-[1px] border-[#DEE1E6] border-solid items-center flex pl-[2pc] pr-[4pc] py-[1.5rem] supportedNetworks max-w-[2000px] 3sm:flex-col">
      <h1 className="text-black font-bold text-center 3sm:w-fit 3sm:mb-2 w-[200px] text-[30px]">
        Supported Blockchains
      </h1>

      <div className="flex 3sm:w-full ssm:flex-wrap items-center justify-between w-[60%]">
        <div className="flex justify-between items-center">
          <Image src={ether} alt="ethereum" className="mr-[10px]" />
          <span className="text-[#64607D] font-bold">Ethereum</span>
        </div>

        <div className="flex justify-between items-center">
          <Image src={matic} alt="polygon" className="mr-[10px]" />
          <span className="text-[#64607D] font-bold">Polygon</span>
        </div>

        <div className="flex justify-between items-center">
          <Image src={avax} alt="avalanche" className="mr-[10px]" />
          <span className="text-[#64607D] font-bold">Avalanche</span>
        </div>
      </div>
    </div>
  );
};

export default Supported;
