import empty from "../../../../public/images/coming-soon.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Typography, Box, Button, Avatar, IconButton, Modal } from '@mui/material';
import { MdAddLink, MdDeleteOutline, MdInfo, MdLink, MdModeEditOutline } from 'react-icons/md';
import { FaCoins } from 'react-icons/fa'
import Link from "next/link";
import { useMoralis } from "react-moralis";
import Loader from "../loader";
import { RiDeleteBin2Line, RiPagesLine } from "react-icons/ri";
import { BiCheck } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 300,
  width: "70%",
  maxWidth: 800,
  borderRadius: 6,
  outline: "none",
  p: 4
};

const DashLinks = () => {
  const [showLinkModal, setShowLinkModal] = useState<string>("");

  const [isLoading, loading] = useState<boolean>(true);

  const { user, Moralis, isInitialized, isAuthenticated } = useMoralis();

  const [links, addLinks] = useState<any>([]);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    }

    const Link = Moralis.Object.extend("link");

    const mlink = new Moralis.Query(Link);
    mlink.equalTo("user", user);

    mlink.find().then((e) => {
      addLinks(e);
      loading(false);
    });

  }, [isAuthenticated, isInitialized, Moralis.Object, Moralis.Query, user]);


  const deleteLink = async () => {
    Moralis.Cloud.run("deleteLink", { link: (showLinkModal).toLowerCase() })
      .then((exx) => {
        setShowLinkModal("");
        loading(true);

        const Link = Moralis.Object.extend("link");

        const mlink = new Moralis.Query(Link);
        mlink.equalTo("user", user);

        mlink.find().then((e) => {
          addLinks(e);
          loading(false);
        });
      })
      .catch((ee) => {
        console.log(ee);
      });
  }

  const handleClose = () => setShowLinkModal("");

  return (
    <div className="pt-[75px] px-5">
      {isLoading && <Loader />}

      <Modal
        open={Boolean(showLinkModal.length)}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="px-4 w-full items-center bg-white flex flex-col pt-[4rem] pb-5">
            <div className="flex items-center absolute left-0 right-0 m-auto -top-[10px] text-white rounded-[50%] h-[90px] w-[90px] bg-[#aaa] justify-center">
              <MdDeleteOutline size={40} />
            </div>

            <h2 className="text-[18px] flex items-start font-bold text-bold pb-[10px]">
              Are You Sure You Want To Delete This Link?
            </h2>

            <span>Note that this action is irreversible...</span>

            <div className="py-2 mt-3 flex justify-center">
              <Button
                variant="contained"
                className="!bg-[#aaa] !mr-2 !py-[13px] !font-medium !capitalize"
                fullWidth
                onClick={deleteLink}
              >
                <>
                  Yes{" "}
                  <RiDeleteBin2Line className="ml-3 font-medium" size={18} />
                </>
              </Button>

              <Button
                onClick={handleClose}
                variant="contained"
                className="!bg-[#F57059] !ml-2 !py-[13px] !font-medium !capitalize"
                fullWidth
              >
                No
                <BiCheck className="ml-3 font-medium" size={18} />
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      {!Boolean(links.length) && !isLoading && (
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
          <div className="h-[393px] flex">
            <Image
              src={empty}
              className="mb-3"
              width={300}
              height={300}
              alt="No links yet"
            />
          </div>

          <div className="mt-2 mb-3">
            <h2 className="text-[22px] text-center font-bold">
              Hmm, its empty here
            </h2>
            <span className="mt-2 text-[17px] block w-full text-center">
              You have no links yet, Click the button below to create links
            </span>
          </div>
          <Link href="/dashboard/links/new">
            <a>
              <Button className="py-2 font-bold px-5 !capitalize flex items-center text-black bg-[#F57059] border border-solid border-[rgb(218,220,224)] transition-all delay-500 hover:text-[#f0f0f0] rounded-lg">
                <MdAddLink size={25} className="mr-1" /> Create Link
              </Button>
            </a>
          </Link>
        </div>
      )}

      {Boolean(links.length) && !isLoading && (
        <>
          <h2 className="font-bold text-[20px] mt-6 mb-[9px]">Active Links</h2>
          <div
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            }}
            className="grid gap-6 grid-flow-dense"
          >
            <Button className="w-full rounded-md hover:border-[#f5705982] hover:bg-[#f5705982] text-[#121212] bg-transparent hover:text-white border border-solid border-[rgb(218,220,224)]">
              <Link href="/dashboard/links/new">
                <a className="flex-col p-4 w-full h-full flex justify-center items-center">
                  <MdAddLink size={50} className="mb-3" />

                  <h2 className="font-bold">Create Link</h2>
                </a>
              </Link>
            </Button>

            {links.map(({ attributes }: any, i: number) => (
              // bg-[#efefef]
              <Link href="/somewhere" key={i}>
                <a>
                  <div className="w-full border border-[rgb(218,220,224)] rounded-md border-solid p-2 hover:bg-[rgb(240,240,240)] transition-all delay-300 cursor-pointer">
                    {/* <div className="flex mt-4 justify-between items-center w-full">
                  <a
                    target="_blank"
                    href={`/user/${attributes.link.toLowerCase()}`}
                    rel="noreferrer"
                  >
                    <a>
                      <Button className="py-2 font-bold px-4 !capitalize flex items-center text-white hover:!bg-[#ff8c78b8] bg-[#f36e57b8] transition-all delay-500 rounded-lg">
                        <RiPagesLine size={19} className="mr-1" /> View Page
                      </Button>
                    </a>
                  </a>

                  <div>
                    <IconButton
                      color="inherit"
                      size={"large"}
                      sx={{ color: "#f36e57b8" }}
                    >
                      <MdModeEditOutline size={20}></MdModeEditOutline>
                    </IconButton>
                  </div>
                  <div onClick={() => setShowLinkModal(attributes.link)}>
                    <IconButton
                      color="inherit"
                      size={"large"}
                      sx={{
                        color: "#f36e57b8",
                      }}
                    >
                      <MdDeleteOutline size={20} />
                    </IconButton>
                  </div>
                </div> */}

                    <div className="mb-4">
                      <Avatar
                        sx={{
                          width: "100%",
                          height: 183,
                          margin: "auto",
                          backgroundColor: "#f5705982",
                        }}
                        className="text-[50px] font-bold"
                        variant="rounded"
                        src={""}
                      >
                        {(
                          String(attributes.link).charAt(0) +
                          String(attributes.link).charAt(1)
                        ).toUpperCase()}
                      </Avatar>
                    </div>

                    <div className="flex items-center mb-[10px] justify-between">
                      <div className="flex items-center">
                        <div className="text-white w-[40px] h-[40px] rounded-md mr-[.75rem] flex items-center justify-center bg-[#F57059]">
                          <MdLink size={21} />
                        </div>
                        <div>
                          <h3 className="truncate text-[17px] leading-[20px] font-[900] text-[#121212]">
                            {attributes.link}
                          </h3>
                          <span className="block text-[14px] leading-[1.2] truncate w-full text-[#575757]">
                            {Boolean(attributes.desc) ? attributes.desc : "•••"}
                          </span>
                        </div>
                      </div>
                      <div
                        onClick={(e: any) => {
                          e.preventDefault();

                          setShowLinkModal(attributes.link)
                        }}
                      >
                        <IconButton
                          color="inherit"
                          size={"large"}
                          sx={{
                            color: "#F57059",
                          }}
                        >
                          <FiTrash2 size={20} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashLinks;
