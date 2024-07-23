import { TextField, Button } from "@mui/material";
import validator from "validator";
import { useState } from "react";

const TextChangeMul = ({
  getRules,
  rules,
  update,
}: {
  rules: any;
  getRules: any;
  update: any;
}) => {
  const main =
    rules[Boolean(getRules.length) ? getRules : "body"].textChangeMul();

  const text = {
    "& .Mui-focused.MuiFormLabel-root": {
      color: "#bbbbbbc8",
    },
    "& .MuiInputBase-root": {
      borderRadius: "0px",
      padding: "3px",
    },
    "& .MuiInputBase-input": {
      padding: "3px",
      lineHeight: "17px",
      fontSize: "13px",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#bbbbbbc8 !important",
      borderWidth: "1px !important",
    },
  };

  return (
    <div className="mt-3 pl-1 w-full">
      <span className="text-[#979797] mr-[11px] font-bold text-[13px] mb-[4px] block">
        Texts
      </span>

      {main.map((a: string, index: number) => (
        <div key={index} className="mb-3">
          <span className="text-[#979797] font-[400] text-[13px] mb-[4px] block">
            Paragraph {index + 1}
          </span>
          <TextField
            type="text"
            defaultValue={a.length ? a : ""}
            onChange={(xx: any) => {
              const text = xx.target.value;

              const dataSent = main as any[];

              dataSent[index] = text;

              rules[Boolean(getRules.length) ? getRules : "body"].textChangeMul(
                { texts: dataSent }
              );

              update(xx.target.value);
            }}
            sx={text}
            placeholder="text..."
            fullWidth
            multiline
          />
        </div>
      ))}

      <div className="flex items-center justify-center w-full">
        <Button
          onClick={() => {
            main.push("");
            update(String(Math.random()));
          }}
          className="!cursor-pointer !transition-all !delay-300 !text-[12px] !normal-case !text-[#505050] !p-1 !rounded-[0px] hover:!bg-[rgba(157,157,157,0.07)]"
        >
          Add paragraph
        </Button>
      </div>
    </div>
  );
};

export default TextChangeMul;
