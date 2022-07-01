import empty from "../../../../public/images/coming-soon.svg";
import Image from "next/image";

const DashPages = () => {

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
        <Image
          src={empty}
          className="mb-3"
          width={300}
          alt="Would Be Released soon"
        />

        <h2 className="mt-2 text-[22px] font-bold">
          This Feature would be released soon, we are working on it
        </h2>
      </div>
    </div>
  );
};

export default DashPages;
