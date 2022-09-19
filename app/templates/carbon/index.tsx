import React from "react";
import { FormControl, InputLabel, NativeSelect, TextField, Box, Tab, Tabs, Typography } from "@mui/material";

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


const Carbon = () => {
  const [tab, setTab] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="w-screen h-screen bg-blue-500 flex justify-center">
      <div className="rounded-lg w-[350px] absolute py-8 px-4 bg-slate-100 flex flex-col justify-center">
        <div>
          <div className="w-full flex justify-center">
            <h1 className="text-2xl font-bold my-4">Make Payment</h1>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChange} aria-label="Make Payment">
              <Tab label="Onetime" {...a11yProps(0)} />
              <Tab label="Subscription" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <div>
              Payment details
            </div>
            <div className="mt-3 text-lg">
              <div className="font-semibold">Amount (USD)</div>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Amount
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                >
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </NativeSelect>
              </FormControl>
            </div>
            <div className="my-4">
              <div className="font-semibold">Or input amount manually</div>
              <TextField
                fullWidth id="outlined-basic" label="Amount" variant="outlined" />
            </div>
            <div>
              <button className="bg-[#f57059] text-white rounded-lg py-2 px-4 mt-4 w-full font-bold text-lg">Pay</button>
            </div>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <div>
              <div className="mt-3 text-lg">
                <div className="font-semibold">Subscription Frequency</div>
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Choose Payment period
                  </InputLabel>
                  <NativeSelect
                    defaultValue={3}
                    inputProps={{
                      name: 'age',
                      id: 'uncontrolled-native',
                    }}
                  >
                    <option value={1}>Daily</option>
                    <option value={2}>Weekly</option>
                    <option value={3}>Monthly</option>
                    <option value={4}>Yearly</option>
                  </NativeSelect>
                </FormControl>
              </div>
            </div>
            <div className="my-4">
              <div className="font-semibold">Email</div>
              <TextField
                fullWidth id="outlined-basic" label="Your Email" variant="outlined" />
            </div>

            <div className="mt-3 text-lg">
              <div className="font-semibold">Amount (USD)</div>
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Amount
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                >
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </NativeSelect>
              </FormControl>
            </div>
            <div className="my-4">
              <div className="font-semibold">Or input amount manually</div>
              <TextField
                fullWidth id="outlined-basic" label="Amount" variant="outlined" />
            </div>
            <div>
              <button className="bg-[#f57059] text-white rounded-lg py-2 px-4 mt-4 w-full font-bold text-lg">Subscribe</button>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  )
}

export default Carbon;