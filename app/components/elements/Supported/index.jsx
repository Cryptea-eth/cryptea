import ether from "../../../../public/images/ethereum.png";
import avax from "../../../../public/images/avax.png";
import matic from "../../../../public/images/polygon.png";
import Image from "next/image";

const Supported = () => {
  return (
    <div className="mt-10 mx-auto rounded-[10px] justify-between border-[1px] border-[#DEE1E6] border-solid items-center flex pl-[2pc] pr-[4pc] py-[1.5rem] supportedNetworks max-w-[2000px] 3sm:flex-col">
      <h1 className="text-black font-bold text-center 3sm:w-fit 3sm:mb-2 w-[200px] text-[30px]">
        Built On
      </h1>

      <div className="flex 3sm:w-full ssm:flex-wrap items-center justify-between w-[60%]">
        <div className="flex justify-between items-center mb-2">
          <Image src={matic} width={60} height={60} alt="polygon" />
          <span className="text-[#64607D] ml-[10px] font-bold">Polygon</span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <Image src={avax} width={60} height={60} alt="avalanche" />
          <span className="text-[#64607D] ml-[10px] font-bold">Avalanche</span>
        </div>
      </div>
    </div>
  );
};

export default Supported;
