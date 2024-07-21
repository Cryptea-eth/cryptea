import empty from "../../../public/images/coming-soon.svg";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import {
  Typography,
  Box,
  Button,
  ToggleButton,
  Avatar,
  IconButton,
  Modal,
  ToggleButtonGroup,
  Tooltip,
  TextField,
  CircularProgress
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import {
  MdAddLink,
  MdClose,
  MdInfo,
  MdLink,
} from "react-icons/md";
import { FaCoins } from "react-icons/fa";
import Link from "next/link";
import Loader from "../../../app/components/elements/loader";
import { FiThumbsDown, FiThumbsUp, FiTrash2 } from "react-icons/fi";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { useRouter } from "next/router";
import Page from "../../../app/components/elements/dashboard";
import { GiTwoCoins } from "react-icons/gi";
import {
  DashContext,
  dash,
  Link as Linkx,
} from "../../../app/contexts/GenContext";
import { json } from "stream/consumers";
import Head from "next/head";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const text = {
  "& .Mui-focused.MuiFormLabel-root": {
    color: "#8036de",
  },
  "& .MuiInputLabel-root": {
    fontWeight: "600",
    color: "#121212",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline, .MuiInput-underline::after":
    {
      borderColor: `#8036de !important`,
    },
  "& .MuiInputBase-input": {
    color: "#666666",
  },
};

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
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const styleInit = {
  minWidth: 300,
  width: "70%",
  maxWidth: 800,
  borderRadius: 6,
  outline: "none",
  p: 4,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  ...styleInit,
};

const Links = () => {

  const [showLinkModal, setShowLinkModal] = useState<string | number>("");

  const [linkAdd, showLinkAdd] = useState<boolean>(false);

  const [isLoading, loading] = useState<boolean>(true);

  const [linkLoading, setLoading] = useState<boolean>(false);

  const [genError, setGenError] = useState<string>("");

  const { isAuthenticated, validator, account } = useCryptea();

  const [stage, setStage] = useState<0 | 1>(0);

  const [links, addLinks] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {

  },[router.isReady])

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else {
        "links".get("*", true).then((e: any) => {
          if(!Boolean(e.error)){
            addLinks(e);
            loading(false);
          }
        });
      }
    }
  }, [isAuthenticated, router]);

  const deleteLink = async () => {
    loading(true);

    await "links".delete(Number(showLinkModal));

    setShowLinkModal("");

    const mlink = await "links".get("*", true);

    addLinks(mlink);

    loading(false);

  };

  const { newLink: formLink }: dash = useContext(DashContext);

  const { errors: LinkErr } = formLink as Linkx;

  const handleClose = () => setShowLinkModal("");

  const handleClose2 = () => showLinkAdd(false);

  const errorExists = (arr?: string[]) => {
    const { errors } = formLink as Linkx;

    if (errors !== undefined) {
      let values: string[] = Object.values(errors);

      if (arr !== undefined) {
        values = arr.map((f) => errors[f] || "");
      }

      const valid = values.filter((e) => e.length);

      if (valid.length) {
        return true;
      }
    }

    return false;
  };

  const validateForm = async () => {
      
    const { title, desc, type, errors, slug, amount, redirect } =
      formLink as Linkx;

    if (linkLoading) return;

    if (!stage) {
      if (!Boolean(title)) {
        errors?.update?.({ title: "Title is required" });
        return;
      }

      errors?.refresh?.();
      setStage(1);
    } else {

      if (Boolean(slug)) {
        if (!/[a-z]/gi.test(String(slug)?.charAt(0))) {
          errors?.update?.({ slug: "Link Slug must start with an alphabet" });
          return;
        }

        if (!validator.isAlphanumeric(slug as string)) {
          errors?.update?.({
            slug: "Link Slug should not contain any special characters",
          });

          return;
        }
      } else {
        errors?.update?.({
          slug: "Link Slug should not be empty",
        });

        return;
      }

      if (Boolean(amount)) {
        if (!validator.isNumeric(String(amount))) {
          errors?.update?.({
            amount: "Amount should contain a valid number",
          });
          return;
        }
      }

      if (Boolean(redirect)) {
        if (!validator.isURL(redirect as string)) {
          errors?.update?.({
            redirect: "Redirect Url should contain a valid link",
          });
          return;
        }
      }
    

    setLoading(true);

    let name = "origin";

    if (!Boolean(desc)) name = "carbon";
    

    const { data: template_data } = await import(
      `../../../app/templates/${name}/data`
    );

    const templateData = { name, data: template_data };

    const amountMulti = JSON.stringify([0.1, 10, 50, 100]);

    const rinputs = {
      onetime: [],
      sub: [],
    };

    const newData = {
      slug: String(slug).toLowerCase(),
      desc,
      title,
      amount: Boolean(amount) ? amount : "variable",
      address: account,
      redirect,
      amountMulti,
      type: Boolean(type) ? type : "onetime",
      rdata: JSON.stringify(rinputs),
      template_data: JSON.stringify(templateData),
    };

    try {

      await "links".save(newData);

      router.push(`/pay/${newData.slug}/overview`);
      
      showLinkAdd(false);

    } catch (e) {
      const errorObject = e as any;

      // console.log(errorObject)

      if (errorObject.error) {

        setGenError(errorObject.message);

      } else {
        setGenError("Something went wrong, please try again");
      }
      setLoading(false);
      }
    }
  };

  return (
    <Page>
      <Head>
        <title>
         Links | Dashboard | Breew
        </title>
        <meta
          name="description"
          content={`View, update, delete your links`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pt-[75px] px-5">
        {isLoading && <Loader />}

        {Boolean(showLinkModal) && (
          <>
            <Modal
              open={Boolean(showLinkModal)}
              onClose={handleClose}
              aria-labelledby="Delete Link"
              aria-describedby="Remove Link From List"
              sx={{
                "&& .MuiBackdrop-root": {
                  backdropFilter: "blur(5px)",
                },
              }}
              className={`overflow-y-scroll overflow-x-hidden cusscroller flex justify-center sxm:items-end`}
            >
              <Box
                className="sm:w-full  h-fit 3mdd:px-[2px]"
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
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.4rem]">
                        Delete Link
                      </h2>
                    </div>

                    <IconButton size={"medium"} onClick={handleClose}>
                      <MdClose
                        size={20}
                        color={"rgb(32,33,36)"}
                        className="cursor-pointer"
                      />
                    </IconButton>
                  </div>

                  <span className="text-[#7c7c7c] mt-3 block font-[600] text-[18px] text-center ">
                    You would not be able to recover this link again, although you can always create a new link, without your already deleted data.
                    Are you sure you want to delete this link?
                  </span>
                </div>

                <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
                  <div className="flex items-center">
                    <Button
                      onClick={deleteLink}
                      className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !min-w-[100px] mr-1 !text-white !bg-[#8036de] !border !border-solid !border-[rgb(245,245,255)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                    >
                      <FiThumbsUp className={"mr-2"} size={23} /> Yes
                    </Button>

                    <Button
                      onClick={handleClose}
                      className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !min-w-[100px] ml-1 !text-white !bg-[#8036de] !border !border-solid !border-[rgb(245,245,255)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                    >
                      <FiThumbsDown className={"mr-2"} size={23} /> No
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </>
        )}

        

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
              <span className="mt-2 text-[17px] text-[#565656] block w-full text-center">
                You have no links yet, Click the button below to create links
              </span>
            </div>

            <Button
              onClick={() => showLinkAdd(true)}
              className="!py-2 !font-bold !px-5 !capitalize !flex !items-center !text-white !bg-[#8036de] !border !border-solid !border-[rgb(245,245,255)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
            >
              <MdAddLink size={25} className="mr-1" /> Create Link
            </Button>
          </div>
        )}

        {linkAdd && (
          <>
            <Modal
              open={linkAdd}
              sx={{
                "&& .MuiBackdrop-root": {
                  backdropFilter: "blur(5px)",
                  width: "calc(100% - 8px)",
                },
              }}
              onClose={handleClose2}
              className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
              aria-labelledby="add new link"
              aria-describedby="New Link Short Cut"
            >
              <Box
                className="sm:w-full h-fit 3mdd:px-[2px]"
                sx={{ ...styleInit, position: "relative", margin: "auto" }}
              >
                <div className="py-4 px-6 bg-white -mb-[1px] rounded-t-[.9rem]">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                        Create New Link
                      </h2>
                      <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                        Easily Receive Payments with Links!
                      </span>
                    </div>

                    <IconButton size={"medium"} onClick={handleClose2}>
                      <MdClose
                        size={20}
                        color={"rgb(32,33,36)"}
                        className="cursor-pointer"
                      />
                    </IconButton>
                  </div>

                  {Boolean(genError) && (
                    <div className="bg-[#ff8f33] text-white rounded-md w-[95%] font-bold mt-2 mx-auto p-3">
                      {genError}
                    </div>
                  )}

                  <SwipeableViews index={stage}>
                    <TabPanel index={0} value={stage}>
                      <form
                        encType="multipart/form-data"
                        onSubmit={(f) => {
                          f.preventDefault();
                          validateForm();
                        }}
                        action="#"
                      >
                        
                        {/* <div className="py-3">
                          <label className="text-[#565656] mb-2 font-[600]">
                            Type
                          </label>

                          <ToggleButtonGroup
                            value={formLink.type}
                            sx={{
                              justifyContent: "space-between",
                              width: "100%",
                              "& .Mui-selected": {
                                backgroundColor: `#8036de !important`,
                                color: `#fff !important`,
                              },
                              "& .MuiButtonBase-root:first-of-type": {
                                marginRight: "0px !important",
                                marginLeft: "0px !important",
                              },
                              "& .MuiButtonBase-root": {
                                padding: "10px 15px !important",
                              },
                              "& .MuiToggleButtonGroup-grouped": {
                                borderRadius: "4px !important",
                                minWidth: 55,
                                marginLeft: 3,
                                border:
                                  "1px solid rgba(0, 0, 0, 0.12) !important",
                              },
                              "& .MuiToggleButtonGroup-grouped.Mui-selected": {
                                borderColor: "#8036de !important",
                              },
                            }}
                            exclusive
                            className="w-full cusscroller overflow-y-hidden justify-around mb-2 pb-1"
                            onChange={(e: any) => {
                              if (e.target.value !== undefined) {
                                setGenError("");
                                formLink?.update?.({ type: e.target.value });
                              }
                            }}
                          >
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value={"onetime"}
                            >
                              <GiTwoCoins className="mr-2" size={20} /> Onetime
                            </ToggleButton>
                            <ToggleButton
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                              value={"sub"}
                            >
                              <FaCoins className="mr-2" size={20} />{" "}
                              Subscription
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </div> */}

                        <div className="py-3">
                          <label className="text-[#565656] mb-2 font-[600]">
                            Title
                          </label>

                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="standard"
                            sx={text}
                            value={formLink?.title}
                            helperText={
                              Boolean(LinkErr?.title)
                                ? LinkErr?.title
                                : "Required*"
                            }
                            error={Boolean(LinkErr?.title)}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              setGenError("");

                              formLink?.update?.({ title: e.target.value });
                            }}
                          />
                        </div>

                        <div className="py-3">
                          <label className="text-[#565656] mb-2 font-[600]">
                            Description
                          </label>

                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="standard"
                            sx={text}
                            multiline
                            className={"cusscroller"}
                            maxRows={3}
                            helperText={
                              Boolean(LinkErr?.desc) ? LinkErr?.desc : ""
                            }
                            error={Boolean(LinkErr?.desc)}
                            value={formLink?.desc}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              setGenError("");
                              formLink?.update?.({ desc: e.target.value });
                            }}
                          />
                        </div>
                      </form>
                    </TabPanel>

                    <TabPanel index={1} value={stage}>
                      <form
                        action="#"
                        encType="multipart/form-data"
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <div className="py-3">
                          <Tooltip
                            arrow
                            title="eg. https://user.cryptea.me/your-link-slug"
                          >
                            <label className="text-[#565656] mb-2 font-[600]">
                              Link Slug
                            </label>
                          </Tooltip>

                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="standard"
                            sx={text}
                            value={formLink?.slug}
                            helperText={
                              Boolean(LinkErr?.slug)
                                ? LinkErr?.slug
                                : "Required*"
                            }
                            error={Boolean(LinkErr?.slug)}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              setGenError("");
                              formLink?.update?.({
                                slug: e.target.value.toLowerCase(),
                              });
                            }}
                          />
                        </div>

                        <div className="py-3">
                          <Tooltip
                            arrow
                            title="If left empty, any amount above zero is valid"
                          >
                            <label className="text-[#565656] w-fit flex items-center mb-2 font-[600]">
                              Amount{" "}
                              <MdInfo
                                className={"ml-1 cursor-pointer"}
                                size={18}
                              />
                            </label>
                          </Tooltip>

                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="standard"
                            sx={text}
                            value={formLink?.amount}
                            helperText={
                              Boolean(LinkErr?.amount) ? LinkErr?.amount : ""
                            }
                            error={Boolean(LinkErr?.amount)}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              const val = e.target.value;
                              setGenError("");
                              formLink?.update?.({
                                amount: val.replace(/[^\d.]/g, ""),
                              });
                            }}
                          />
                        </div>

                        <div className="py-3">
                          <Tooltip
                            arrow
                            title="A link to redirect to after people pay through your link, this can be left empty for now if none is available"
                          >
                            <label className="text-[#565656] w-fit flex items-center mb-2 font-[600]">
                              Redirect to{" "}
                              <MdInfo
                                className={"ml-1 cursor-pointer"}
                                size={18}
                              />
                            </label>
                          </Tooltip>

                          <TextField
                            fullWidth
                            id="outlined-basic"
                            variant="standard"
                            sx={text}
                            helperText={
                              Boolean(LinkErr?.redirect)
                                ? LinkErr?.redirect
                                : ""
                            }
                            error={Boolean(LinkErr?.redirect)}
                            value={formLink?.redirect}
                            onChange={(
                              e: React.ChangeEvent<
                                HTMLInputElement | HTMLTextAreaElement
                              >
                            ) => {
                              setGenError("");
                              formLink?.update?.({ redirect: e.target.value });
                            }}
                          />
                        </div>
                      </form>
                    </TabPanel>
                  </SwipeableViews>
                </div>

                <div
                  style={{
                    justifyContent: linkLoading ? "flex-end" : undefined,
                    WebkitJustifyContent: linkLoading ? "flex-end" : undefined,
                  }}
                  className="bg-[#efefef] flex justify-between items-center rounded-b-[.9rem] px-6 py-4"
                >
                  {!linkLoading && (
                    <Link href={"/dashboard/links/new"}>
                      <Tooltip
                        arrow
                        title="Click here if you want to be able to change more things about your link"
                      >
                        <a>
                          <Button className="!w-fit !items-center !flex !rounded-md !text-[#5f5f5f] font-bold !bg-[#d6d6d6] !capitalize !border-none">
                            <MdAddLink size={20} className="mr-1" />
                            Advanced
                          </Button>
                        </a>
                      </Tooltip>
                    </Link>
                  )}

                  <div className="flex items-center">
                    {Boolean(stage) && !linkLoading && (
                      <Button
                        sx={{
                          color: `${
                            errorExists(["desc", "type", "title"])
                              ? "#ff3a3a"
                              : "#5f5f5f"
                          } !important`,
                        }}
                        onClick={() => setStage(0)}
                        className="!w-fit !items-center !flex !rounded-md font-[400] !px-0 !capitalize !border-none"
                      >
                        Back
                      </Button>
                    )}

                    <Button
                      onClick={validateForm}
                      className="!py-2 !font-bold !px-3 !capitalize !flex !items-center !text-white !bg-[#8036de] !border !border-solid !border-[rgb(245,245,255)] !transition-all !delay-500 hover:!text-[#f0f0f0] !rounded-lg"
                    >
                      {linkLoading && (
                        <CircularProgress
                          className="mr-2"
                          color={"inherit"}
                          size={20}
                        />
                      )}

                      {linkLoading
                        ? "Creating..."
                        : stage
                        ? "Create Link"
                        : "Next"}
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </>
        )}

        {Boolean(links.length) && !isLoading && (
          <>
            <h2 className="font-bold flex items-center justify-between text-[20px] mt-[10px] mb-[7px]">
              <span className="">Active Links</span>
              <Tooltip arrow title="Create a link">
                <IconButton onClick={() => showLinkAdd(true)} size={"medium"}>
                  <MdAddLink
                    size={30}
                    color={"#242424"}
                    className="cursor-pointer"
                  />
                </IconButton>
              </Tooltip>
            </h2>
            <div
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              }}
              className="grid gap-6 mb-3 grid-flow-dense"
            >
              <Button className="!w-full !rounded-md hover:!border-[#8036de82] hover:!bg-[#8036de82] !text-[#121212] !bg-transparent hover:!text-white !border !border-solid !border-[rgb(245,245,255)]">
                <Link href="/dashboard/links/new">
                  <a className="flex-col p-4 w-full h-full flex justify-center items-center">
                    <MdAddLink size={50} className="mb-3" />

                    <h2 className="font-bold">Create Link</h2>
                  </a>
                </Link>
              </Button>

              {links.map((attributes: any, i: number) => {
                // bg-[#efefef]

                const { template_data, link, desc, id } = attributes;

                const { data: tm_data } = JSON.parse(template_data);

                const { image } =
                  tm_data !== undefined
                    ? typeof tm_data == "string"
                      ? JSON.parse(tm_data)
                      : tm_data
                    : { image: undefined };

                const { src } =
                  image !== undefined ? image : { src: undefined };

                return (
                  <Link href={`/pay/${link}/overview`} key={i}>
                    <a>
                      <div className="w-full border border-[rgb(245,245,255)] rounded-md border-solid p-2 hover:bg-[rgb(248,248,248)] transition-all delay-300 cursor-pointer">
                        <div className="mb-4">
                          <Avatar
                            sx={{
                              width: "100%",
                              height: 183,
                              margin: "auto",
                              backgroundColor: !Boolean(src)
                                ? "#8036de82"
                                : undefined,
                            }}
                            className="text-[50px] font-bold"
                            variant="rounded"
                            src={src}
                          >
                            {(
                              String(link).charAt(0) + String(link).charAt(1)
                            ).toUpperCase()}
                          </Avatar>
                        </div>

                        <div className="flex items-center mb-[10px] justify-between">
                          <div className="flex items-center w-[calc(100%-44px)]">
                            <div className="text-white w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-md mr-[.75rem] flex items-center justify-center bg-[#8036de]">
                              <MdLink size={21} />
                            </div>
                            <div className="truncate">
                              <h3 className="truncate flex items-center text-[17px] leading-[20px] font-[500] text-[#121212]">
                                {link}
                              </h3>
                              <span className="block text-[14px] leading-[1.2] truncate w-full text-[#575757]">
                                {Boolean(desc) ? desc : "•••"}
                              </span>
                            </div>
                          </div>
                          <div
                            onClick={(e: any) => {
                              e.preventDefault();

                              setShowLinkModal(id);
                            }}
                          >
                            <IconButton
                              color="inherit"
                              size={"large"}
                              sx={{
                                color: "#6b6b6b",
                              }}
                            >
                              <FiTrash2 size={20} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default Links;
