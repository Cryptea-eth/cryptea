import { TextField } from "@mui/material";
import Head from "next/head";
import Sidebar from "../../../app/components/elements/dashboard/sidebar";
import { Avatar, IconButton } from "@mui/material";
import NumberFormat from 'react-number-format';
import { FiShare2, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { MdArrowBackIos, MdLink } from "react-icons/md";
import { TbApiApp } from 'react-icons/tb';
import { AiOutlineUser } from 'react-icons/ai'
import { dash, DashContext } from "../../../app/contexts/GenContext";
import { useCryptea } from "../../../app/contexts/Cryptea";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  initD
} from "../../../app/components/elements/dashboard/link/data";
import sortData, { totSub } from "../../../app/components/elements/dashboard/linkOverview/generateData";

const Settings = () => {
  const { isAuthenticated } = useCryptea();


  const [isLoading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const [social, toggleSocial] = useState<boolean>(false);

  const { slug } = router.query;

  const { sidebar }: dash = useContext(DashContext);

  const [data, setData] = useState<any>({});

  const [userLk, setUserLk] = useState<string>('');

  const [userx, setUserX] = useState<any>({});

  useEffect(() => {

    const init = async () => {

      setUserX(await ('user').get('*', true))

      const { link: mDx, user, onetime, sub, views } = await initD(String(slug).toLowerCase());

      setUserLk(`${window.location.origin}/user/${slug}`);

      if (user['owner']) {

        let src = '';

        let template = '';

        if (mDx.template_data !== undefined) {
          const { data: tdata, name } = JSON.parse(mDx.template_data);

          const { src: srcc } = tdata.image;

          src = srcc;

          template = name;

        }

        setData({
          src,

          title: mDx.title,

          desc: mDx.desc,

          template,

          link: mDx.link,

          type: mDx.type,

          onetime,

          subscribers: sub,

          views,
        });

        setLoading(false);

      } else {
        router.push(`/user/${String(slug).toLowerCase()}`);
      }
    };

    if (isAuthenticated !== undefined && router.isReady) {
      if (!isAuthenticated) {
        router.push('/auth');
      } else {
        init();
      }
    }

  }, [isAuthenticated, slug, router.isReady, router]);

  return (
    <>
      <Head>
        <title>Settings | {slug} | Cryptea</title>
      </Head>

      <div className="h-full transition-all delay-500 dash w-full bg-[#fff] flex">
        <Sidebar page={"link"} />


        <div
          className={`body pb-6 transition-all delay-500 ${sidebar?.openPage ? "pl-[257px]" : "pl-[87px]"
            } w-full h-full pr-[10px] 2sm:!pl-[87px]`}
        >
          <div className="mb-6">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: "1pc auto",
                backgroundColor: "#f57059",
              }}
              className="text-[50px] font-bold"
              variant="circular"
              src={data.src}
            >
              {(
                String(slug).charAt(0) + String(slug).charAt(1)
              ).toUpperCase()}
            </Avatar>
            <h1
              style={{
                maxWidth: !sidebar?.openPage ? "1031px" : "861px",
              }}
              className="text-[rgb(32,33,36)] mb-[16px] font-[400] flex items-center justify-between relative mx-auto text-center"
            >
              <Link href="/dashboard/links">
                <a>
                  <IconButton
                    size="large"
                    className="cursor-pointer flex items-center justify-center"
                  >
                    <MdArrowBackIos
                      color={"rgb(32,33,36)"}
                      className="relative left-[4px]"
                      size={20}
                    />
                  </IconButton>
                </a>
              </Link>

              <Link href={`/user/${slug}`}>
                <a className="cursor-pointer text-[1.95rem] leading-[2.45rem] mx-auto flex items-center">
                  <span className="mr-2">
                    {data.title !== undefined ? data.title : slug}
                  </span>

                  <MdLink className="relative top-[2px]" size={30} />
                </a>
              </Link>

              <IconButton
                onClick={() => toggleSocial(!social)}
                size="large"
                className="cursor-pointer flex items-center justify-center"
              >
                <FiShare2 color={"rgb(32,33,36)"} size={22} />
              </IconButton>
            </h1>

            <p
              style={{
                maxWidth: !sidebar?.openPage ? "1031px" : "861px",
              }}
              className="text-[0.915rem] text-[rgb(95,99,104)] truncate leading-[1.25rem] text-center mx-auto block"
            >
              {data.desc}
            </p>
          </div>

          <div
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(410px, 1fr))",
              maxWidth: !sidebar?.openPage ? "1031px" : "861px",
            }}
            className="m-auto transition-all delay-500 grid gap-6 grid-flow-dense"
          >
            <div className="col-span-full border-[rgb(218,220,224)] rounded-[8px] border bg-white overflow-hidden border-solid">
              <div className="px-6 pt-6 relative pb-3">
                <div className="w-full md:grid md:grid-cols-2 4sm:grid 4sm:grid-cols-2 gap-4 px-5">

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-4 text-[#000]">
                      <p>Link Slug</p>
                    </div>
                    <div className="mt-2">
                      <div className="rounded-md">
                        <div className="flex">
                          <TextField
                            className="bg-[white]"
                            label={"Link Slug"}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#f57059",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: `#f57059 !important`,
                              },
                            }}
                            fullWidth
                            placeholder="Link"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-4 text-[#000]">
                      <p>Amount (in USD)</p>
                    </div>
                    <div className="mt-2">
                      <div className="rounded-md">
                        <div className="flex">
                          <TextField
                            className="bg-[white]"
                            label={"Amount (in USD)"}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#f57059",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: `#f57059 !important`,
                              },
                            }}
                            fullWidth
                            placeholder="Amount"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-4 text-[#000]">
                      <p>Link Slug</p>
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
                            fullWidth
                            placeholder="Link-Slug"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="w-full px-5">

                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-4 text-[#000]">
                      <p>Description</p>
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
                            fullWidth
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="w-full md:grid md:grid-cols-2 4sm:grid 4sm:grid-cols-2 gap-4 px-5">
                  <div className="w-full">
                    <div className="font-semibold mt-4 mb-4 text-[#000]">
                      <p>Redirect URL</p>
                    </div>
                    <div className="mt-2">
                      <div className="rounded-md">
                        <div className="flex">
                          <TextField
                            className="bg-[white]"
                            label={"Redirect URL"}
                            sx={{
                              "& .Mui-focused.MuiFormLabel-root": {
                                color: "#f57059",
                              },
                              "& .Mui-focused .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: `#f57059 !important`,
                              },
                            }}
                            fullWidth
                            placeholder="https://cryptea.me"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </>

  );
}

export default Settings;