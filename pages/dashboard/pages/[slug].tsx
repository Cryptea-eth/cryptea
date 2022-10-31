import Head from 'next/head';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  TextField,
  IconButton,
  Button,
  Slider,
  Box,
  Switch,
  CircularProgress,
  LinearProgress,
  Alert
} from "@mui/material";
import { useRouter } from 'next/router';
import { FiAlignCenter, FiAlignJustify, FiAlignLeft, FiAlignRight } from "react-icons/fi";
import Color from "@uiw/react-color-colorful";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import validator from 'validator';
import style from "../../../styles/custom.module.css";
import { RiDeleteBin5Line } from 'react-icons/ri';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import { makeStorageClient } from '../../../app/functions/clients';
import dynamic from 'next/dynamic';
import Loader from '../../../app/components/elements/loader';
import { get_request } from '../../../app/contexts/Cryptea/requests';
import { useCryptea } from '../../../app/contexts/Cryptea';



const EditPage = () => {

  const { isAuthenticated } = useCryptea()

  const [ndata, setData] = useState<string>('');
  const [rules, setRules] = useState<any>({});



  const [Template, setTemplate] = useState<React.ComponentType<{
      className?: string;
      editMode?: boolean;
    }>>();


  const stylex = {
    button: {
      backgroundColor: `#6e6e6e !important`,
      color: `#fff !important`,
      fontSize: "13px",
      width: "fit-content",
      padding: "10px",
      fontWeight: "bold",
      textTransform: "capitalize",
    },
  };

  const [crop, setCrop] = useState<PixelCrop>({
      width: 50,
      unit: 'px',
      height: 50,
      x: 0,
      y: 0
  });
  const [simg, setsImg] = useState<string | undefined>("");
  const [isLoading, setLoader] = useState<boolean>(true); 

  const router = useRouter();

  const [linkx, setLinkx] = useState<any>();

  const usern = router.query['slug'];
  
   useEffect(() => {
    
   }, [usern, router.isReady]);

   let [editable, setEditable] = useState<string[]>([]);

useEffect(() => {
  const init = async () => {

    if (isAuthenticated !== undefined) {
      if (isAuthenticated) {
         
          const linkx:any = await (`links/${String(usern).toLowerCase()}`).get('link', true);


          setLinkx(linkx);
          
           if (linkx?.template_data !== undefined) {

             const {name, data: udata} = JSON.parse(linkx?.template_data);

             const { rules, getData } = await import(`../../../app/templates/${name}/data`);
  
            setRules(rules);

            setData(name);

            getData(udata);

            const edx:string[] = [];

            for (let aa in rules) {
              if (aa != "body") {
                edx.push(aa);
              }
            }

            setEditable(edx);

            const Utemplate = dynamic(
              () => import(`../../../app/templates/${name}`),
              {
                suspense: false,
              }
            );

            setTemplate(Utemplate);
            
            setLoader(false);

        }
      
      } else {

        router.push("/auth");

      }
    }
  }

  init();

}, [usern, router, isAuthenticated])


  let times:any;

  const saveSets = async () => {

      clearTimeout(times)

      try {

      saveChanges({
        ...isSaving,
        one: true
      });

      const { data } = await import(`../../../app/templates/${ndata}/data`);

      const sdata = JSON.stringify({name: ndata, data});

      await (`links/${linkx.id}`).update({"template_data": sdata})

      saveChanges({
        two: true,
        one: false
      });
      
      times = setTimeout(() => {
          saveChanges({
             ...isSaving,
            two: false
          })
      }, 2000);
    }catch (err) {
        const error = err as Error;

        console.log(error)

    }
  }

  const [isSaving, saveChanges] = useState<{
    one: boolean,
    two: boolean
  }>({
    one: false,
    two: false
  });

  const [iimg, setIiimg] = useState({});
  const [getRules, setPart] = useState<string>("");
  const [showMain, setShowMain] = useState(true)
  const [viewColor, setViewColor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [update, updateMe] = useState<any>('')

  const [isUploading, setIsUploading] = useState<number>(0);

  
  const imgCrop = (
    event: React.SyntheticEvent & { target: HTMLInputElement }
  ) => {
    setIsUploading(0);
    setViewColor("imgMChange");
    if (event.target.files !== null) {
      const fil = event.target.files[0];
      const { type, size } = fil;
      const ee = ["image/jpeg", "image/jpg", "image/png"];

      if (!ee.includes(type)) {
        setError("Only JPEG, jpg, and png image types are accepted");
        return;
      }

      if (size > 5243880) {
        setError("Image Size Exceeds The Limit Of 5mb" );
        return;
      }

      setsImg(URL.createObjectURL(fil));
      setIiimg(fil);
    }
  };

  const beginUpload = async (files: File[], type: string) => {
    const { size: totalSize } = files[0];

    const onRootCidReady = (cid: string) => {

      setError("")

      const src = `https://${cid}.ipfs.dweb.link/${usern}.${type}`;
      updateMe(src)

      const dataSent = rules[Boolean(getRules.length) ? getRules : "body"];

      dataSent.imgChange({
        borderColor: dataSent.imgChange().borderColor,
        size: dataSent.imgChange().width,
        display: dataSent.imgChange().display == "block",
        src
      });

    };

    let uploaded:number = 0;

    const onStoredChunk = (size: number) => {
      uploaded += size;

      const pct:number = (totalSize / uploaded) * 100;

      console.log(`Uploading... ${pct.toFixed(2)}% complete`);

      setIsUploading(pct);
      if (pct > 98) {
        setViewColor("");
      }
    };

    const client = makeStorageClient(await get_request("/storagekey"));

    return client.put(files, { onRootCidReady, onStoredChunk });
  };

  const cropImg = () => {
    const img = document.querySelector(".img_custom") as HTMLImageElement;

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
              new File([blob], `${usern}.${ext[1]}`),
            ];
            beginUpload(files, ext[1]);
          }
        },
        type,
        1
      );
    } catch (e) {
      const err = e as Error;
      setError(err?.message);
    }
  };


  return (
    <div>
      <Head>
        <title>Editing {usern} | Cryptea</title>
        <meta name="description" content={`Updating User Page Template`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading && <Loader />}
      
      {/* // come back here */}
      {(!isLoading && Template !== undefined) && null }

      
      <div
        style={{
          left: isSaving["two"] ? "calc(100% - 353px)" : undefined,
        }}
        className="fixed transition-all delay-500 text-white font-bold left-[calc(100%-257px)] z-[117] px-5 py-3 bg-black"
      >
        Saved
      </div>

      {!isLoading && (
        <div className="flex items-start">
          {Template !== undefined && (
            <Template editMode={true} className="overflow-y-scroll cusscroller overflow-x-hidden w-[calc(100%-258px)] z-[100] h-full fixed max-h-screen" />
          )}

          <div className="flex relative z-[130] left-[calc(100%-257px)] right-0 flex-row">
            <div className="max-w-[257px] w-[257px] h-screen bg-[white]">
              <div>
                <div className="flex flex-row w-full bg-[#bbbbbb24] py-4">
                  <div
                    onClick={() => {
                      if (!getRules.length) {
                        window.location.href = "/dashboard/pages";
                      } else {
                        setPart("");
                        setViewColor("");
                      }
                    }}
                    className="w-1/4 cursor-pointer"
                  >
                    <MdChevronLeft color="#838383" size={24} />
                  </div>
                  <div className="text-[#838383] text-[17px] font-[300] w-3/4">
                    {getRules.length ? getRules.replace("_", " ") : "Overview"}
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="text-[#8f8f8f] text-[13px] px-3">
                    *Dont forget to save after you&apos;re done
                  </span>
                  {Boolean(error.length) && (
                    <Alert className="w-full" severity="error">
                      {error}
                    </Alert>
                  )}

                  <div className="components mt-2 bg-white">
                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .colorChange
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Text Color
                        </span>

                        <div className="flex relative cursor-pointer items-center">
                          {viewColor == "textColor" && (
                            <Color
                              color={rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].colorChange()}
                              className="right-[120%] !absolute"
                              onChange={(color) => {
                                updateMe(color);

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].colorChange(color.hexa);
                              }}
                            />
                          )}
                          <div
                            onClick={(e: any) => {
                              if (viewColor == "textColor") {
                                setViewColor("");
                              } else {
                                setViewColor("textColor");
                              }
                            }}
                            className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                          >
                            <div
                              style={{
                                backgroundColor:
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].colorChange(),
                              }}
                              className="h-[22px] w-[22px]"
                            ></div>
                          </div>

                          <div
                            onClick={(e: any) => {
                              if (viewColor == "textColor") {
                                setViewColor("");
                              } else {
                                setViewColor("textColor");
                              }
                            }}
                            className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                          >
                            {rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].colorChange()}
                          </div>
                        </div>
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .BgColorChange
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Background Color
                        </span>

                        <div className="flex relative cursor-pointer items-center">
                          {viewColor == "backgroundColor" && (
                            <Color
                              color={rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].BgColorChange()}
                              className="right-[120%] !absolute"
                              onChange={(color) => {
                                updateMe(color);

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].BgColorChange(color.hexa);
                              }}
                            />
                          )}
                          <div
                            onClick={(e: any) => {
                              if (viewColor == "backgroundColor") {
                                setViewColor("");
                              } else {
                                setViewColor("backgroundColor");
                              }
                            }}
                            className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                          >
                            <div
                              style={{
                                backgroundColor:
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].BgColorChange(),
                              }}
                              className="h-[22px] w-[22px]"
                            ></div>
                          </div>

                          <div
                            onClick={(e: any) => {
                              if (viewColor == "backgroundColor") {
                                setViewColor("");
                              } else {
                                setViewColor("backgroundColor");
                              }
                            }}
                            className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                          >
                            {rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].BgColorChange()}
                          </div>
                        </div>
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .bgBColorChange
                    ) && (
                      <>
                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                            Background Color
                          </span>

                          <div className="flex relative cursor-pointer items-center">
                            {viewColor == "backgroundbColor" && (
                              <Color
                                color={rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].bgBColorChange(1)}
                                className="right-[120%] !absolute"
                                onChange={(color) => {
                                  updateMe(color);

                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].bgBColorChange(1, {
                                    backgroundColor: color.hexa,
                                  });
                                }}
                              />
                            )}
                            <div
                              onClick={(e: any) => {
                                if (viewColor == "backgroundbColor") {
                                  setViewColor("");
                                } else {
                                  setViewColor("backgroundbColor");
                                }
                              }}
                              className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                            >
                              <div
                                style={{
                                  backgroundColor:
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].bgBColorChange(1),
                                }}
                                className="h-[22px] w-[22px]"
                              ></div>
                            </div>

                            <div
                              onClick={(e: any) => {
                                if (viewColor == "backgroundbColor") {
                                  setViewColor("");
                                } else {
                                  setViewColor("backgroundbColor");
                                }
                              }}
                              className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                            >
                              {rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].bgBColorChange(1)}
                            </div>
                          </div>
                        </div>

                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                            Border Color
                          </span>

                          <div className="flex relative cursor-pointer items-center">
                            {viewColor == "borderbackground" && (
                              <Color
                                color={rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].bgBColorChange(0)}
                                className="right-[120%] !absolute"
                                onChange={(color) => {
                                  updateMe(color);

                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].bgBColorChange(0, {
                                    backgroundColor: color.hexa,
                                  });
                                }}
                              />
                            )}
                            <div
                              onClick={(e: any) => {
                                if (viewColor == "borderbackground") {
                                  setViewColor("");
                                } else {
                                  setViewColor("borderbackground");
                                }
                              }}
                              className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                            >
                              <div
                                style={{
                                  backgroundColor:
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].bgBColorChange(0),
                                }}
                                className="h-[22px] w-[22px]"
                              ></div>
                            </div>

                            <div
                              onClick={(e: any) => {
                                if (viewColor == "borderbackground") {
                                  setViewColor("");
                                } else {
                                  setViewColor("borderbackground");
                                }
                              }}
                              className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                            >
                              {rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].bgBColorChange(0)}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .textChange
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Text
                        </span>

                        <TextField
                          type="textarea"
                          defaultValue={rules[
                            Boolean(getRules.length) ? getRules : "body"
                          ].textChange()}
                          onChange={(xc: any) => {
                            updateMe(xc.target.value);
                            rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].textChange(xc.target.value);
                          }}
                          sx={{
                            color: "#bbbbbbc8 !important",
                            "& .MuiInputBase-multiline": {
                              padding: "3px",
                              lineHeight: "17px",
                              borderRadius: "0px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#bbbbbbc8 !important",
                              borderWidth: "1px !important",
                            },
                            "& .MuiInputBase-input.MuiInputBase-input": {
                              fontSize: "13px",
                            },
                            "& .Mui-focused.MuiFormLabel-root": {
                              color: "#bbbbbbc8",
                            },
                            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: `#bbbbbbc8 !important`,
                            },
                          }}
                          fullWidth
                          multiline
                        />
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .sortAlignment
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Alignment
                        </span>

                        <div
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(48px, 1fr))",
                          }}
                          className="grid w-full grid-flow-dense items-center"
                        >
                          <button
                            style={{
                              backgroundColor:
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].sortAlignment() == "right"
                                  ? "#707070"
                                  : "#9d9d9d",
                            }}
                            onClick={() => {
                              updateMe("right");

                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].sortAlignment("right");
                            }}
                            className="flex h-[30px] transition-all delay-300 rounded-tl-[3px] rounded-bl-[3px] hover:bg-[#707070] cursor-pointer bg-[#9d9d9d] items-center justify-center"
                            title="Align Right"
                          >
                            <FiAlignRight color={"#fff"} size={19} />
                          </button>

                          <button
                            style={{
                              backgroundColor:
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].sortAlignment() == "center"
                                  ? "#707070"
                                  : "#9d9d9d",
                            }}
                            onClick={() => {
                              updateMe("center");
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].sortAlignment("center");
                            }}
                            className="flex h-[30px] transition-all delay-300 hover:bg-[#707070] cursor-pointer bg-[#9d9d9d] items-center justify-center"
                            title="Align Center"
                          >
                            <FiAlignCenter color={"#fff"} size={19} />
                          </button>

                          <button
                            style={{
                              backgroundColor:
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].sortAlignment() == "left"
                                  ? "#707070"
                                  : "#9d9d9d",
                            }}
                            onClick={() => {
                              updateMe("left");
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].sortAlignment("left");
                            }}
                            className="flex h-[30px] transition-all delay-300 hover:bg-[#707070] cursor-pointer bg-[#9d9d9d] items-center justify-center"
                            title="Align Left"
                          >
                            <FiAlignLeft color={"#fff"} size={19} />
                          </button>

                          <button
                            style={{
                              backgroundColor:
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].sortAlignment() == "justify"
                                  ? "#707070"
                                  : "#9d9d9d",
                            }}
                            onClick={() => {
                              updateMe("justify");
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].sortAlignment("justify");
                            }}
                            className="flex h-[30px] transition-all delay-300 rounded-tr-[3px] rounded-br-[3px] hover:bg-[#707070] cursor-pointer bg-[#9d9d9d] items-center justify-center"
                            title="Align Justify"
                          >
                            <FiAlignJustify color={"#fff"} size={19} />
                          </button>
                        </div>
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .imgChange
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Image
                        </span>

                        <div className="w-full flex flex-col">
                          <div className="w-auto max-h-[200px] flex justify-between items-center">
                            <div className="flex items-center">
                              {viewColor == "imgMChange" && (
                                <div className="right-[105%] px-[5px] pt-[5px] pb-2 rounded-[4px] absolute w-[410px] max-h-[450px] bg-[#e5e5e5c7] flex flex-col justify-between items-center">
                                  {isUploading > 0 && (
                                    <Box className="text-[#3a3a3a] w-full">
                                      <LinearProgress
                                        variant="determinate"
                                        className="w-full"
                                        color="inherit"
                                        value={isUploading}
                                      />
                                    </Box>
                                  )}
                                  <ReactCrop
                                    minWidth={20}
                                    minHeight={20}
                                    circularCrop={false}
                                    crop={crop}
                                    aspect={1}
                                    onChange={(c) => {
                                      setCrop(c);
                                    }}
                                  >
                                    <img
                                      className="img_custom w-[400px] m-auto max-w-[400px]"
                                      alt="crop me"
                                      src={simg ? simg : ""}
                                    />
                                  </ReactCrop>

                                  <div className="flex mt-2 justify-between">
                                    <Button
                                      variant="contained"
                                      className="!bg-[#979797] !w-fit !mr-2 !py-[3px] !font-bold !text-[13px] !capitalize"
                                      style={{
                                        fontFamily: "inherit",
                                      }}
                                      onClick={cropImg}
                                    >
                                      Update Image
                                    </Button>

                                    <Button
                                      onClick={() => setViewColor("")}
                                      variant="contained"
                                      className="!bg-[#979797] !w-[50px] !py-[3px] !font-bold !text-[13px] !capitalize"
                                      style={{
                                        fontFamily: "inherit",
                                      }}
                                    >
                                      Close
                                    </Button>
                                  </div>
                                </div>
                              )}
                              <div className="bg-[#979797] h-fit w-fit">
                                <img
                                  alt="upload image"
                                  width="30"
                                  src={
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].imgChange().src.length
                                      ? rules[
                                          Boolean(getRules.length)
                                            ? getRules
                                            : "body"
                                        ].imgChange().src
                                      : document
                                          .querySelector(".imgx_page img")
                                          ?.getAttribute("src")
                                  }
                                />
                              </div>

                              <span className="text-[#979797] ml-[10px] font-bold text-[13px]">
                                Link Image
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={imgCrop}
                              className="!hidden updatelink"
                            />
                            <Button
                              sx={{
                                transition: "all .5s",
                                textTransform: "capitalize",
                                fontSize: "13px",
                                lineHeight: "15px",
                                backgroundColor: "#979797 !important",
                                padding: "4px 8px",
                                color: "#fff",
                                borderRadius: "0px !important",
                                fontWeight: "semibold",
                                ":hover": {
                                  backgroundColor: "#818181 !importan",
                                },
                              }}
                              onClick={(eee: any) => {
                                const elem = eee.target?.previousSibling;

                                elem.click();
                              }}
                            >
                              update
                            </Button>
                          </div>
                        </div>

                        <div className="mt-[7px]">
                          <span className="text-[#979797] mr-[11px] font-bold text-[13px]">
                            border color
                          </span>

                          <div className="flex cursor-pointer items-center">
                            {viewColor == "colorBorder" && (
                              <Color
                                color={
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].imgChange().borderColor
                                }
                                className="right-[105%] !absolute"
                                onChange={(color) => {
                                  updateMe(color);
                                  const dataSent =
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ];

                                  dataSent.imgChange({
                                    borderColor: color.hexa,
                                    size: dataSent.imgChange().width,
                                    display:
                                      dataSent.imgChange().display == "block",
                                    src: dataSent.imgChange().src,
                                  });
                                }}
                              />
                            )}

                            <div
                              onClick={(e: any) => {
                                if (viewColor == "colorBorder") {
                                  setViewColor("");
                                } else {
                                  setViewColor("colorBorder");
                                }
                              }}
                              className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                            >
                              <div
                                style={{
                                  backgroundColor:
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].imgChange().borderColor,
                                }}
                                className="h-[22px] w-[22px]"
                              ></div>
                            </div>

                            <div
                              onClick={(e: any) => {
                                if (viewColor == "colorBorder") {
                                  setViewColor("");
                                } else {
                                  setViewColor("colorBorder");
                                }
                              }}
                              className="text-[#ababab] min-w-[100px] text-[12px] p-2 font-bold"
                            >
                              {
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].imgChange().borderColor
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-[7px] w-full items-center">
                          <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                            size
                          </span>

                          <Slider
                            min={40}
                            size="small"
                            max={156}
                            value={
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].imgChange().width
                            }
                            onChange={(xx: any) => {
                              const dx =
                                rules[getRules.length ? getRules : "body"];

                              dx.imgChange({
                                borderColor: dx.imgChange().borderColor,
                                size: xx.target.value,
                                display: dx.imgChange().display == "block",
                                src: dx.imgChange().src,
                              });
                              updateMe(xx);
                            }}
                            sx={{
                              color: "#979797",
                              "& .MuiSlider-track, .MuiSlider-rail, .MuiSlider-thumb":
                                {
                                  backgroundColor: "#979797",
                                },
                              "& .MuiSlider-thumb:hover, .MuiSlider-thumb.Mui-focusVisible":
                                {
                                  boxShadow:
                                    "0px 0px 0px 8px rgba(0, 0, 0, 16%)",
                                },
                              "& .MuiSlider-thumb.Mui-active": {
                                boxShadow:
                                  "0px 0px 0px 12px rgba(0, 0, 0, 16%)",
                              },
                            }}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                          />
                        </div>

                        <div className="flex mt-[7px] w-full justify-between items-center">
                          <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                            Hide Image
                          </span>

                          <Switch
                            sx={{
                              "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                                {
                                  backgroundColor: "#4d4d4d !important",
                                },
                              "& .MuiSwitch-thumb": {
                                boxShadow:
                                  "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                              },
                              "& .Mui-checked": {
                                color: "#4d4d4d !important",
                              },
                            }}
                            checked={Boolean(
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].imgChange().display == "none"
                            )}
                            onChange={(xx) => {
                              const exx =
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ];
                              updateMe(exx.imgChange().display);

                              exx.imgChange({
                                borderColor: exx.imgChange().borderColor,
                                display: !(exx.imgChange().display == "block"),
                                size: exx.imgChange().width,
                                src: exx.imgChange().src,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"].height
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Height
                        </span>

                        <Slider
                          min={120}
                          size="small"
                          max={300}
                          value={rules[
                            Boolean(getRules.length) ? getRules : "body"
                          ].height()}
                          onChange={(xx: any) => {
                            const dx =
                              rules[getRules.length ? getRules : "body"];

                            dx.height(xx.target.value);

                            updateMe(xx);
                          }}
                          sx={{
                            color: "#979797",
                            "& .MuiSlider-track, .MuiSlider-rail, .MuiSlider-thumb":
                              {
                                backgroundColor: "#979797",
                              },
                            "& .MuiSlider-thumb:hover, .MuiSlider-thumb.Mui-focusVisible":
                              {
                                boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 16%)",
                              },
                            "& .MuiSlider-thumb.Mui-active": {
                              boxShadow: "0px 0px 0px 12px rgba(0, 0, 0, 16%)",
                            },
                          }}
                          aria-label="Default"
                          valueLabelDisplay="auto"
                        />
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .socialAdd
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Socials
                        </span>

                        <div className="w-full">
                          <div className="flex w-full justify-between items-center">
                            <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                              Facebook
                            </span>

                            <Switch
                              sx={{
                                "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#4d4d4d !important",
                                  },
                                "& .MuiSwitch-thumb": {
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                                },
                                "& .Mui-checked": {
                                  color: "#4d4d4d !important",
                                },
                              }}
                              checked={
                                !rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd().facebook.hidden
                              }
                              onChange={() => {
                                const obj =
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ];
                                updateMe(obj.socialAdd().facebook.hidden);
                                obj.socialAdd({
                                  facebook: {
                                    link: obj.socialAdd().facebook.link,
                                    hidden: !obj.socialAdd().facebook.hidden,
                                  },
                                });
                              }}
                            />
                          </div>

                          <TextField
                            type="text"
                            defaultValue={
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].socialAdd().facebook.link
                            }
                            onChange={(xx: any) => {
                              updateMe(xx.target.value);
                              if (validator.isURL(xx.target.value)) {
                                const link =
                                  xx.target.value.indexOf("https://") == "-1"
                                    ? `https://${xx.target.value}`
                                    : xx.target.value;
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd({
                                  facebook: {
                                    link,
                                    hidden:
                                      rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].socialAdd().facebook.hidden,
                                  },
                                });
                              }
                            }}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#bbbbbbc8",
                              },
                              "& .MuiInputBase-root": {
                                borderRadius: "0px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "3px",
                                lineHeight: "17px",
                                fontSize: "13px",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#bbbbbbc8 !important",
                                  borderWidth: "1px !important",
                                },
                            }}
                            placeholder="profile link"
                            fullWidth
                          />
                        </div>

                        <div className="w-full">
                          <div className="flex w-full justify-between items-center">
                            <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                              Instagram
                            </span>

                            <Switch
                              sx={{
                                "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#4d4d4d !important",
                                  },
                                "& .MuiSwitch-thumb": {
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                                },
                                "& .Mui-checked": {
                                  color: "#4d4d4d !important",
                                },
                              }}
                              checked={
                                !rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd().instagram.hidden
                              }
                              onChange={() => {
                                const obj =
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ];
                                updateMe(obj.socialAdd().instagram.hidden);
                                obj.socialAdd({
                                  instagram: {
                                    link: obj.socialAdd().instagram.link,
                                    hidden: !obj.socialAdd().instagram.hidden,
                                  },
                                });
                              }}
                            />
                          </div>

                          <TextField
                            type="text"
                            defaultValue={
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].socialAdd().instagram.link
                            }
                            onChange={(xx: any) => {
                              updateMe(xx.target.value);
                              if (validator.isURL(xx.target.value)) {
                                const link =
                                  xx.target.value.indexOf("https://") == "-1"
                                    ? `https://${xx.target.value}`
                                    : xx.target.value;

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd({
                                  instagram: {
                                    link,
                                    hidden:
                                      rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].socialAdd().instagram.hidden,
                                  },
                                });
                              }
                            }}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#bbbbbbc8",
                              },
                              "& .MuiInputBase-root": {
                                borderRadius: "0px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "3px",
                                lineHeight: "17px",
                                fontSize: "13px",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#bbbbbbc8 !important",
                                  borderWidth: "1px !important",
                                },
                            }}
                            fullWidth
                            placeholder="profile link"
                          />
                        </div>

                        <div className="w-full">
                          <div className="flex w-full justify-between items-center">
                            <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                              LinkedIn
                            </span>

                            <Switch
                              sx={{
                                "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#4d4d4d !important",
                                  },
                                "& .MuiSwitch-thumb": {
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                                },
                                "& .Mui-checked": {
                                  color: "#4d4d4d !important",
                                },
                              }}
                              checked={
                                !rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd().linkedin.hidden
                              }
                              onChange={() => {
                                const obj =
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ];
                                updateMe(obj.socialAdd().linkedin.hidden);
                                obj.socialAdd({
                                  linkedin: {
                                    link: obj.socialAdd().linkedin.link,
                                    hidden: !obj.socialAdd().linkedin.hidden,
                                  },
                                });
                              }}
                            />
                          </div>

                          <TextField
                            type="text"
                            defaultValue={
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].socialAdd().linkedin.link
                            }
                            onChange={(xx: any) => {
                              updateMe(xx.target.value);
                              if (validator.isURL(xx.target.value)) {
                                const link =
                                  xx.target.value.indexOf("https://") == "-1"
                                    ? `https://${xx.target.value}`
                                    : xx.target.value;

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd({
                                  linkedin: {
                                    link,
                                    hidden:
                                      rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].socialAdd().linkedin.hidden,
                                  },
                                });
                              }
                            }}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#bbbbbbc8",
                              },
                              "& .MuiInputBase-root": {
                                borderRadius: "0px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "3px",
                                lineHeight: "17px",
                                fontSize: "13px",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#bbbbbbc8 !important",
                                  borderWidth: "1px !important",
                                },
                            }}
                            fullWidth
                            placeholder="profile link"
                          />
                        </div>

                        <div className="w-full">
                          <div className="flex w-full justify-between items-center">
                            <span className="text-[#979797] mr-[11px] font-bold text-[14px]">
                              Twitter
                            </span>

                            <Switch
                              sx={{
                                "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                                  {
                                    backgroundColor: "#4d4d4d !important",
                                  },
                                "& .MuiSwitch-thumb": {
                                  boxShadow:
                                    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                                },
                                "& .Mui-checked": {
                                  color: "#4d4d4d !important",
                                },
                              }}
                              checked={
                                !rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd().twitter.hidden
                              }
                              onChange={(vc) => {
                                const obj =
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ];
                                updateMe(vc);

                                obj.socialAdd({
                                  twitter: {
                                    link: obj.socialAdd().twitter.link,
                                    hidden: !obj.socialAdd().twitter.hidden,
                                  },
                                });
                              }}
                            />
                          </div>

                          <TextField
                            type="text"
                            defaultValue={
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].socialAdd().twitter.link
                            }
                            onChange={(xx: any) => {
                              updateMe(xx.target.value);
                              if (validator.isURL(xx.target.value)) {
                                const link =
                                  xx.target.value.indexOf("https://") == "-1"
                                    ? `https://${xx.target.value}`
                                    : xx.target.value;

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].socialAdd({
                                  twitter: {
                                    link,
                                    hidden:
                                      rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].socialAdd().twitter.hidden,
                                  },
                                });
                              }
                            }}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#bbbbbbc8",
                              },
                              "& .MuiInputBase-root": {
                                borderRadius: "0px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "3px",
                                lineHeight: "17px",
                                fontSize: "13px",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#bbbbbbc8 !important",
                                  borderWidth: "1px !important",
                                },
                            }}
                            fullWidth
                            placeholder="profile link"
                          />
                        </div>
                      </div>
                    )}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"].hide
                    ) && (
                      <div className="flex w-full px-3 py-2 border-b border-solid border-[#bbbbbb24] justify-between items-center">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Hide
                        </span>

                        <Switch
                          sx={{
                            "& .MuiSwitch-track, .Mui-checked+.MuiSwitch-track":
                              {
                                backgroundColor: "#4d4d4d !important",
                              },
                            "& .MuiSwitch-thumb": {
                              boxShadow:
                                "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%) !important",
                            },
                            "& .Mui-checked": {
                              color: "#4d4d4d !important",
                            },
                          }}
                          checked={Boolean(
                            rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].hide() == "none"
                          )}
                          onChange={(xx) => {
                            const exx =
                              rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ];
                            updateMe(exx.hide());

                            exx.hide(!(exx.hide() == "block"));
                          }}
                        />
                      </div>
                    )}

                    {/* <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                    <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                      Add Text
                    </span>

                    <div className="flex w-full items-center">
                      <TextField
                        type="textarea"
                        sx={{
                          "& .Mui-focused.MuiFormLabel-root": {
                            color: "#bbbbbbc8",
                          },
                          "& .MuiInputBase-root": {
                            borderRadius: "0px",
                          },
                          "& .MuiOutlinedInput-root": {
                            padding: "3px",
                          },
                          "& .MuiInputBase-input, .MuiOutlinedInput-root": {
                            lineHeight: "17px",
                            fontSize: "13px",
                          },
                          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#bbbbbbc8 !important",
                            borderWidth: "1px !important",
                          },
                        }}
                        fullWidth
                        multiline
                      />

                      <IconButton
                        className="ml-3"
                        size="large"
                        onClick={() => {
                          console.log("here");
                        }}
                      >
                        <RiDeleteBin5Line
                          color="#888888"
                          className="cursor-pointer transition-all delay-400 hover:fill-[#494949] hover:text-[#494949]"
                          size={19}
                        />
                      </IconButton>
                    </div>
                  </div> */}

                    {/* <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                    <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                      Width
                    </span>

                    <Slider
                      min={10}
                      size="small"
                      max={300}
                      defaultValue={50}
                      sx={{
                        color: "#979797",
                        "& .MuiSlider-track, .MuiSlider-rail, .MuiSlider-thumb":
                          {
                            backgroundColor: "#979797",
                          },
                        "& .MuiSlider-thumb:hover, .MuiSlider-thumb.Mui-focusVisible":
                          {
                            boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 16%)",
                          },
                        "& .MuiSlider-thumb.Mui-active": {
                          boxShadow: "0px 0px 0px 12px rgba(0, 0, 0, 16%)",
                        },
                      }}
                      aria-label="Default"
                      valueLabelDisplay="auto"
                    />
                  </div> */}

                    {Boolean(
                      rules[Boolean(getRules.length) ? getRules : "body"]
                        .colorScheme
                    ) && (
                      <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                        <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                          Color Scheme
                        </span>

                        <div className="flex relative cursor-pointer items-center">
                          {viewColor == "colorScheme" && (
                            <Color
                              color={rules[
                                Boolean(getRules.length) ? getRules : "body"
                              ].colorScheme()}
                              className="right-[120%] !absolute"
                              onChange={(color) => {
                                updateMe(color);

                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].colorScheme(color.hexa);
                              }}
                            />
                          )}

                          <div
                            onClick={(e: any) => {
                              if (viewColor == "colorScheme") {
                                setViewColor("");
                              } else {
                                setViewColor("colorScheme");
                              }
                            }}
                            className="border w-fit h-fit p-[3px] border-solid mr-[3px] border-[#bbbbbb24]"
                          >
                            <div
                              style={{
                                backgroundColor:
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].colorScheme(),
                              }}
                              className="h-[22px] w-[22px]"
                            ></div>
                          </div>

                          <div
                            onClick={(e: any) => {
                              if (viewColor == "colorScheme") {
                                setViewColor("");
                              } else {
                                setViewColor("colorScheme");
                              }
                            }}
                            className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                          >
                            {rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].colorScheme()}
                          </div>
                        </div>
                      </div>
                    )}

                    {!Boolean(getRules.length) && (
                      <>
                        {editable.map((elem: string, key: number) => {
                          return (
                            <div
                              key={key}
                              className="w-full py-2 border-b border-solid border-[#bbbbbb24]"
                            >
                              <button
                                className={`font-semibold ${style.cus_item} cursor-pointer text-xl justify-between pl-3 pr-2 transition-all delay-350 items-center hover:bg-[#e7e7e752] py-[5px] w-full flex`}
                                onClick={() => {
                                  setPart(elem);
                                }}
                              >
                                <span className="#575757 capitalize font-[300] text-[15px]">
                                  {elem.replace("_", " ")}
                                </span>

                                <div
                                  className={`relative ${style.cus_angle} right-[4px] transition-all delay-350 h-[30px] w-[35px] bg-[#00000014] flex items-center justify-center rounded-lg`}
                                >
                                  <MdChevronRight color="#767676" size={18} />
                                </div>
                              </button>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                  <>
                    {isSaving["one"] ? (
                      <Button
                        sx={stylex.button}
                        className={
                          "!flex !items-center !mx-auto !mb-1 !mt-[2pc]"
                        }
                      >
                        <div className="mr-3 h-[20px] text-[#fff]">
                          <CircularProgress
                            color={"inherit"}
                            className="!w-[20px] !h-[20px]"
                          />
                        </div>
                        <span>Saving...</span>
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          ...stylex.button,
                          ":hover": {
                            backgroundColor: `#4b4b4b !important`,
                          },
                        }}
                        className={
                          "!flex !items-center !mx-auto !mb-1 !mt-[2pc]"
                        }
                        onClick={saveSets}
                      >
                        <span>Save Changes</span>
                      </Button>
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPage;

