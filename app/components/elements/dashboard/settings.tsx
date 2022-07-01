// import "../../assets/styles/auth.css";
// import "../../assets/styles/sett.css";
import { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { IoMdClose } from 'react-icons/io';
import { useMoralis } from "react-moralis";
import { Web3Storage } from "web3.storage";
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
  Alert
} from "@mui/material";
import Image from 'next/image';

interface PixelCrop {
  x: number;
    y: number;
    width: number;
    height: number;
    unit: 'px';
}

const DashSettings = () => {


  const { Moralis, user } = useMoralis();
  const [dp, setDp] = useState<string | undefined>(user?.get('img')); 
  const [userLink, setUserLink] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setuserInfo] = useState("");
  const [isLoading, setLoading] = useState({
    account: false, security: false, link: false, progress: [0, 0]
  });
  const [crop, setCrop] = useState<PixelCrop>();
  const [simg, setsImg] = useState<string | undefined>('');
  const [iimg, setIiimg] = useState({});
  const [result, setResult] = useState(null);

  const [openM, setOpenM] = useState(false);

  const handleOpenM = () => setOpenM(true);
  const handleCloseM = () => setOpenM(false);


  const [error, setError] = useState({
    account: "", security: "", link: ""
  });

  const [success, setSuccess] = useState({
    account: "", security: "", link: ""
  });


  const submitAccount = async () => {
      document.querySelector('#account_sett')?.scrollIntoView();
      window.scrollTo(0, 0);
      setError({
        ...error,
        account: ""
      });
      setSuccess({
       ...success, account: ""
      });
      let more = true;
      setLoading({...isLoading, account: true});

      [userInfo, userEmail].forEach(d => {
          if(!d.length) {  
              setError(
                  {...error, account: "Data Incomplete, Please required fields should be field" }
                );
                
                setLoading({...isLoading, account: false });
                more = false;
          }
      });

      if (more) {
          if (userEmail.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) === null) {
              setError(
                {...error, account: "Email Address Is Incorrect"}
              );
              setLoading({ ...isLoading, account: false });
              
          }

        if(!error['account'].length){
            
        try{
          user?.set("username", userInfo);
          user?.set("email", userEmail);
          await user?.save();
        
            setSuccess({...success, account: "Account Details Saved Successfully"})
            setLoading({ ...isLoading, account: false });
        } catch(err){
          const erro = err as Error;
            setError({ ...error, account: erro?.message });
              setLoading({...isLoading, account: false });
        }

      }
    }
  }

   const imgCrop = (event:React.SyntheticEvent & { target: HTMLInputElement }) => {
      handleOpenM();
      
      if(event.target.files !== null) {
      const fil = event.target.files[0]; 
     const {type, size} = fil;
     const ee = ['image/jpeg', 'image/jpg', 'image/png'];

     if(!ee.includes(type)){
          setError({
            ...error,
            account: "Only JPEG, jpg, and png image types are accepted"
          });
          return;  
     }

     if (size > 5243880) {
      setError({ ...error, account: "Image Size Exceeds The Limit Of 5mb" });
       return;
     }

     setsImg(URL.createObjectURL(fil));
     setIiimg(fil);

   };
  }

   const makeStorageClient = async () => {
      return new Web3Storage({
        token: await Moralis.Cloud.run("getWeb3StorageKey"),
      });
    }

     const beginUpload = async (files:File[], type:string) => {
       const { size: totalSize } = files[0];
  

       const onRootCidReady = (cid:string) => {
         setError({ ...error, account: "" });
         setSuccess({ ...success, account: "Image Uploaded Successfully, might take a while to fully reflect"});         
          const img = `https://${cid}.ipfs.dweb.link/${user?.get("username")}.${type}`;     
        setDp(img);
         user?.set("img", img);

         user?.save()
         
        handleCloseM();
       };

       let uploaded = 0;

       const onStoredChunk = (size:number) => {
         uploaded += size;

         const pct = (totalSize / uploaded) * 100;

         console.log(`Uploading... ${pct.toFixed(2)}% complete`);

         setLoading({...isLoading, progress: [pct, uploaded]})

       };

       const client = await makeStorageClient();

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
           (crop?.width !== undefined ? crop?.width : 0),
           (crop?.height !== undefined ? crop?.height : 0)
         );
         
         const { type }:{type?:string} = iimg || {};
         const ext = type?.split("/");
         canvas.toBlob(
           (blob) => {
            if(blob !== null && ext !== undefined) {
             const files = [new File([blob], `${user?.get('username')}.${ext[1]}`)];
             beginUpload(files, ext[1]);
            }
           },
           type,
           1
         );
   

       } catch (e) {
        const err = e as Error
         setError({ ...error, account: err?.message });
       }
     };


  const submitLink = async () => {
    document.querySelector("#link_sett")?.scrollIntoView();
    window.scrollTo(0, 0);
    setError({
      ...error,
      link: ""
    });
    setSuccess({
      ...success,
      link: ""
    });
    let more = true;
    setLoading({ ...isLoading, link: true });
    [userDescription, userLink].forEach((d) => {
      if (!d.length) {
        setError({
          ...error,
          link: "Data Incomplete, Please required fields should be field"
        });
        setLoading({ ...isLoading, link: false });
        more = false;
      }
    });

    if (more) {
      if (
        userDescription.length < 50
      ) {
        setError({ ...error, link: "Atleast 50 characters are required in your description" });
        setLoading({  ...isLoading, link: false });
      }

      if (!error["link"].length) {
        const Links = Moralis.Object.extend("link");
        const link = new Links();
          link?.set("link", userLink);
          user?.set('desc', userDescription);
     
        try {
          await link?.save();
          await user?.save();
          setSuccess({
            ...success,
            link: "Link Details Saved Successfully"
          });
          setLoading({ ...isLoading, link: false });
        } catch (err) {
          const erro = err as Error;
          setError({ ...error, link: erro?.message });
          setLoading({ ...isLoading, link: false });
        }
      }
    }
  };

 
  const username = user?.get('username');
  const email = user?.get('email');
  const desc = user?.get('desc');


  return (
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
            <Image className="img w-full m-auto !max-h-[calc(100vh-128px)] min-w-[340px]"
              alt="crop me"
              src={(simg ? simg : '')}
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
              className="!bg-[#F57059] max-w-[100px] !ml-2 !py-[13px] !font-medium !capitalize"
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
      <div className="w-[80%] usm:w-[90%] sm:w-full">
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
                    <span className="text-[25px] font-[800] mb-2">Account</span>
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
                    <div className="w-full">
                      <div className="font-semibold mt-5 mb-4 text-[#777]">
                        Change Username
                      </div>
                      <div className="mt-2">
                        <div className="rounded-md">
                          <div className="flex">
                            <TextField
                              className="bg-[white]"
                              label={"Username"}
                              value={userInfo}
                              fullWidth
                              placeholder={username}
                              name="username"
                              onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                              label={"Email"}
                              placeholder={email}
                              value={userEmail}
                              onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                            className="!text-sm !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-4 !px-10"
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
                      {!Boolean(dp) ? (
                        <Avatar
                          sx={{
                            bgcolor: "#F57059",
                            width: 190,
                            height: 190,
                          }}
                          className="!font-bold imm !text-[35px]"
                          alt={user?.get("username")}
                        >
                          {user?.get("username").charAt(0).toUpperCase()}
                        </Avatar>
                      ) : (
                        <Avatar
                          src={dp}
                          sx={{ width: 190, height: 190 }}
                          alt={user?.get("username")}
                        ></Avatar>
                      )}
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
                           let element = document.querySelector(".dpp") as HTMLInputElement;

                           element.click();
                          }}
                          variant="contained"
                          className="!text-sm !rounded-lg !capitalize !bg-[#F57059] !text-white !font-semibold p-[10px]"
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

        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitLink();
            }}
            method="POST"
            action="#"
            id="link_sett"
            encType="multipart/form-data"
          >
            <div className="w-full justify-center mt-4">
              <div className="flex flex-col mx-7 items-center justify-center">
                <div className="flex flex-row border-b justify-start w-full">
                  <div className="flex items-center justify-between font-semibold w-full">
                    <span className="text-[25px] font-[800] mb-2">
                      Your Link
                    </span>
                  </div>
                </div>
                {isLoading["link"] && (
                  <Box className="text-[#F57059]" sx={{ width: "100%" }}>
                    <LinearProgress color="inherit" />
                  </Box>
                )}

                {error["link"].length > 0 && (
                  <Alert className="w-full" severity="error">
                    {error["link"]}
                  </Alert>
                )}

                {success["link"].length > 0 && (
                  <Alert className="w-full" severity="success">
                    {success["link"]}
                  </Alert>
                )}

                <div className="username w-full">
                  <div className="mt-2">
                    <div className="font-semibold mt-5 mb-4 text-[#777]">
                      Change Cryptea Link
                    </div>
                    <div className="flex mt-2">
                      <FormControl
                        sx={{
                          width: "100%",
                        }}
                        variant="outlined"
                      >
                        <InputLabel htmlFor="current-password">Link</InputLabel>
                        <OutlinedInput
                          className="bg-[white] !p-0"
                          placeholder={desc}
                          name="Link"
                          label="Link"
                          onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            const lk = e.target.value;
                            setUserLink(
                              lk.replace(/[/\\.@#&?;,:"'~*^%|]/g, "")
                            );

                            setError({
                              ...error,
                              link: "",
                            });
                            setSuccess({
                              ...success,
                              link: "",
                            });
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <div className="text-[#838383] rounded-l-md p-[15px] pr-0">
                                cryptea.com/
                              </div>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </div>

                    <div className="font-semibold mt-5 mb-4 text-[#777]">
                      Change Description
                    </div>
                    <div className="rounded-md mt-2">
                      <div className="flex">
                        <TextField
                          type="textarea"
                          className="bg-[white]"
                          label={"Description"}
                          placeholder="I created Ethereum"
                          value={userDescription}
                          onChange={(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            setUserDescription(e.target.value);
                            setError({
                              ...error,
                              link: "",
                            });
                            setSuccess({
                              ...success,
                              link: "",
                            });
                          }}
                          name="desc"
                          fullWidth
                          multiline
                          minRows={3}
                        />
                      </div>
                    </div>

                    <div className="flex flex-row justify-end w-full mt-8">
                      <Button
                        variant="contained"
                        type="submit"
                        className="!text-sm !rounded-lg !bg-[#F57059] !text-white !font-semibold !py-4 !px-10"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DashSettings;
