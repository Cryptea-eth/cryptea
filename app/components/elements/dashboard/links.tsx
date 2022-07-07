import empty from "../../../../public/images/coming-soon.svg";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TextField, Tab, Typography, Box } from '@mui/material';
import { MdInfo } from 'react-icons/md';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DashLinks = () => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <div className="pt-[75px]">
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
        /></div>

        <div className="mt-2 text-[20px] font-semibold">
          You have no links yet
        </div>
        <button onClick={() => setShowLinkModal(true)}
          className="py-4 px-10 text-white bg-[#F57059] rounded-lg">New Link</button>
        {/* <Image
          src={empty}
          className="mb-3"
          style={{
            width: 300,
          }}
          alt="Would Be Released soon"
        />

        <h2 className="mt-2 text-[22px] font-bold">
          This Feature would be released soon, we are working on it
        </h2> */}
        {showLinkModal! ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-[#F57059] rounded-t">
                    <h3 className="text-2xl font-semibold text-black">Create New Link</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-4xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowLinkModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-4xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="One Time Payments" {...a11yProps(0)} />
                          <Tab label="Subscriptions" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        Create a New One Time Link
                        <div className="rounded-[5px] border-[#C2C7D6] mt-8 w-full border-2 border-solid overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#F57059] text-white">
                            <span className="uppercase font-semibold mr-3">Link Details</span>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm">
                                These are your new link details
                              </span>
                            </div>
                          </div>

                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="outlined-basic" label="Title" variant="outlined" name="title" fullWidth />
                            </div>
                          </div>
                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="amount" label="Amount" variant="outlined" name="amount" type="number" fullWidth />
                            </div>
                          </div>
                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="description" label="Description" variant="outlined" name="description" fullWidth />
                            </div>
                          </div>

                        </div>

                        <div className="rounded-[5px] border-[#C2C7D6] mt-8 w-full border-2 border-solid overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#F57059] text-white">
                            <span className="uppercase font-semibold mr-3">Link Slug</span>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm">
                                This is your new Link page:
                                {/* `https://cryptea.com/{$username}/{$link}` */}
                              </span>
                              <MdInfo size={20} color="#fff" />
                            </div>
                          </div>

                          <div className="w-full p-10">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField
                                label={"Enter Link Slug"}
                                placeholder="wagmi"
                                // value={userLink}
                                // onChange={(e) => {
                                //   const lk = e.target.value;
                                //   setUserLink(lk.replace(/[/\\.@#&?;:"'~,*^%|]/g, ""));
                                //   setError("");
                                // }}
                                name="link"
                                fullWidth
                              />
                            </div>
                          </div>
                        </div>

                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        Create a New Subscription
                        <div className="rounded-[5px] border-[#C2C7D6] mt-8 w-full border-2 border-solid overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#F57059] text-white">
                            <span className="uppercase font-semibold mr-3">Subscription Details</span>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm">
                                These are your new subscription details
                              </span>
                            </div>
                          </div>

                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="outlined-basic" label="Title" variant="outlined" name="title" fullWidth />
                            </div>
                          </div>
                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="amount" label="Amount" variant="outlined" name="amount" type="number" fullWidth />
                            </div>
                          </div>

                          <div className="w-full px-10 py-5">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField id="description" label="Description" variant="outlined" name="description" fullWidth />
                            </div>
                          </div>

                        </div>

                        <div className="rounded-[5px] border-[#C2C7D6] mt-8 w-full border-2 border-solid overflow-hidden">
                          <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#F57059] text-white">
                            <span className="uppercase font-semibold mr-3">Link Slug</span>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm">
                                This is your new Link page:
                                {/* `https://cryptea.com/{$username}/{$link}` */}
                              </span>
                              <MdInfo size={20} color="#fff" />
                            </div>
                          </div>

                          <div className="w-full p-10">
                            <div className="flex items-center ssm:flex-wrap">
                              <TextField
                                label={"Enter Subscription Link Slug"}
                                placeholder="wagmi"
                                // value={userLink}
                                // onChange={(e) => {
                                //   const lk = e.target.value;
                                //   setUserLink(lk.replace(/[/\\.@#&?;:"'~,*^%|]/g, ""));
                                //   setError("");
                                // }}
                                name="link"
                                fullWidth
                              />
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </Box>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowLinkModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DashLinks;
