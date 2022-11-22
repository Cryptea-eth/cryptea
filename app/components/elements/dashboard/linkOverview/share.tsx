
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import bigimg from "../../../../../public/images/logobig.png";
import { CgMore } from "react-icons/cg";
import copy from "copy-to-clipboard";
import {
  FaFacebookF,
  FaEnvelope,
  FaPinterest,
  FaRedditAlien,
  FaRegClone,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Modal, IconButton, Tooltip, ClickAwayListener } from "@mui/material";
import { useContext, useState } from 'react';
import { dash, DashContext } from "../../../../contexts/GenContext";
import { MdClose } from "react-icons/md";
import QrCode from "../../qrcode";

const ShareLink = ({
  open,
  toggleSocial,
  data,
}: {
  open: boolean;
  toggleSocial: (ee: boolean) => any;
  data: {
    src: string;
    usrc: string;
    desc: string;
    title: string;
    userLk: string;
    slug: string
  };
}) => {

  const { sidebar }: dash = useContext(DashContext);

  const [copied, mainCopy] = useState<boolean>(false);

 
  return (
    <>
      <Modal
        open={open}
        sx={{
          backgroundColor: 'rgb(229, 229, 229, .5)',
          alignItems: "unset",
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
            
          },
        }}
        onClose={() => toggleSocial(false)}
        className={`${
          sidebar?.openPage ? "pl-[257px]" : "pl-[87px]"
        } justify-center bg-[rgba(255,255,255,.4)] items-center flex overflow-x-hidden overflow-y-auto backdrop-blur-[2px] fixed inset-0 z-50 outline-none focus:outline-none`}
      >
        <div className="relative max-w-[1200px] 4sm:w-[60%] 42sm:w-[65%] w-[85%] min-w-[340px]">
          <div className="border-0 p-6 2md:px-4 rounded-2xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="mb-8">
              <h2
                style={{ fontFamily: "inherit" }}
                className="text-[22px] font-bold flex items-center justify-between w-full"
              >
                <span className="text-[rgb(32,33,36)]">Share</span>

                <IconButton
                  size={"large"}
                  onClick={() => toggleSocial(false)}
                  className="cursor-pointer flex items-center justify-center"
                >
                  <MdClose color={"rgb(32,33,36)"} size={18} />
                </IconButton>
              </h2>
            </div>

            <div className="cusscroller flex overflow-x-scroll overflow-y-hidden flex-nowrap px-4 pb-4 mb-9">
              <EmailShareButton
                subject={""}
                separator={"\n"}
                body={`${Boolean(data.desc) ? data.desc : ""}`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaEnvelope color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Email</span>
                </div>
              </EmailShareButton>
              <TwitterShareButton
                title={`${Boolean(data.desc) ? data.desc : ""} ${
                  String(data.desc).toLowerCase().indexOf("@usecryptea") != -1
                    ? ""
                    : "@usecryptea"
                } ${
                  String(data.desc).toLowerCase().indexOf("#cryptea") != -1
                    ? ""
                    : "#cryptea"
                } \n`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaTwitter color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Twitter</span>
                </div>
              </TwitterShareButton>
              {/* <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                          <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                            <FaDiscord color={"#6a6a6a"} size={35} />
                          </div>

                          <span className="font-semibold text-[#777]">
                            Discord
                          </span>
                        </div> */}
              <WhatsappShareButton
                separator={"\n"}
                title={`${Boolean(data.desc) ? data.desc : ""}`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaWhatsapp color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Whatsapp</span>
                </div>
              </WhatsappShareButton>
              <TelegramShareButton
                title={`${Boolean(data.desc) ? data.desc : ""} \n`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaTelegramPlane color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Telegram</span>
                </div>
              </TelegramShareButton>
              <FacebookShareButton
                title={`${Boolean(data.desc) ? data.desc : ""} \n`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaFacebookF color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Facebook</span>
                </div>
              </FacebookShareButton>

              <RedditShareButton
                title={`${Boolean(data.desc) ? data.desc : ""} \n`}
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaRedditAlien color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Reddit</span>
                </div>
              </RedditShareButton>
              <PinterestShareButton
                title={`${Boolean(data.desc) ? data.desc : ""} \n`}
                media={
                  Boolean(data.src)
                    ? data.src
                    : Boolean(data.usrc)
                    ? data.usrc
                    : bigimg.src
                }
                url={data.userLk}
              >
                <div className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9">
                  <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                    <FaPinterest color={"#6a6a6a"} size={35} />
                  </div>

                  <span className="font-semibold text-[#777]">Pinterest</span>
                </div>
              </PinterestShareButton>

              <div
                onClick={() => {
                  const shareData = {
                    title: Boolean(data.title) ? data.title : "",
                    text: Boolean(data.desc) ? data.desc : "",
                    url: data.userLk,
                  };

                  navigator.share(shareData);
                }}
                className="flex h-[120px] justify-between items-center flex-col cursor-pointer pr-9"
              >
                <div className="w-[80px] flex items-center justify-center h-[80px] bg-[#2020200e] rounded-[50%]">
                  <CgMore color={"#6a6a6a"} size={40} />
                </div>

                <span className="font-semibold text-[#777]">More</span>
              </div>
            </div>

            <div className="w-fit m-auto">
              <QrCode
                style={{
                  marginBottom: "16px",
                }}
                data={data.userLk}
              />
            </div>

            <div>
              <h2 className="text-[18px] text-[#5a5a5a] mb-3 font-bold w-full">
                Link
              </h2>

              <div className="w-full items-center mx-[2px] rounded-md flex justify-between bg-[#2020200e] py-1 px-3">
                <span className="text-[#919191] h-fit">
                  {window.location.origin}/user/{data.slug}
                </span>
                <ClickAwayListener onClickAway={() => mainCopy(false)}>
                  <Tooltip
                    placement="top"
                    onClose={() => mainCopy(false)}
                    open={copied}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    PopperProps={{
                      disablePortal: true,
                    }}
                    arrow
                    title="Copied"
                  >
                    <IconButton
                      size={"large"}
                      onClick={() => {
                        mainCopy(true);
                        copy(data.userLk);
                      }}
                    >
                      <FaRegClone
                        color={"#919191"}
                        className="cursor-pointer"
                        size={16}
                      />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShareLink;