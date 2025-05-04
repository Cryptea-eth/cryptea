import empty from "../../../../../public/images/empty2.png";
import {
  Avatar,
  ClickAwayListener,
  IconButton,
  ListItemAvatar,
  Popover,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import React, { useContext, useState, useEffect, useRef } from "react";
import { BiBell } from "react-icons/bi";
import { get_request } from "../../../../contexts/Cryptea/requests";
import { dash, DashContext } from "../../../../contexts/GenContext";

const DashHeader = ({
  className,
  username,
  dp,
}: {
  className?: string;
  username: string;
  dp: string;
}) => {
  const { sidebar }: dash = useContext(DashContext);

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  );

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState<any>("all");

  const [data, setData] = useState<any>({});

  const [odata, setOdata] = useState<any[]>([]);

  const [isLoading, setLoading] = useState<boolean>(true);

  const [mloader, setMloader] = useState<boolean>(false);

  const [newNote, setNewNote] = useState<boolean>(false);

  const [noteData, setNoteData] = useState<any>({});

  const once = useRef<boolean>(true);

  const mOnce = useRef<boolean>(true);

  useEffect(() => {
    const itx = async () => {
      const dx = await get_request("/notifications", {}, undefined, false);

      if (dx?.data) {
        if (typeof dx?.data == "object") {
          setData(dx?.data.data);

          setNoteData({
            current_page: dx.data.current_page,
            last_page: dx.data.last_page,
          });

          // // console.log(dx.data.data, 'ww')

          setNewNote(
            Boolean(dx?.data.data.filter((d: any) => d.read == "false").length)
          );

          if (isLoading) setLoading(false);
        }
      }

      // setTimeout(itx, 5000);
    };

    if (once.current) {
      once.current = false;

      itx();
    }
  }, []);

  const handleChange = (event: React.SyntheticEvent, e: any) => setValue(e);

  const handleNotes = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const nopen = Boolean(anchorEl);
  const id = nopen ? "Your Notifications" : undefined;

  const active =
    "before:content-[''] before:bottom-[25px] before:left-[28px] before:bg-[#8036de] before:h-[7px] before:rounded-[50%] before:w-[7px]";

  const noteValues = (d: any, i: number) => {
    let text: JSX.Element = <></>;

    const data = JSON.parse(d.data || "{}");

    const tags = JSON.parse(d.tags || "[]");

    tags.forEach((e: string) => {
      if (e == "payment") {
        text = (
          <>
            <span className="font-[500] capitalize">{data.name}</span> paid{" "}
            <b>${data.amount}</b>
          </>
        );
      }
    });

    const dz = (Boolean(d.text) ? d.text : data.name).substr(0, 2);

    return (
      <div
        key={i}
        style={{
          backgroundColor: !d.read ? "#8036de14" : undefined,
        }}
        className="w-full px-6 py-2 flex items-center"
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            fontSize: "13px",
            color: "rgba(0, 0, 0, .4)",
            bgcolor: "#8036de",
          }}
          variant={"rounded"}
          className="font-bold"
        >
          <strong>{dz.toUpperCase()}</strong>
        </Avatar>

        <div className="ml-3 max-w-[94%]">
          <div
            title={
              Boolean(d.text)
                ? d.text
                : data.name + " paid" + " $" + data.amount
            }
            className="text-[14px] truncate"
          >
            {Boolean(d.text) ? d.text : text}
          </div>

          <span className="block  text-[12px] text-[#838383]">
            {d.time} • {tags.join(" • ")}{" "}
            {Boolean(data.link) ? " • " + data.link : ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: open ? "flex" : "none",
        }}
        className="w-[360px] z-[1000000] 33md:w-[320px] bg-white flex-col max-h-[400px] top-[60px] right-0 shadow-md 2mdd:-right-[63px] rounded-md absolute"
      >
        <div className="px-5 pt-2 border-b-[2px] border-solid border-b-[rgb(194,194,194)]">
          <div className="flex items-center">
            <h2 className="text-[rgb(32,33,36)] text-[1.1rem] flex items-center justify-between font-bold relative">
              Notifications
            </h2>
          </div>

          <Tabs
            value={value}
            onChange={handleChange}
            className="relative top-[2px]"
            sx={{
              "& .MuiTabs-flexContainer": {
                width: "100%",
                justifyContent: "unset",
              },
              "& .MuiTab-root.MuiButtonBase-root.Mui-selected": {
                fontWeight: "bold",
                borderRadius: "4px",
                opacity: 1,
                color: "rgb(18, 18, 18)",
                backgroundColor: "transparent !important",
                textTransform: "capitalize",
              },
              "& .MuiButtonBase-root.MuiTab-root": {
                fontWeight: "bold",
                padding: "0px",
                borderRadius: "4px",
                textTransform: "capitalize",
                color: "rgb(194,194,194)",
                maxHeight: "30px",
                opacity: 0.7,
                position: "relative",
                top: "4px",
                backgroundColor: "transparent !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "rgb(83,84,87) !important",
                zIndex: 20,
              },
            }}
            aria-label="Notifications"
          >
            <Tab value="all" label="All" />
            {/* <Tab value="payment" label="Payments" /> */}
          </Tabs>
        </div>

        {Boolean(data.length) ? (
          <div
            onScroll={async (
              e: React.UIEvent<HTMLDivElement, UIEvent> & {
                target: {
                  scrollHeight: number;
                  scrollTop: number;
                  clientHeight: number;
                };
              }
            ) => {
              const { scrollHeight, scrollTop, clientHeight } = e.target;

              const height = scrollHeight - clientHeight;

              if (scrollTop >= height - 30 && mOnce.current) {
                mOnce.current = false;

                if (noteData.current_page != noteData.last_page) {
                  setMloader(true);

                  const dxx = await get_request(
                    "/notifications",
                    {
                      params: {
                        page: noteData.current_page + 1,
                      },
                    },
                    undefined,
                    false
                  );

                  // // console.log("wpeo", Object.values(dxx?.data.data).length);

                  setOdata([...odata, ...Object.values(dxx?.data.data)]);

                  setNoteData({
                    current_page: dxx?.data.current_page,
                    last_page: dxx?.data.last_page,
                  });

                  if (!newNote) {
                    setNewNote(
                      Boolean(
                        Object.values(dxx?.data.data).filter(
                          (d: any) => d.read == "false"
                        ).length
                      )
                    );
                  }
                  mOnce.current = true;
                  setMloader(false);
                }
              }
            }}
            className="overflow-y-scroll cusscroller overflow-x-hidden"
          >
            {data.map((d: any, i: number) => noteValues(d, i))}

            {Boolean(odata) &&
              odata.map((d: any, i: number) => noteValues(d, i))}

            {mloader && (
              <div className="flex items-center py-2 justify-center">
                <CircularProgress className="text-[#8036de]" size={25} />
              </div>
            )}
          </div>
        ) : (
          <div
            className="empty"
            style={{
              display: "flex",
              width: "100%",
              height: "400px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="w-[240px]">
              <Image
                src={empty}
                className="mb-3 object-scale-down"
                layout={"intrinsic"}
                alt="Quite empty here"
              />
            </div>

            <h2 className="text-[#8990a3] font-[600] text-xl mx-auto my-2">
              Nothing here for now
            </h2>
          </div>
        )}
      </div>

      <div
        style={{
          width: sidebar?.openPage ? "calc(100% - 207px)" : "calc(100% - 77px)",
          right: 0,
        }}
        className={`2sm:!w-[calc(100%-77px)] ${
          className === undefined
            ? "flex transition-all delay-500 z-10 px-[20px] fixed py-[13px] justify-between items-center border-solid border-b-[1px] 3md:border-b-transparent bg-white border-b-[#E3E3E3]"
            : className
        }`}
      >
        <div className="">
          <h1 className="font-bold">Hey there!☕</h1>
          <span>Looking good today..</span>
        </div>
        <div className="flex items-center">
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="h-full relative w-[20px] mx-2">
              <IconButton
                onClick={() => {
                  setOpen(!open);

                  get_request("/notifications/view", {}, undefined, false).then(
                    (e) => {
                      // console.log(e?.data);
                    }
                  );
                }}
                style={{
                  backgroundColor: open ? "#ececec" : undefined,
                }}
                className={`right-[14px] relative before:absolute ${
                  newNote ? active : ""
                }`}
                size={"medium"}
              >
                <BiBell
                  size={24}
                  aria-describedby={id}
                  onClick={handleNotes}
                  className="cursor-pointer"
                  color="#6a6a6a"
                />
              </IconButton>
            </div>
          </ClickAwayListener>
          <Avatar
            src={dp}
            sx={{
              width: 40,
              height: 40,
              fontWeight: "bold",
              bgcolor: !Boolean(dp) ? "#8036de" : undefined,
            }}
            alt={username}
          >
            {username?.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      </div>
    </>
  );
};

export default DashHeader;
