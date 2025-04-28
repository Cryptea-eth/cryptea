import { useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { IoMdClose } from "react-icons/io";
import { makeStorageClient } from "../../app/functions/clients";
import { MdVisibilityOff, MdVisibility, MdOutlineVisibility, MdOutlineVisibilityOff, MdClose } from "react-icons/md";
import PinField from "react-pin-field";
import {
  Button,
  OutlinedInput,
  Avatar,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  InputLabel,
  Box,
  TextField,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { get_request, post_request } from "../../app/contexts/Cryptea/requests";
import axios, { AxiosError } from "axios";
import Router from "next/router";
import { useCryptea } from "../../app/contexts/Cryptea";
import Page from "../../app/components/elements/dashboard";
import Loader from "../../app/components/elements/loader";
import Head from "next/head";
import http from "../../utils/http";

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "px";
}

const Settings = () => {
  const { isAuthenticated, validator, logout } = useCryptea();
  const [dp, setDp] = useState<string | undefined>();
  const [userLink, setUserLink] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInfo, setuserInfo] = useState<string>("");

  const [isLoading, setLoading] = useState({
    account: false,
    security: false,
    link: false,
    progress: [0, 0],
  });

  const [crop, setCrop] = useState<PixelCrop>({
    width: 50,
    unit: "px",
    height: 50,
    x: 0,
    y: 0,
  });

  const [simg, setsImg] = useState<string | undefined>("");

  const [iimg, setIiimg] = useState({});

  const [result, setResult] = useState(null);

  const [data, setData] = useState<any>({});

  const [openM, setOpenM] = useState(false);

  const handleOpenM = () => setOpenM(true);
  const handleCloseM = () => setOpenM(false);

  const [pins, setPin] = useState<{ [index: string]: string }>({
    oldpin: "",
    newpin: "",
    renewpin: "",
  });

  const [pinsVisibility, setPinVisibility] = useState<{
    [index: string]: boolean;
  }>({
    oldpin: true,
    newpin: true,
    renewpin: true,
  });

  const [pageLoading, loading] = useState<boolean>(true);

  const [error, setError] = useState({
    account: "",
    security: "",
    link: "",
  });

  const [success, setSuccess] = useState({
    account: "",
    security: "",
    link: "",
  });

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        Router.push("/auth");
      } else {
        "user".get("*", true).then((e: any) => {
          setData(e);
          setDp(e.img);
          if(!Boolean(e.settlement.length)) setPin({ ...pins, oldpin: '00000' });
          loading(false);
        });
      }
    }
  }, [isAuthenticated]);

  const submitAccount = async () => {
    document.querySelector("#account_sett")?.scrollIntoView();
    window.scrollTo(0, 0);
    setError({
      ...error,
      account: "",
    });
    setSuccess({
      ...success,
      account: "",
    });
    let more = true;
    setLoading({ ...isLoading, account: true });

    [userInfo, userEmail].forEach((d) => {
      if (!d.length) {
        setError({
          ...error,
          account: "Data Incomplete, Please required fields should be field",
        });

        setLoading({ ...isLoading, account: false });
        more = false;
      }
    });

    if (more) {
      if (!validator.isAlphanumeric(userInfo)) {
        setError({
          ...error,
          account: "Username cannot contain special characters or spaces",
        });
        setLoading({ ...isLoading, account: false });
      }

      const email = validator.normalizeEmail(userEmail);

      if (!validator.isEmail(email ? email : "")) {
        setError({ ...error, account: "Email Address Is Incorrect" });
        setLoading({ ...isLoading, account: false });
      }

      if (!error["account"].length) {
        try {
          await post_request("/user/update", {
            username: userInfo,
            email: validator.normalizeEmail(userEmail),
          });

          await logout();

          setSuccess({
            ...success,
            account: `Account Details Saved, we sent a mail to your account email, click the link to complete update`,
          });

          setLoading({ ...isLoading, account: false });
        } catch (err) {
          const erro = err as AxiosError;

          if (erro.response) {
            const errorx: any = erro.response.data;

            setError({
              ...error,
              account: errorx.message,
            });
          } else {
            // console.log(erro.message)
            setError({
              ...error,
              account: "Something went wrong, please try again",
            });
          }

          setLoading({ ...isLoading, account: false });
        }
      }
    }
  };

  const imgCrop = (
    event: React.SyntheticEvent & { target: HTMLInputElement }
  ) => {
    handleOpenM();

    if (event.target.files !== null) {
      const fil = event.target.files[0];
      const { type, size } = fil;
      const ee = ["image/jpeg", "image/jpg", "image/png"];

      if (!ee.includes(type)) {
        setError({
          ...error,
          account: "Only JPEG, jpg, and png image types are accepted",
        });
        return;
      }

      if (size > 5243880) {
        setError({ ...error, account: "Image Size Exceeds The Limit Of 5mb" });
        return;
      }

      setsImg(URL.createObjectURL(fil));
      setIiimg(fil);
    }
  };

  const beginUpload = async (files: File[], type: string) => {
    const { size: totalSize } = files[0];

    const onRootCidReady = (cid: string) => {
      setError({ ...error, account: "" });
      setSuccess({
        ...success,
        account:
          "Image Uploaded Successfully, might take a while to fully reflect",
      });
      const img = `https://${cid}.ipfs.dweb.link/${data.username}.${type}`;
      setDp(img);

      "user".update({
        img,
      });

      handleCloseM();
    };

    let uploaded = 0;

    const onStoredChunk = (size: number) => {
      uploaded += size;

      const pct = (totalSize / uploaded) * 100;

      // console.log(`Uploading... ${pct.toFixed(2)}% complete`);

      setLoading({ ...isLoading, progress: [pct, uploaded] });
    };

    const token = await get_request("/storagekey", {}, undefined, false);

    const client = makeStorageClient(token!.data);

    return client.put(files, { onRootCidReady, onStoredChunk });
  };

  const cropImg = () => {
    const img = document.querySelector(".img") as HTMLImageElement;

    try {
      const canvas = document.createElement("canvas") as HTMLCanvasElement;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      canvas.width = crop?.width === undefined ? 0 : crop?.width;
      canvas.height = crop?.height === undefined ? 0 : crop?.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        img,
        (crop?.x !== undefined ? crop?.x : 0) * scaleX,
        (crop?.y !== undefined ? crop?.y : 0) * scaleY,
        (crop?.width !== undefined ? crop?.width : 0) * scaleX,
        (crop?.height !== undefined ? crop?.height : 0) * scaleY,
        0,
        0,
        crop?.width !== undefined ? crop?.width : 0,
        crop?.height !== undefined ? crop?.height : 0
      );

      const { type }: { type?: string } = iimg || {};
      const ext = type?.split("/");
      canvas.toBlob(
        (blob) => {
          if (blob !== null && ext !== undefined) {
            const files = [new File([blob], `${data.username}.${ext[1]}`)];
            beginUpload(files, ext[1]);
          }
        },
        type,
        1
      );
    } catch (e) {
      const err = e as Error;
      setError({ ...error, account: err?.message });
    }
  };

  const { username, email } = data;

  const [settlePin, updateSettlePin] = useState<boolean>(false);

  const [genSetError, setGenSetError] = useState<string>("");

  const closeSettleModal = () => updateSettlePin(false);

  const [pinLoading, setPinLoading] = useState<boolean>(false);

  const savePin = async () => {

   
    if (pinLoading) {
      return;
    }

    setGenSetError("");

    setSuccess({
      ...success,
      account: "",
    });

    let more = true;

    setPinLoading(true);

    Object.values(pins).forEach((e) => {
      if (
        !Boolean(e) || e.length != 5 
      ) {
        document.querySelector(".pinerror")?.scrollIntoView();

        setGenSetError(
          "Data Incomplete, Please required fields should be field"
        );
        setPinLoading(false);

        more = false;
      }
    })

    if (pins['newpin'] != pins['renewpin']) {
      document.querySelector(".pinerror")?.scrollIntoView();

        setGenSetError(
          "Re-entered pin does not match new pin"
        );
        setPinLoading(false);

        more = false;
    }

    if (pins["newpin"] == pins["oldpin"]) {
      document.querySelector(".pinerror")?.scrollIntoView();

      setGenSetError("Current pin and new pin should not match");
      setPinLoading(false);

      more = false;
    }

    if (more && !error["account"].length) {

        try {

          const newData: {[index:string]: string} = {
            newpin: pins['newpin']
          };

          if (Boolean(data.settlement.length)) newData['oldpin'] = pins['oldpin'];
        
          await http.post(`/api/settlement/update`, {  
              ...newData, token: localStorage.getItem('userToken')
          }, {
            baseURL: window.origin,
          });

          await logout();

          setSuccess({
            ...success,
            account: `Account Details Saved, we sent a mail to your account email, click the link to complete update`,
          });

          setPinLoading(false);

          closeSettleModal(); 

            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 1000);  

        } catch (err) {
          const erro = err as AxiosError;

          if (erro.response) {
            const errorx: any = erro.response.data;

            setGenSetError(errorx.message);
            
          } else {
            // console.log(erro.message)
            setGenSetError("Something went wrong, please try again");
          }

          document.querySelector(".pinerror")?.scrollIntoView();

          setPinLoading(false);

        }
    }
  };

  return (
    <Page>
      <Head>
        <title>Settings | Dashboard | Breew</title>
        <meta name="description" content={`Change User Settings Easily`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {pageLoading && <Loader />}

        {!pageLoading && (
          <div className="2sm:pr-1 pt-[75px] sett dashbody cusscroller overflow-y-scroll overflow-x-hidden px-5 pb-5 h-[calc(100%-75px)]">
            {settlePin && (
              <>
                <Modal
                  open={settlePin}
                  sx={{
                    "&& .MuiBackdrop-root": {
                      backdropFilter: "blur(5px)",
                      width: "calc(100% - 8px)",
                    },
                  }}
                  onClose={closeSettleModal}
                  className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
                  aria-labelledby="Change settlement pin, to approve transactions"
                  aria-describedby="Change Pin"
                >
                  <Box
                    className="sm:w-full h-fit 3mdd:px-[2px]"
                    sx={{
                      minWidth: 300,
                      width: "70%",
                      maxWidth: 800,
                      borderRadius: 6,
                      outline: "none",
                      p: 4,
                      position: "relative",
                      margin: "auto",
                    }}
                  >
                    <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem] 3mdd:text-[1.25rem]">
                            {Boolean(data.settlement.length)
                              ? "Update Settlement Pin"
                              : "Create Settlement Pin"}
                          </h2>
                          <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                            {Boolean(data.settlement.length)
                              ? "Change Pin to approve settlement transactions"
                              : "Create pin to be able to approve settlement transactions"}
                          </span>
                        </div>

                        <IconButton size={"medium"} onClick={closeSettleModal}>
                          <MdClose
                            size={20}
                            color={"rgb(32,33,36)"}
                            className="cursor-pointer"
                          />
                        </IconButton>
                      </div>

                      {Boolean(genSetError) && (
                        <div className="bg-[#ff8f33] text-white rounded-md w-[95%] font-bold mt-2 pinerror mx-auto p-3">
                          {genSetError}
                        </div>
                      )}

                      {Boolean(data.settlement.length) && (
                        <div className="py-3">
                          <div className="flex text-[#565656] items-center justify-between">
                            <label className="text-[#565656] mb-2 font-[600]">
                              Current Pin
                            </label>

                            <IconButton
                              onClick={() =>
                                setPinVisibility({
                                  ...pinsVisibility,
                                  oldpin: !pinsVisibility["oldpin"],
                                })
                              }
                              size={"medium"}
                            >
                              {pinsVisibility["oldpin"] ? (
                                <MdOutlineVisibility size={23} />
                              ) : (
                                <MdOutlineVisibilityOff size={23} />
                              )}
                            </IconButton>
                          </div>
                          <div className="flex justify-center item-center ">
                            <PinField
                              length={5}
                              type={
                                !pinsVisibility["oldpin"] ? "text" : "password"
                              }
                              onComplete={(e) => setPin({ ...pins, oldpin: e })}
                              className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] rounded-[.5rem] 2usmm:!justify-start my-3 mx-auto"
                              validate={/^[0-9]$/}
                            />
                          </div>
                        </div>
                      )}

                      <div className="py-3">
                        <div className="flex text-[#565656] items-center justify-between">
                          <label className="text-[#565656] mb-2 font-[600]">
                            New Pin
                          </label>

                          <IconButton
                            onClick={() =>
                              setPinVisibility({
                                ...pinsVisibility,
                                newpin: !pinsVisibility["newpin"],
                              })
                            }
                            size={"medium"}
                          >
                            {pinsVisibility["newpin"] ? (
                              <MdOutlineVisibility size={23} />
                            ) : (
                              <MdOutlineVisibilityOff size={23} />
                            )}
                          </IconButton>
                        </div>
                        <div className="flex justify-center item-center ">
                          <PinField
                            length={5}
                            type={
                              !pinsVisibility["newpin"] ? "text" : "password"
                            }
                            onComplete={(e) => setPin({ ...pins, newpin: e })}
                            className="font-[inherit] 2usmm:!justify-start outline-none border border-[#d3d3d3] h-[4rem] text-center transition-all text-[2rem] focus:border-[#121212] w-[4rem] 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] rounded-[.5rem]  my-3 mx-auto"
                            validate={/^[0-9]$/}
                          />
                        </div>
                      </div>

                      <div className="py-3">
                        <div className="flex text-[#565656] items-center justify-between">
                          <label className="text-[#565656] mb-2 font-[600]">
                            Re Enter New Pin
                          </label>

                          <IconButton
                            onClick={() =>
                              setPinVisibility({
                                ...pinsVisibility,
                                renewpin: !pinsVisibility["renewpin"],
                              })
                            }
                            size={"medium"}
                          >
                            {pinsVisibility["renewpin"] ? (
                              <MdOutlineVisibility size={23} />
                            ) : (
                              <MdOutlineVisibilityOff size={23} />
                            )}
                          </IconButton>
                        </div>
                        <div className="flex justify-center item-center ">
                          <PinField
                            length={5}
                            type={
                              !pinsVisibility["renewpin"] ? "text" : "password"
                            }
                            onComplete={(e) => setPin({ ...pins, renewpin: e })}
                            className="font-[inherit] outline-none border border-[#d3d3d3] h-[4rem] 2usmm:!justify-start text-center transition-all 2usmm:w-[3rem] 2usmm:h-[3rem] 2usmm:text-[1.5rem] text-[2rem] focus:border-[#121212] w-[4rem] rounded-[.5rem]  my-3 mx-auto"
                            validate={/^[0-9]$/}
                          />
                        </div>
                      </div>

                      <span className="text-[#7c7c7c] mt-3 block font-[500] text-[15px]">
                        <b>Please Note: </b> Forgetting your pin or your pin
                        getting into the wrong hands, could lead to loss of
                        funds, please keep it safe.
                      </span>
                    </div>

                    <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                      <div className="flex items-center">
                        <Button
                          onClick={savePin}
                          className="!py-2 !font-bold !min-w-[220px] !text-[16px] !px-3 !flex !items-center !text-white !fill-white !bg-[#8036de] !normal-case !border !border-solid !border-[rgb(245,245,255)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                        >
                          {pinLoading ? (
                            <>
                              <div className="mr-3 h-[20px] text-[#fff]">
                                <CircularProgress
                                  color={"inherit"}
                                  className="!w-[20px] !h-[20px]"
                                />
                              </div>{" "}
                              <span>Just a Sec...</span>
                            </>
                          ) : (
                            <>Change pin</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Modal>
              </>
            )}

            <Modal
              open={openM}
              onClose={handleCloseM}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  minWidth: 340,
                  maxHeight: "100vh",
                  border: "none",
                  width: "80%",
                  backgroundColor: "#fff",
                  maxWidth: 800,
                  p: 2,
                }}
                className="text-center"
              >
                {Boolean(isLoading["progress"][0]) && (
                  <Box className="text-[#8036de] mb-1" sx={{ width: "100%" }}>
                    <LinearProgress
                      variant="buffer"
                      value={isLoading["progress"][0]}
                      valueBuffer={isLoading["progress"][1]}
                    />
                  </Box>
                )}

                {error["account"].length > 0 && (
                  <Alert className="w-full" severity="error">
                    {error["account"]}
                  </Alert>
                )}

                {success["account"].length > 0 && (
                  <Alert className="w-full" severity="success">
                    {success["account"]}
                  </Alert>
                )}

                <ReactCrop
                  minWidth={100}
                  minHeight={100}
                  circularCrop={true}
                  crop={crop}
                  aspect={1}
                  onChange={(c) => {
                    setCrop(c);
                  }}
                >
                  <img
                    className="img w-full m-auto !max-h-[calc(100vh-128px)] min-w-[340px]"
                    alt="crop me"
                    src={simg ? simg : ""}
                  />
                </ReactCrop>

                <div className="py-2 mt-4 flex justify-center">
                  <Button
                    variant="contained"
                    className="!bg-[#8036de] !mr-2 !py-[13px] !font-medium !capitalize"
                    style={{
                      fontFamily: "inherit",
                    }}
                    fullWidth
                    onClick={cropImg}
                  >
                    Update Image
                  </Button>

                  <Button
                    onClick={handleCloseM}
                    variant="contained"
                    className="!bg-[#8036de] !max-w-[100px] !ml-2 !py-[13px] !font-medium !capitalize"
                    style={{
                      fontFamily: "inherit",
                    }}
                    fullWidth
                  >
                    Close
                    <IoMdClose className="ml-3 font-medium" size={18} />
                  </Button>
                </div>
              </Box>
            </Modal>

            <div className="w-full">
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAccount();
                  }}
                  method="POST"
                  action="#"
                  id="account_sett"
                  encType="multipart/form-data"
                >
                  <div className="w-full justify-center mt-4">
                    <div className="flex flex-col mx-7 items-center justify-center">
                      <div className="flex flex-row border-b 3sm:flex-col justify-start w-full">
                        <div className="flex items-center justify-between font-semibold w-full">
                          <span className="text-[25px] font-[800] mb-2">
                            Profile
                          </span>
                        </div>
                      </div>
                      {isLoading["account"] === true && (
                        <Box className="text-[#8036de]" sx={{ width: "100%" }}>
                          <LinearProgress color="inherit" />
                        </Box>
                      )}

                      {error["account"].length > 0 && (
                        <Alert className="w-full" severity="error">
                          {error["account"]}
                        </Alert>
                      )}

                      {success["account"].length > 0 && (
                        <Alert className="w-full" severity="success">
                          {success["account"]}
                        </Alert>
                      )}
                      <div className="username w-full">
                        <div className="flex 3sm:flex-col-reverse 3sm:items-center justify-between items-start">
                          <div className="w-[54%] 3sm:w-full">
                            <div className="font-semibold mt-5 mb-4 text-[#777]">
                              Username
                            </div>
                            <div className="mt-2">
                              <div className="rounded-md">
                                <div className="flex">
                                  <TextField
                                    className="bg-[white]"
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: "#8036de",
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `#8036de !important`,
                                        },
                                    }}
                                    value={userInfo || username}
                                    fullWidth
                                    placeholder={username}
                                    name="username"
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setError({
                                        ...error,
                                        account: "",
                                      });
                                      setSuccess({
                                        ...success,
                                        account: "",
                                      });
                                      setuserInfo(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="font-semibold mt-5 mb-4 text-[#777]">
                                Email
                              </div>
                              <div className="rounded-md mt-2">
                                <div className="flex">
                                  <TextField
                                    className="bg-[white]"
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: "#8036de",
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `#8036de !important`,
                                        },
                                    }}
                                    placeholder={email}
                                    value={userEmail || email}
                                    onChange={(
                                      e: React.ChangeEvent<
                                        HTMLInputElement | HTMLTextAreaElement
                                      >
                                    ) => {
                                      setUserEmail(e.target.value);
                                      setError({
                                        ...error,
                                        account: "",
                                      });
                                      setSuccess({
                                        ...success,
                                        account: "",
                                      });
                                    }}
                                    name="email"
                                    fullWidth
                                  />
                                </div>
                              </div>

                              <div className="flex flex-row justify-end w-full mt-8">
                                <Button
                                  variant="contained"
                                  type="submit"
                                  className="!py-2 !min-w-[110px] !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !border-none !transition-all !delay-500 !rounded-lg !px-3 !text-[14px] mr-[2px]"
                                >
                                  Save Info
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="min-w-[300px] 3sm:mb-3 flex items-center flex-col relative">
                            <div className="font-semibold mt-5 mb-4 text-[#777]">
                              Profile Picture
                            </div>

                            <Avatar
                              src={dp}
                              className="!font-bold imm !text-[35px]"
                              sx={{
                                width: 190,
                                height: 190,
                                bgcolor: !Boolean(dp) ? "#8036de" : undefined,
                              }}
                              alt={username}
                            >
                              {String(username).charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="mt-1">
                              <input
                                type="file"
                                accept="image/*"
                                className="!hidden dpp"
                                style={{
                                  display: "none !important",
                                  visibility: "hidden",
                                }}
                                onChange={imgCrop}
                              />

                              <Button
                                onClick={() => {
                                  let element = document.querySelector(
                                    ".dpp"
                                  ) as HTMLInputElement;

                                  element.click();
                                }}
                                variant="contained"
                                className="!py-2 !min-w-[110px] !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !border-none !transition-all !delay-500 !rounded-lg !px-3 !text-[14px] mr-[2px]"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-full mt-10">
              <div className="mx-7 items-center">
                <div className="flex items-center justify-between font-semibold w-[54%] 3sm:w-full mmd:flex-col">
                  <div className="w-[70%] mmd:w-full">
                    <h2
                      style={{
                        fontSize: "15px !important",
                      }}
                      className="font-[600] mmd:mb-4 mmd:!text-[17px]"
                    >
                      Settlement Pin
                    </h2>

                    <span className="font-[400] text-[15px]">
                      This pin is used to approve settlement transactions,
                      please keep it safe as forgetting this pin might lead to
                      loss of funds.
                    </span>
                  </div>

                  <div className="flex mmd:w-full mmd:justify-end justify-center mmd:mt-8">
                    <Button
                      onClick={() => updateSettlePin(true)}
                      variant="contained"
                      className="!py-2 !font-[600] !capitalize !flex !items-center !text-white !bg-[#8036de] !border-none !transition-all !delay-500 !min-w-[110px] !rounded-lg !px-3 !text-[14px] mr-[2px]"
                    >
                      {Boolean(data.settlement.length)
                        ? "Change Pin"
                        : "Create Pin"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Page>
  );
};

export default Settings;
