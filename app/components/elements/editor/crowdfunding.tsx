import {
  Modal,
  Box,
  Button,
  IconButton,
  Tooltip,
  TextField,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose, MdInfo } from "react-icons/md";
import http from "../../../../utils/http";

const Crowd = ({
  setCrowdModal,
  crowdModal,
  update,
  rules,
  save,
}: {
  update: React.Dispatch<React.SetStateAction<any>>;
  crowdModal: boolean;
  setCrowdModal: React.Dispatch<React.SetStateAction<boolean>>;
  rules: any;
  save: () => Promise<any>;
}) => {
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

  const [amount, setAmount] = useState<string>("");

  const [isLoading, setLoading] = useState<boolean>(false);

  const [genError, setGenError] = useState<string>("");

  const [date, setDate] = useState<string>("");

  const closeModal = () => setCrowdModal(false);

  const data = rules.crowdfund.update();

  const submit = async () => {
    setLoading(true);

    if (!Number(amount)) {
      setGenError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!Number(date)) {
      setGenError("Please enter a valid date");
      setLoading(false);
      return;
    }

    const {
      data: { date: date2, expire },
    } = await http.get("/api/droplets/init", {
        params: {
            time: date,
        },
        baseURL: window.origin,
    });

    const xx = {
      total: Number(amount),
      expire,
      start: date2,
    };

    update(xx);

    rules.crowdfund.update(xx);

    await save();

    closeModal();

  };

  return (
    <Modal
      open={crowdModal}
      sx={{
        "&& .MuiBackdrop-root": {
          backdropFilter: "blur(5px)",
        },
      }}
      onClose={closeModal}
      className="overflow-y-scroll overflow-x-hidden cusscroller flex justify-center"
      aria-labelledby="Configure Crowd"
      aria-describedby="Configure template crowd template functions"
    >
      <Box
        className="sm:w-full h-fit 3mdd:px-[2px]"
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
              <h2 className="font-[500] text-[rgb(32,33,36)] text-[1.55rem]">
                Crowdfund
              </h2>
              <span className="text-[rgb(69,70,73)] font-[500] text-[14px]">
                Configure Crowd funding functions
              </span>
            </div>

            <IconButton size={"medium"} onClick={closeModal}>
              <MdClose
                size={20}
                color={"rgb(32,33,36)"}
                className="cursor-pointer"
              />
            </IconButton>
          </div>

          {Boolean(genError) && (
            <div className="bg-[#ff8f33] text-white rounded-md w-full font-bold mt-2 mx-auto p-3">
              {genError}
            </div>
          )}

          <div className="py-3">
            <Tooltip
              arrow
              title="Amount of money you want to raise for your project."
            >
              <label className="text-[#565656] w-fit flex items-center mb-2 font-[600]">
                Goal (USD)
                <MdInfo className={"ml-1 cursor-pointer"} size={18} />
              </label>
            </Tooltip>

            <TextField
              fullWidth
              id="outlined-basic"
              variant="standard"
              sx={text}
              value={amount}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                const val = e.target.value;
                setGenError("");

                setAmount(val.replace(/[^\d.]/g, ""));
              }}
            />
          </div>

          <div className="py-3">
            <Tooltip
              arrow
              title="Number of day in which the campaign is open after which, the campaign will be closed."
            >
              <label className="text-[#565656] w-fit flex items-center mb-2 font-[600]">
                Time (days)
                <MdInfo className={"ml-1 cursor-pointer"} size={18} />
              </label>
            </Tooltip>

            <TextField
              fullWidth
              id="outlined-basic"
              variant="standard"
              sx={text}
              value={date}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                const val = e.target.value;

                setGenError("");

                setDate(val.replace(/[^\d.]/g, ""));
              }}
            />
          </div>
        </div>

        <div className="bg-[#efefef] flex justify-center items-center rounded-b-[.9rem] px-6 py-4">
          <div className="flex items-center">
            {isLoading && (
              <Button className="!py-3 !font-bold !px-6 !normal-case !flex !items-center !text-white hover:!bg-[#8036de] !bg-[#8036de] !m-auto !rounded-lg">
                <CircularProgress
                  sx={{
                    color: "white",
                    maxWidth: 24,
                    maxHeight: 24,
                    marginRight: 1,
                  }}
                  thickness={4.5}
                  color="inherit"
                />{" "}
                Wait a Sec...
              </Button>
            )}

            {!isLoading && (
              <Button 
                onClick={submit}
                className="!py-3 !font-bold !px-6 !normal-case !flex !items-center !text-white hover:!bg-[#8036de] !bg-[#8036de] !m-auto !rounded-lg"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default Crowd;
