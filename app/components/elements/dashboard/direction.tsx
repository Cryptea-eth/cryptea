import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { Tooltip } from "@mui/material";

const Direction = ({
  direction,
  value,
  style,
  tooltip,
}: {
  direction: "up" | "down";
  value: number;
  style?: object;
  tooltip?: string;
}) => {
  const def = direction == "up";

  return (
    <Tooltip placement="bottom" arrow title={tooltip || "%change"}>
      <div
        style={{
          backgroundColor: def ? "#16c784" : "#ea3943",
          ...style,
        }}
        className="flex whitespace-nowrap w-fit text-white items-center font-bold p-[5px] pl-0 rounded-[8px] cursor-default text-[14px]"
      >
        {def ? (
          <RiArrowDropUpLine className="relative left-[2px]" size={20} />
        ) : (
          <RiArrowDropDownLine className="relative left-[2px]" size={20} />
        )}{" "}
        <span className="block">{value.toFixed(2) + "%"}</span>
      </div>
    </Tooltip>
  );
};

export default Direction;
