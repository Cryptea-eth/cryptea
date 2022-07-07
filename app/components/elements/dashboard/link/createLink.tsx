import {
  Box,
  TextField,
  LinearProgress,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { MdInfo, MdAddLink, MdInsertLink, MdPayment, MdPayments } from "react-icons/md";
import LogoSpace from "../../logo";
import { useState } from "react";

export const NewLink = () =>{
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
              <div>{children}</div>
            </Box>
          )}
        </div>
      );
    }

    function a11yProps(index: number) {
      return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
      };
    }

      const [value, setValue] = useState(0);

      const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };


        return (
          <div className="w-screen linkadd sm:px-2 px-10 flex justify-center items-center bg-pattern3 h-fit">
            <div className="w-full flex justify-center flex-col h-full backdrop-blur-[12px]">
              <LogoSpace
                style={{
                  marginBottom: 20,
                  marginTop: 20,
                }}
              />

              <h2 className="font-[900] text-[30px] mt-0 flex items-center mx-auto mb-5">
                <MdAddLink size={32} className="mr-1" /> Create A Link
              </h2>

              <div className="relative 2mmd:px-0 p-6 flex-auto">
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs"
                    >
                      <Tab
                        iconPosition="start"
                        icon={<MdPayment size={17} />}
                        label="One Time Payments"
                        {...a11yProps(0)}
                      />
                      <Tab
                        iconPosition="start"
                        icon={<MdPayments size={17} />}
                        label="Subscriptions"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <div className="mt-8 w-full overflow-hidden">
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                        <span className="uppercase font-semibold mr-3">
                          Link Details
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            These are your new link details
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="outlined-basic"
                            label="Title"
                            variant="standard"
                            name="title"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="amount"
                            label="Amount"
                            variant="standard"
                            name="amount"
                            type="number"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="description"
                            label="Description"
                            variant="standard"
                            name="description"
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 w-full overflow-hidden">
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                        <span className="uppercase font-semibold mr-3">
                          Link Slug
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            This is your new Link page:
                            {/* `https://cryptea.com/{$username}/{$link}` */}
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 p-10">
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
                            variant="standard"
                            name="link"
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <div className="mt-8 w-full overflow-hidden">
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                        <span className="uppercase font-semibold mr-3">
                          Subscription Details
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            These are your new subscription details
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="outlined-basic"
                            label="Title"
                            variant="standard"
                            name="title"
                            fullWidth
                          />
                        </div>
                      </div>
                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="amount"
                            label="Amount"
                            variant="standard"
                            name="amount"
                            type="number"
                            fullWidth
                          />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 px-10 py-5">
                        <div className="flex items-center ssm:flex-wrap">
                          <TextField
                            id="description"
                            label="Description"
                            variant="standard"
                            name="description"
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 w-full overflow-hidden">
                      <div className="flex flex-wrap items-center px-7 justify-between py-4 bg-[#121212] text-white">
                        <span className="uppercase font-semibold mr-3">
                          Link Slug
                        </span>
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">
                            This is your new Link page:
                            {/* `https://cryptea.com/{$username}/{$link}` */}
                          </span>
                          <MdInfo size={20} color="#fff" />
                        </div>
                      </div>

                      <div className="w-full sm:px-2 p-10">
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
                            variant="standard"
                            name="link"
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </Box>

                <Button className="py-3 font-bold px-6 !capitalize flex items-center text-white bg-[#121212] transition-all delay-500 hover:bg-[#000] m-auto rounded-lg">
                  <MdInsertLink size={25} className="mr-1" /> Create Link
                </Button>
              </div>
            </div>
          </div>
        );
}

