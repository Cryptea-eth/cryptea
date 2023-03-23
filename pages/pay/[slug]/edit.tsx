import Head from "next/head";
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
  Alert,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
} from "react-icons/fi";
import Color from "@uiw/react-color-colorful";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import style from "../../../styles/custom.module.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import ReactCrop, { PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { makeStorageClient } from "../../../app/functions/clients";
import dynamic from "next/dynamic";
import Loader from "../../../app/components/elements/loader";
import tmp from "../../../styles/temp.module.css";
import { get_request } from "../../../app/contexts/Cryptea/requests";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { PaymentProvider } from "../../../app/contexts/PaymentContext";
import TextChangeMul from "../../../app/components/elements/editor/textChangeMul";
import Crowd from "../../../app/components/elements/editor/crowdfunding";

const Edit = () => {
  const { isAuthenticated, validator, signer } = useCryptea();

  const [ndata, setData] = useState<string>("");
  const [rules, setRules] = useState<any>({});

  const [Template, setTemplate] = useState<
    React.ComponentType<{
      className?: string;
      editMode?: boolean;
    }>
  >();

  const [templates, setTemplates] = useState<any[]>([]);

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
    unit: "px",
    height: 50,
    x: 0,
    y: 0,
  });

  const [simg, setsImg] = useState<string | undefined>("");
  const [isLoading, setLoader] = useState<boolean>(true);

  const router = useRouter();

  const [linkx, setLinkx] = useState<any>();

  const usern = router.query["slug"];

  useEffect(() => {}, [usern, router.isReady]);

  let [editable, setEditable] = useState<string[]>([]);

  useEffect(() => {

    const init = async () => {

      if (isAuthenticated !== undefined && usern !== undefined) {

        if (isAuthenticated) {

          const linkx: any = await `links/${String(usern).toLowerCase()}`.get(
            "link",
            true
          );

          const temx: any = await "templates".get("data", true);


          setTemplates(temx);

          setLinkx(linkx);

          if (linkx?.template_data !== undefined) {
            const { name, data: udata } = JSON.parse(linkx?.template_data);

            const { rules, getData, data: edata } = await import(
              `../../../app/templates/${name}/data`
            );

            setRules(rules);

            setData(name);

            getData(typeof udata == "string" ? JSON.parse(udata) : udata);

            const edx: string[] = [];

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
    };

    init();
  }, [usern, router, isAuthenticated]);

  let times: any;

  const saveSets = async () => {

    clearTimeout(times);

    try {
      
      saveChanges({
        ...isSaving,
        one: true,
      });

      const { data } = await import(`../../../app/templates/${ndata}/data`);

      const sdata = JSON.stringify({ name: ndata, data });

      await `links/${linkx.id}`.update({ template_data: sdata });

      saveChanges({
        two: true,
        one: false,
      });

      times = setTimeout(() => {
        saveChanges({
          ...isSaving,
          two: false,
        });
      }, 2000);

    } catch (err) {
      const error = err as Error;

      // console.log(error);
    }
  };

  const [isSaving, saveChanges] = useState<{
    one: boolean;
    two: boolean;
  }>({
    one: false,
    two: false,
  });

  const [iimg, setIiimg] = useState({});
  const [getRules, setPart] = useState<string>("");
  const [showMain, setShowMain] = useState(true);
  const [viewColor, setViewColor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [update, updateMe] = useState<any>("");

  const [crowdModal, setCrowdModal] = useState<boolean>(false);

  const [isUploading, setIsUploading] = useState<number>(0);

  const setXTemplates = async (name: string) => {

    setLoader(true);

    const { rules, data: newData } = await import(
      `../../../app/templates/${name}/data`
    );

    const Utemplate = dynamic(() => import(`../../../app/templates/${name}`), {
      suspense: true,
    });

    setRules(rules);

    const { data: Old } = JSON.parse(linkx.template_data);

    const Olddata = typeof Old == "string" ? JSON.parse(Old) : Old;

    const cache = localStorage.getItem(`${String(usern)}-${name}-oldlink`) !== null;

    await`links/${linkx.id}`.update({
      template_data: JSON.stringify({
        name,
        data: cache
          ? localStorage.getItem(`${String(usern)}-${name}-oldlink`)
          : {
              ...newData,
              colorScheme: Olddata.colorScheme,
              errorColor: Olddata.errorColor || "#ff8f33",
            },
      }),
    });

    localStorage.setItem(
      `${String(usern)}-${name}-oldlink`,
      JSON.stringify(Olddata)
    );

    setData(name);

    const edx: string[] = [];

    for (let aa in rules) {
      if (aa != "body") {
        edx.push(aa);
      }
    }

    setEditable(edx);

    setTemplate(Utemplate);

    setPart("");

    setLoader(false);
  };


  const imgCrop = (
    event: React.SyntheticEvent & { target: HTMLInputElement },
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
        setError("Image Size Exceeds The Limit Of 5mb");
        return;
      }

      setsImg(URL.createObjectURL(fil));
      setIiimg(fil);
    }
  };

  const beginUpload = async (files: File[], type: string, exec: string) => {
    const { size: totalSize } = files[0];

    setIsUploading(1);

    const onRootCidReady = (cid: string) => {
      setError("");

      const src = `https://${cid}.ipfs.dweb.link/${usern}.${type}`;
      

      const dataSent = rules[Boolean(getRules.length) ? getRules : "body"];


      if (dataSent?.imgChange && exec == "imgChange") {

        const { display, width: size, borderColor } = dataSent.imgChange();

        dataSent.imgChange({
          borderColor,
          size,
          text: "",
          display: display != "none",
          src,
        });
      }

      if (dataSent?.imgMainChange && exec == "imgMainChange") dataSent.imgMainChange({src: `url('${src}')`});

      updateMe(src);

      

    };

    let uploaded: number = 0;

    const onStoredChunk = (size: number) => {
      uploaded += size;

      const pct: number = (totalSize / uploaded) * 100;

      // console.log(`Uploading... ${pct.toFixed(2)}% complete`);
      updateMe(pct);
      
      if (pct > 80) {
        setViewColor("");
        setIsUploading(0);
      }

    
    };

    const token = await get_request("/storagekey", {}, undefined, false);

    const client = makeStorageClient(token!.data);

    return client.put(files, { onRootCidReady, onStoredChunk });
  };

  const cropImg = (exec: string) => {
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
            const files = [new File([blob], `${usern}.${ext[1]}`)];
            beginUpload(files, ext[1], exec);
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

      {!isLoading && Template !== undefined && null}

      {
        <div
          style={{
            left: isSaving["two"] ? "calc(100% - 353px)" : undefined,
          }}
          className="fixed transition-all delay-500 text-white font-bold left-[calc(100%-257px)] z-[117] px-5 py-3 bg-black"
        >
          Saved
        </div>
      }

      {!isLoading && (
        <div className="flex items-start">
          {Template !== undefined && (
            <PaymentProvider editMode={true}>
              <Suspense fallback={<Loader />}>
                <Template
                  editMode={true}
                  className="overflow-y-scroll cusscroller overflow-x-hidden w-[calc(100%-258px)] z-[100] h-full fixed max-h-screen"
                />
              </Suspense>
            </PaymentProvider>
          )}

          
          {crowdModal && <Crowd crowdModal={crowdModal} update={updateMe} rules={rules} save={saveSets} setCrowdModal={setCrowdModal} />}

          {
            <div className="flex relative z-[130] left-[calc(100%-257px)] right-0 flex-row">
              <div className="max-w-[257px] w-[257px] h-screen bg-[white]">
                <div>
                  <div className="flex flex-row items-center w-full bg-[#bbbbbb24] py-2">
                    <IconButton
                      onClick={() => {
                        if (!getRules.length) {
                          router.push(`/pay/${usern}/overview`);
                        } else {
                          setPart("");
                          setViewColor("");
                        }
                      }}
                      className="ml-1"
                    >
                      <MdChevronLeft color="#838383" size={24} />
                    </IconButton>

                    <div className="text-[#838383] capitalize text-center text-[17px] font-[300] w-3/4">
                      {getRules.length
                        ? getRules.replace("_", " ")
                        : "Overview"}
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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

                      {Boolean(rules[Boolean(getRules.length) ? getRules : "body"]
                          .bgOBColorChange
                      ) && (
                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                            <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                              Background Color
                            </span>

                            <div className="flex relative cursor-pointer items-center">
                              {viewColor == "backgroundbbColor" && (
                                <Color
                                  color={rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ].bgOBColorChange()}

                                  className="right-[120%] !absolute"
                                  onChange={(color) => {

                                    updateMe(color);

                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].bgOBColorChange({
                                      backgroundColor: color.hexa,
                                    });

                                  }}
                                />
                              )}
                              <div
                                onClick={(e: any) => {
                                  if (viewColor == "backgroundbbColor") {
                                    setViewColor("");
                                  } else {
                                    setViewColor("backgroundbbColor");
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
                                      ].bgOBColorChange(),
                                  }}
                                  className="h-[22px] w-[22px]"
                                ></div>
                              </div>

                              <div
                                onClick={(e: any) => {
                                  if (viewColor == "backgroundbbColor") {
                                    setViewColor("");
                                  } else {
                                    setViewColor("backgroundbbColor");
                                  }
                                }}
                                className="text-[#9d9d9d] min-w-[100px] p-2 font-bold"
                              >
                                {rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].bgOBColorChange()}
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                          .textChangeMul
                      ) && (<TextChangeMul update={updateMe} rules={rules} getRules={getRules} />)}

                      {Boolean(
                        rules[Boolean(getRules.length) ? getRules : "body"]
                          .textChange
                      ) && (
                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <div className="text-[#505050] w-full flex items-center mb-[7px] font-bold text-[12px]">
                            <span>Text</span>
                            {/* <Button className="!cursor-pointer !transition-all !delay-300 hover:!text-[#fff] !text-[12px] !normal-case !text-[#505050] !p-1 !rounded-[3rem] hover:!bg-[rgb(157,157,157)]">
                              Advance
                            </Button> */}
                          </div>

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
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
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
                              title="Alignt Left"
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
                          .imgMainChange
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
                                      {Boolean(isUploading) ? (
                                        <Button
                                          className={
                                            "!flex !items-center !bg-[#979797] !w-fit !mr-2 !py-[3px] !font-bold !text-[13px] !capitalize"
                                          }
                                        >
                                          <div className="mr-3 h-[20px] text-[#fff]">
                                            <CircularProgress
                                              color={"inherit"}
                                              className="!w-[20px] !h-[20px]"
                                            />
                                          </div>
                                          <span className="text-white">
                                            updating...
                                          </span>
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="contained"
                                          className="!bg-[#979797] !w-fit !mr-2 !py-[3px] !font-bold !text-[13px] !capitalize"
                                          style={{
                                            fontFamily: "inherit",
                                          }}
                                          onClick={() =>
                                            cropImg("imgMainChange")
                                          }
                                        >
                                          Update Image
                                        </Button>
                                      )}

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
                                    alt=""
                                    width="30"
                                    src={
                                      rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].imgMainChange().src.length
                                        ? rules[
                                            Boolean(getRules.length)
                                              ? getRules
                                              : "body"
                                          ].imgMainChange().src
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
                                  borderRadius: "3px !important",
                                  fontWeight: "semibold",
                                  ":hover": {
                                    backgroundColor: "#818181 !importan",
                                  },
                                }}
                                onClick={(eee: any) => {
                                  const elem = eee.target
                                    ?.previousSibling as HTMLInputElement;

                                  elem.click();
                                }}
                              >
                                update
                              </Button>
                            </div>
                          </div>

                          {rules[Boolean(getRules.length) ? getRules : "body"].imgMainChange?.().display && <div className="flex mt-[9px] w-full justify-between items-center">
                            <span className=  "text-[#979797] mr-[11px] font-bold text-[13px]">
                              Remove Image?
                            </span>

                             <Button
                                sx={{
                                  transition: "all .5s",
                                  textTransform: "capitalize",
                                  fontSize: "13px",
                                  lineHeight: "15px",
                                  backgroundColor: "#979797 !important",
                                  padding: "4px 8px",
                                  color: "#fff",
                                  borderRadius: "3px !important",
                                  fontWeight: "semibold",
                                  ":hover": {
                                    backgroundColor: "#818181 !importan",
                                  },
                                }}
                                onClick={() => {
                                  rules[
                                        Boolean(getRules.length)
                                          ? getRules
                                          : "body"
                                      ].imgMainChange({ display: true });

                                      updateMe(Math.random());

                                }}
                              >
                                Yes
                              </Button>
                          </div>}


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
                                      {Boolean(isUploading) ? (
                                        <Button
                                          className={
                                            "!flex !items-center !bg-[#979797] !w-fit !mr-2 !py-[3px] !font-bold !text-[13px] !capitalize"
                                          }
                                        >
                                          <div className="mr-3 h-[20px] text-[#fff]">
                                            <CircularProgress
                                              color={"inherit"}
                                              className="!w-[20px] !h-[20px]"
                                            />
                                          </div>
                                          <span className="text-white">
                                            updating...
                                          </span>
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="contained"
                                          className="!bg-[#979797] !w-fit !mr-2 !py-[3px] !font-bold !text-[13px] !capitalize"
                                          style={{
                                            fontFamily: "inherit",
                                          }}
                                          onClick={() =>
                                            cropImg(
                                              "imgChange"
                                            )
                                          }
                                        >
                                          Update Image
                                        </Button>
                                      )}

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
                                    alt=""
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
                                  borderRadius: "3px !important",
                                  fontWeight: "semibold",
                                  ":hover": {
                                    backgroundColor: "#818181 !importan",
                                  },
                                }}
                                onClick={(eee: any) => {
                                  const elem = eee.target
                                    ?.previousSibling as HTMLInputElement;

                                  elem.click();
                                }}
                              >
                                update
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3 w-full">
                            <span className="text-[#979797] mr-[11px] font-bold text-[13px] mb-[4px] block">
                              Character Text Image
                            </span>

                            <TextField
                              type="text"
                              defaultValue={
                                rules[
                                  Boolean(getRules.length) ? getRules : "body"
                                ].imgChange().text.length
                                  ? rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ].imgChange().text
                                  : ""
                              }
                              onChange={(xx: any) => {
                                updateMe(xx.target.value);

                                if (validator.isAlphanumeric(xx.target.value)) {
                                  const text = xx.target.value;

                                  const dataSent =
                                    rules[
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
                                    ];
                                  const { borderColor, width, display, src } =
                                    dataSent.imgChange();

                                  dataSent.imgChange({
                                    borderColor,
                                    size: width,
                                    display: display != "none",
                                    src,
                                    text,
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
                              placeholder="TEXT..."
                              fullWidth
                            />
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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

                                    const {
                                      width: size,
                                      display,
                                      text,
                                      src,
                                    } = dataSent.imgChange();

                                    dataSent.imgChange({
                                      borderColor: color.hexa,
                                      size,
                                      display: display != "none",
                                      src,
                                      text,
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
                              min={80}
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

                                const { borderColor, display, text, src } =
                                  dx.imgChange();

                                dx.imgChange({
                                  borderColor,
                                  size: xx.target.value,
                                  display: display != "none",
                                  src,
                                  text,
                                });
                                updateMe(xx);
                              }}
                              sx={{
                                color: "#979797",
                                width: "calc(100% - 9px)",
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
                                ].imgChange()?.display == "none"
                              )}
                              onChange={(xx) => {
                                const exx =
                                  rules[
                                    Boolean(getRules.length) ? getRules : "body"
                                  ];
                                updateMe(exx.imgChange().display);

                                const {
                                  width: size,
                                  borderColor,
                                  text,
                                  src,
                                } = exx.imgChange();

                                exx.imgChange({
                                  borderColor,
                                  display: !(
                                    exx.imgChange().display == "block"
                                  ),
                                  size,
                                  text,
                                  src,
                                });
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {Boolean(
                        rules[Boolean(getRules.length) ? getRules : "body"]
                          .width
                      ) && (
                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                            Width
                          </span>

                          <Slider
                            min={120}
                            size="small"
                            max={300}
                            value={rules[
                              Boolean(getRules.length) ? getRules : "body"
                            ].width()}
                            onChange={(xx: any) => {
                              const dx =
                                rules[getRules.length ? getRules : "body"];

                              dx.width(xx.target.value);

                              updateMe(xx);
                            }}
                            sx={{
                              color: "#979797",
                              width: "calc(100% - 9px)",
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
                      )}

                      {Boolean(
                        rules[Boolean(getRules.length) ? getRules : "body"]
                          .height
                      ) && (
                        <div className="w-full px-3 flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <span className="text-[#505050] mb-[7px] font-bold text-[12px]">
                            Height
                          </span>

                          <Slider
                            min={120}
                            size="small"
                            max={400}
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
                              width: "calc(100% - 9px)",
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                                      Boolean(getRules.length)
                                        ? getRules
                                        : "body"
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
                              ].hide?.() == "none"
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
                          // console.log("here");
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
                        width: "calc(100% - 9px)",
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

                      {/* crowdfunding */}
                      {getRules == "crowdfund" && (
                        <div className="w-full flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">

                        </div>
                      )}

                      {getRules == "change_template" && (
                        <div className="w-full flex flex-col items-baseline py-2 border-b border-solid border-[#bbbbbb24]">
                          <>
                            {templates.map((attributes: any, i: number) => {
                              if (
                                true
                                // attributes.importance == "both" ||
                                // attributes.importance == linkx.type
                              ) {
                                return (
                                  <div
                                    key={i}
                                    className="flex flex-col w-full h-fit px-3 py-2 border-b border-solid border-[#bbbbbb24] justify-between"
                                  >
                                    <span className="text-[#505050] mb-[7px] font-bold text-[14px]">
                                      {attributes.name}
                                    </span>
                                    <div
                                      onClick={() =>
                                        setXTemplates(attributes.name)
                                      }
                                    >
                                      <Image
                                        src={require(`../../../app/templates/${attributes.name}/img.png`)}
                                        alt={attributes.name}
                                        width={257}
                                        className={`${
                                          attributes.name != ndata
                                            ? tmp.tempimg
                                            : tmp.tempimg_selected
                                        } !border !border-solid hover:!border-[#777] !cursor-pointer transition-all delay-[300] !rounded-[3px]`}
                                        height={128.5}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </>
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

                                    if (elem == 'crowdfund') {

                                       setCrowdModal(true);

                                      return;
                                    }

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
          }
        </div>
      )}
    </div>
  );
};

export default Edit;
