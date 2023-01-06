import { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { IoMdClose } from "react-icons/io";
import { makeStorageClient } from "../../app/functions/clients";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
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
  Alert,
} from "@mui/material";
import Image from "next/image";
import { get_request } from "../../app/contexts/Cryptea/requests";
import { AxiosError } from "axios";
import Router from "next/router";
import { useCryptea } from "../../app/contexts/Cryptea";
import Page from "../../app/components/elements/dashboard";
import Loader from "../../app/components/elements/loader";
import Head from "next/head";

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: "px";
}

const Settings = () => {

  const { isAuthenticated, validator } = useCryptea();
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
          
          "user".get("*", true).then((e:any) => {
            setData(e);
            setDp(e.img);
            loading(false);
          });
        }
      }

  }, [isAuthenticated])

  

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

      const email = validator.normalizeEmail(userEmail)

      if (!validator.isEmail(email ? email : '')) {
        setError({ ...error, account: "Email Address Is Incorrect" });
        setLoading({ ...isLoading, account: false });
      }

      if (!error["account"].length) {
        try {

          await "user".update({
            username: userInfo,
            email: validator.normalizeEmail(userEmail),
            tz: window.jstz.determine().name(),
          });

         
          setSuccess({
            ...success,
            account: "Account Details Saved Successfully",
          });

          setLoading({ ...isLoading, account: false });
        } catch (err) {
          const erro = err as AxiosError;

          if(erro.response){
            const errorx:any = erro.response.data;

            setError({
              ...error,
              account: errorx.message,
            });               

          } else {
            // console.log(erro.message)
             setError({ ...error, account: "Something went wrong, please try again" });     
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

      ("user").update({
        img
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
            const files = [
              new File([blob], `${data.username}.${ext[1]}`),
            ];
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

  return (
    <Page>
      <Head>
        <title>Settings | Dashboard | Cryptea</title>
        <meta name="description" content={`Change User Settings Easily`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {pageLoading && <Loader />}

        {!pageLoading && (
          <div className="2sm:pr-1 pt-[75px] sett dashbody cusscroller overflow-y-scroll overflow-x-hidden px-5 pb-5 h-[calc(100%-75px)]">
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
                  <Box className="text-[#F57059] mb-1" sx={{ width: "100%" }}>
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
                    className="!bg-[#F57059] !mr-2 !py-[13px] !font-medium !capitalize"
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
                    className="!bg-[#F57059] !max-w-[100px] !ml-2 !py-[13px] !font-medium !capitalize"
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
                      <div className="flex flex-row border-b mmd:flex-col justify-start w-full">
                        <div className="flex items-center justify-between font-semibold w-full">
                          <span className="text-[25px] font-[800] mb-2">
                            Account
                          </span>
                        </div>
                      </div>
                      {isLoading["account"] === true && (
                        <Box className="text-[#F57059]" sx={{ width: "100%" }}>
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
                        <div className="flex mmd:flex-col-reverse mmd:items-center justify-between items-start">
                          <div className="w-[54%] mmd:w-full">
                            <div className="font-semibold mt-5 mb-4 text-[#777]">
                              Change Username
                            </div>
                            <div className="mt-2">
                              <div className="rounded-md">
                                <div className="flex">
                                  <TextField
                                    className="bg-[white]"
                                    label={"Username"}
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: "#f57059",
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `#f57059 !important`,
                                        },
                                    }}
                                    value={userInfo}
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
                                Change Email
                              </div>
                              <div className="rounded-md mt-2">
                                <div className="flex">
                                  <TextField
                                    className="bg-[white]"
                                    sx={{
                                      "& .Mui-focused.MuiFormLabel-root": {
                                        color: "#f57059",
                                      },
                                      "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: `#f57059 !important`,
                                        },
                                    }}
                                    label={"Email"}
                                    placeholder={email}
                                    value={userEmail}
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
                                  className="!text-sm !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-3 !px-10"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="min-w-[300px] mmd:mb-3 flex items-center flex-col relative">
                            <div className="font-semibold mt-5 mb-4 text-[#777]">
                              Profile Picture
                            </div>

                            <Avatar
                              src={dp}
                              className="!font-bold imm !text-[35px]"
                              sx={{
                                width: 190,
                                height: 190,
                                bgcolor: !Boolean(dp) ? "#f57059" : undefined,
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
                                className="!text-sm !rounded-lg !capitalize !bg-[#F57059] !text-white !font-semibold !p-[10px]"
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
          </div>
        )}
      </>
    </Page>
  );
};

export default Settings;
