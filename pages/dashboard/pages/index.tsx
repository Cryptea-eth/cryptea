import empty from "../../../public/images/coming-soon.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Modal,
} from "@mui/material";
import {
  MdAddLink,
  MdDeleteOutline,
  MdInfo,
  MdModeEditOutline,
} from "react-icons/md";
import Link from "next/link";
import { RiDeleteBin2Line, RiPagesLine } from "react-icons/ri";
import { useCryptea } from "../../../app/contexts/Cryptea";
import Router from "next/router";
import Head from 'next/head';
import Page from "../../../app/components/elements/dashboard";

const Pages = () => {
  const [isLoading, loading] = useState<boolean>(true);
  const { isAuthenticated } = useCryptea();
  const [links, addLinks] = useState<any>([]);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        Router.push("/auth");
      } else {
        "links".get("*", true).then((e: any) => {
          if (!Boolean(e.error)) {
            addLinks(e);
            loading(false);
          }
        });
      }
    }
  }, [isAuthenticated]);

  return (
    <Page>
      <Head>
        <title>Pages | Dashboard | Cryptea</title>
        <meta name="description" content={`Edit All Your Pages`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pt-[75px] px-5">
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
                alt="No pages yet"
              />
            </div>

            <div className="mt-2 mb-3">
              <h2 className="text-[22px] text-center font-bold">
                Hmm, its empty here
              </h2>
              <span className="mt-2 text-[17px] block w-full text-center">
                You have no pages yet, Visit the links tab,and create one.
              </span>
            </div>
          </div>
        )}

        {Boolean(links.length) && !isLoading && (
          <>
            <h2 className="font-bold text-[20px] mt-6 mb-3">Current Pages</h2>
            <div
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              }}
              className="grid gap-2 grid-flow-dense"
            >
              {links.map((attributes: any, i: number) => {
                let realS = "";
                if (attributes.templates_data !== undefined) {

                  const { data } = JSON.parse(attributes.template_data);

                  const { image } = typeof data == 'string' ? JSON.parse(data) : data;
                  
                  realS = image.src;

                }

                return (
                  <div
                    key={i}
                    className="w-full cursor-default border-2 border-[#f5705982] border-solid p-4 rounded-md"
                  >
                    <div className="flex items-start">
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: !Boolean(realS) ? "#f57059" : undefined,
                          marginRight: "10px",
                        }}
                        src={realS}
                        variant="rounded"
                      >
                        {(
                          String(attributes.link).charAt(0) +
                          String(attributes.link).charAt(1)
                        ).toUpperCase()}
                      </Avatar>

                      <div className="w-[calc(100%-70px)]">
                        <h3 className="truncate text-[17px] mb-[10px] font-bold text-[#242424]">
                          {attributes.link}
                        </h3>

                        <span className="truncate block w-full text-[#6d6d6d]">
                          {attributes.desc ? attributes.desc : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex mt-4 justify-between items-center w-full">
                      <Link
                        href={`/pay/${attributes.link.toLowerCase()}/edit`}
                      >
                        <a rel="noreferrer">
                          <Button className="!py-2 !font-bold !px-4 !capitalize !flex !items-center !text-white hover:!bg-[#ff8c78b8] !bg-[#f36e57b8] !transition-all !delay-500 !rounded-lg">
                            <MdModeEditOutline size={19} className="mr-1" />{" "}
                            Edit Page
                          </Button>
                        </a>
                      </Link>

                      <Link href={`/pay/${attributes.link.toLowerCase()}`}>
                        <a title="View Page" target="_blank" rel="noreferrer">
                          <IconButton
                            color="inherit"
                            size={"large"}
                            sx={{ color: "#f36e57b8" }}
                          >
                            <RiPagesLine size={20} />{" "}
                          </IconButton>
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default Pages;
