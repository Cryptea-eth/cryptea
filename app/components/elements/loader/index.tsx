import { Box, CircularProgress } from "@mui/material";
import logo from "../../../../public/images/cryptea-logo.svg";
import Image from 'next/image';
const Loader = () => {
  return (
    <div className="h-full left-0 bg-white top-0 z-[100] fixed flex flex-col justify-center items-center w-full">
      <div className="flex items-center justify-center">
        <Image
          src={logo}
          alt="cryptea"
          width={35}
          height={35}
        />
        <div className="text-black text-xl ml-[5px] font-bold">CRYPTEA</div>
        {/* <img src={logo1} alt="cryptea" width={100} /> */}
      </div>
      <Box
        className="text-[#F57059] mt-11 justify-center "
        sx={{ display: "flex" }}
      >
        <CircularProgress className="!w-[60px] !h-[60px]" color="inherit" />
      </Box>
    </div>
  );
};

export default Loader;
