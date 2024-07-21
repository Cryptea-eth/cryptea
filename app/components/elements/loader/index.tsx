import { Box, CircularProgress } from "@mui/material";
import logo from "../../../../public/images/breew-full.png";
import Image from 'next/image';

const Loader = ({
  incLogo = true,
  text = "",
  fixed = true,
  color = undefined,
  sx = {},
  head = true,
}: {
  incLogo?: boolean;
  text?: any;
  head?: boolean;
  color?: string | undefined;
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
      {/* {head && (
        <Head>
          <title>Easily Receive Payments in Crypto | Breew </title>
        </Head>
      )} */}

      {incLogo && (
        <div className="items-center flex justify-center">
          <Image src={logo} alt="Breew" width={136} height={37.5} />
        </div>
      )}

      <Box
        className="text-[#8036de] justify-center "
        sx={{ display: "flex", color, marginTop: incLogo ? "44px" : 0 }}
      >
        <CircularProgress size={text ? 80 : 60} color="inherit" />
      </Box>
      {text !== "" && (
        <div style={{ color }} className="text-[#8036de] text-xl font-bold">
          {text}
        </div>
      )}
    </div>
  );
};

export default Loader;
