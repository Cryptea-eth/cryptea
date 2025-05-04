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
          <svg
            style={{ width: "20px", height: "20px", position: "relative", left: "2px" }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        ) : (
          <svg
            style={{ width: "20px", height: "20px", position: "relative", left: "2px" }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        )}{" "}
        <span className="block">{value.toFixed(2) + "%"}</span>
      </div>
    </Tooltip>
  );
};

export default Direction;