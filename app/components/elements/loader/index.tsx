import { Box, CircularProgress } from "@mui/material";
import logo from "../../../../public/images/cryptea-logo.svg";
import Image from 'next/image';

const Loader = ({
  incLogo = true,
  text = '',
  fixed = true,
  sx = {},
}: {
  incLogo?: boolean;
  text?: any;
  fixed?: boolean;
  sx?: object;
}) => {
  return (
    <div
      style={{
        position: fixed ? "fixed" : "absolute",
        justifyContent: text ? "space-around" : "center",
        ...sx,
      }}
      className="h-full left-0 bg-white top-0 z-[10000000] flex flex-col justify-center items-center w-full"
    >
      {incLogo && (
        <div className="items-center flex justify-center">
          <Image src={logo} alt="cryptea" width={35} height={35} />
          <div className="text-black text-xl ml-[5px] font-bold">CRYPTEA</div>
          {/* <img src={logo1} alt="cryptea" width={100} /> */}
        </div>
      )}
      <Box
        className="text-[#F57059] mt-11 justify-center "
        sx={{ display: "flex" }}
      >
        <CircularProgress
          size={text ? 80 : 60}
          color="inherit"
        />
      </Box>
      {text !== "" && (
        <div className="text-[#f57059] text-xl font-bold">{text}</div>
      )}
    </div>
  );
};

export default Loader;
