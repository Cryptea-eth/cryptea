import PropTypes from "prop-types";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
// import "../../assets/styles/auth.css";;
import Image from 'next/image';
import Head from 'next/head';
import empty from "../../public/images/coming-soon.svg";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedinIn, FaLink } from 'react-icons/fa';
import Link from 'next/link'
import {
  OutlinedInput,
  Box,
  MenuItem,
  Avatar,
  Tabs,
  Tab,
  ToggleButton,
  Typography,
  FormControl,
  Select,
  ToggleButtonGroup,
  TextField,
  Button
} from "@mui/material";

import { useMoralis, useMoralisQuery, useWeb3Transfer } from "react-moralis";

import Loader from "../../app/components/elements/loader";

import { useState, useEffect, SetStateAction } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Polygon", "Avalanche", "Ethereum", "Binance Smart Chain"];

function getStyles(name: string, blockchainName: string | any[], theme: Theme) {
  return {
    fontWeight:
      blockchainName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function User() {

  const router = useRouter();


  let username = router.query['slug'];


  useEffect(() => {

  }, [username, router.isReady])

  const [alignment, setAlignment] = useState();

  const changeAlignMent = (event: any, newAlignment: SetStateAction<undefined>) => {
    setAlignment(newAlignment);
  };


  const { Moralis, isWeb3Enabled, enableWeb3 } = useMoralis();

  const [userD, setUserD] = useState({});
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    if (router.isReady) {

      const Link = Moralis.Object.extend('link')
      const lQ = new Moralis.Query(Link);
      lQ.equalTo('link', String(username).toLowerCase())

      lQ.find().then((er) => {
        console.log(er)
        if (er !== undefined) {
          Moralis.Cloud.run("getUser", { obj: er[0]?.get("user").id }).then(
            (ex) => {
              setUserD({
                description: ex[0]?.get("desc"),
                username: ex[0]?.get("username"),
                email: ex[0]?.get("email"),
                ethAddress: ex[0]?.get("ethAddress"),
                img: ex[0]?.get("img") === undefined ? "" : ex[0]?.get("img"),
              });

              setIsLoading(false);
            }
          );
        } else {
          window.location.href = "/404";
        }
      });
    }
  }, [Moralis.Cloud, Moralis.Object, Moralis.Query, router.isReady, username]);

  const { username: usern, description, email, img, ethAddress }: { username?: string, description?: string, email?: string, img?: string | null, ethAddress?: string } = userD;

  if (!userD) {
    window.location.href = "/404";
  }

  const [value, setValue] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [enableWeb3, isWeb3Enabled])

  const {
    fetch: fetched,
    error,
    isFetching,
  } = useWeb3Transfer({
    type: "native",
    amount: Moralis.Units.ETH(amount),
    receiver: ethAddress,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSelectChange = (event: { target: { value: any; }; }) => {
    const {
      target: { value },
    } = event;
    setBlockchainName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const theme = useTheme();
  const [blockchainName, setBlockchainName] = useState([]);

  return (
    <div>

      <Head>
        <title>{usern} | Cryptea</title>
        <meta name="description" content={`Send tips to ${usern} quick and easy`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full h-full bg-white">
          <div className="img relative h-[150px] bg-[#dfcdb3]">
            <div
              className="bg-repeat h-[135px] bg-[#FFEBCD] bg-pattern"
              style={{
                backgroundSize: 90,
                backgroundBlendMode: "multiply",
              }}
            ></div>
            <div className="absolute border-solid border-[4px] p-1 border-[#f57059] rounded-[50%] left-0 right-0 m-auto bottom-[-29px] w-fit">
              {!img?.length ? (
                <Avatar
                  sx={{
                    bgcolor: "#F57059",
                    width: 140,
                    height: 140,
                  }}
                  className="!font-bold !text-[35px]"
                  alt={usern}
                >
                  {usern?.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar
                  src={img}
                  sx={{ width: 140, height: 140 }}
                  alt={usern}
                ></Avatar>
              )}
            </div>
          </div>
          <div className="flex flex-row usm:flex-col">
            <div className="w-3/5 usm:mb-4 usm:w-full px-8">
              <div className="text-4xl font-semibold mt-8">
                {usern} is {description}
              </div>
              <div className="text-[#838383] text-lg mt-8">
                {description}
              </div>
              <div className="flex justify-between text-[#838383] 3sm:px-16 4sm:px-16 mt-6">
                  <Link href='#'>
                      <FaInstagram size={30} color="#F57059"
                    />
                  </Link>
                  <Link href='https://twitter.com/adetemi03'>
                      <FaTwitter color="#F57059"
                      size={30}
                      className="" />
                  </Link>
                  <Link href='#'>
                      <FaFacebook size={30} color="#F57059"
                    />
                  </Link>
                  <Link href='#'>
                      <FaLinkedinIn size={30} color="#F57059"
                    />
                  </Link>
              </div>

              <div className="links mt-5">
                <div className="bg-[#f5705924] text-[#F57059] font-bold rounded-full p-4">
                  Support Lucid&#39;s Business
                </div>
              </div>
            </div>
            <div className="w-2/5 2usm:w-full usm:w-[85%] usm:m-auto min-w-[340px] px-6 my-8 justify-items-center">
              <div className="rounded-lg bg-white shadow-lg shadow-[#cccccc]">
                <div className="border-b py-[14px] px-[17px] text-lg font-semibold">
                  Send Payment
                </div>
                <div className="form pt-4">
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Tabs
                        value={value} onChange={handleChange} aria-label="payment tabs">
                        <Tab
                          className="!font-bold !rounded-[4px] !capitalize"
                          label="Onetime😇"
                          {...a11yProps(0)}
                        />
                        <Tab
                          className="!font-bold !rounded-[4px] !capitalize"
                          label="Monthly😍"
                          {...a11yProps(1)}
                        />
                        <Tab
                          className="!font-bold !rounded-[4px] !capitalize"
                          label="Annually🙏"
                          {...a11yProps(2)}
                        />
                      </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                      <FormControl fullWidth>
                        <Select
                          disabled
                          displayEmpty
                          value={blockchainName}
                          onChange={handleSelectChange}
                          input={<OutlinedInput />}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <span>Select Blockchain</span>;
                            }

                            return selected.join(", ");
                          }}
                          MenuProps={MenuProps}
                          inputProps={{ "aria-label": "Without label" }}
                        >
                          <MenuItem value="">Select Blockchain</MenuItem>
                          {names.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, blockchainName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>

                        <div className="py-3 font-bold">Amount</div>

                        <ToggleButtonGroup
                          value={amount}
                          exclusive
                          className="w-full justify-between"
                          onChange={(e: any) => {
                            const val = e.target.value;
                            setAmount(parseFloat(val.replace(/[^\d.]/g, "")));
                          }}
                        >
                          <ToggleButton value="0.1">0.1</ToggleButton>
                          <ToggleButton value="1">1</ToggleButton>
                          <ToggleButton value="10">10</ToggleButton>
                          <ToggleButton value="50">50</ToggleButton>
                          <ToggleButton value="100">100</ToggleButton>
                        </ToggleButtonGroup>

                        <div className="py-3 font-bold">
                          Or input Amount manually
                        </div>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Input Price"
                          variant="outlined"
                          value={amount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const val = e.target.value;
                            setAmount(parseFloat(val.replace(/[^\d.]/g, "")));
                          }}
                        />

                        <Button
                          variant="contained"
                          className="!bg-[#F57059] !mt-4 !py-[13px] !font-medium !capitalize"
                          style={{
                            fontFamily: "inherit",
                          }}
                          onClick={() => {
                            fetched().then(f => {
                              console.log(f)
                            })
                          }}
                          disabled={isFetching}
                          fullWidth
                        >
                          Send
                        </Button>
                      </FormControl>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <div
                        className="empty"
                        style={{
                          display: "flex",
                          width: "100%",
                          height: "fit-content",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={empty}
                          className="mb-3"
                          style={{
                            width: "300px",
                          }}
                          alt="Would Be Released soon"
                        />

                        <h2 className="mt-2 font-bold">
                          This Feature would be released soon
                        </h2>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div
                        className="empty"
                        style={{
                          display: "flex",
                          width: "100%",
                          height: "fit-content",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={empty}
                          className="mb-3"
                          style={{
                            width: "300px",
                          }}
                          alt="Would Be Released soon"
                        />

                        <h2 className="mt-2 font-bold">
                          This Feature would be released soon
                        </h2>
                      </div>
                    </TabPanel>
                  </Box>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
