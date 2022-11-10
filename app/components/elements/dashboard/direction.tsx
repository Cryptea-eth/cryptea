import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const Direction = ({
  direction,
  value,
  style
}: {
  direction: "up" | "down";
  value: number;
  style?: object;
}) => {
  const def = direction == "up";

  return (
    <div
      style={{
        backgroundColor: def ? "#16c784" : "#ea3943",
        ...style,
      }}
      className="flex whitespace-nowrap w-fit text-white items-center font-bold p-[5px] pl-0 rounded-[8px] text-[14px]"
    >
      {def ? (
        <RiArrowDropUpLine className="relative left-[2px]" size={20} />
      ) : (
        <RiArrowDropDownLine className="relative left-[2px]" size={20} />
      )}{" "}
      <span className="block">{value.toFixed(2) + "%"}</span>
    </div>
  );
};

export default Direction;
