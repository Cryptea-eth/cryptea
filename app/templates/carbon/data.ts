let data: { [index: string]: any } = {
  colorScheme: "#696969",
  errorColor: "#ff8f33",
};

data = {
  body: {
    backgroundColor: "#d9d9d9",
  },
  error: {
    backgroundColor: data.errorColor,
    color: "#fff",
  },
  box: {
    background: "#f8f8f8",
    maxWidth: "360px",
    width: "360px",
  },
  header: {
    text: "",
    style: {
      fontSize: "19px",
      color: "#353535",
      textAlign: "center",
      fontWeight: "bold",
    },
  },
  image: {
    src: "",
    text: "",
    style: {
      top: "-50px",
      borderRadius: "50%",
      background: "#f8f8f8",
      height: "100px",
      lineHeight: "85px",
      right: "-100px",
      width: "100px",
      display: "flex",
      transform: "translateX(-50%)",
      "&::before": {
        background: data.colorScheme,
        height: "90px",
        width: "90px",
        borderRadius: "50%",
      },
    },
  },
  ...data,
};

const rules: { [index: string]: any } = {
  body: {
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.body = {
          ...data.body,
          backgroundColor: col,
        };
      } else {
        return data.body.backgroundColor;
      }
    },
    colorScheme: (color?: string) => {
      if (color !== undefined) {
        data.colorScheme = color;
        
        data.image = {
          ...data.image,
          "&::before": {
            ...data.image["&::before"],
            backgroundColor: color,
          },
        };
      } else {
        return data.colorScheme;
      }
    },
  },
  image: {
    imgChange: (newD?: {
      borderColor: string;
      size: number;
      display?: boolean;
      text?: string;
      src?: string;
    }) => {
      if (newD !== undefined) {

        data.box = {
          ...data.box,
          paddingTop: (newD.size - 30)+'px'
        }

        data.image = {
          ...data.image,
          background: newD.borderColor,
          display: newD?.display ? "flex" : "none",
          width: newD.size+'px',
          height: newD.size+'px',
          right: '-'+newD.size+'px',
          "&::before": {
            ...data.image["&::before"],
            height: (newD.size - 10)+'px',
            width: (newD.size - 10)+'px',
          },
          text: newD?.text,
          src: newD?.src,
        };
      } else {

        return {
          ...data.image.style,
          width: data.image.style.width.substring(
            0,
            data.image.style.width.length - 2
          ),
          borderColor: data.image.style.background,
        };
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.image = {
          ...data.image,
          "&::before": { ...data.image["&::before"], backgroundColor: col },
        };
      } else {
        return data.image["&::before"].backgroundColor;
      }
    },
  },
  header: {
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.header = { ...data.header, style: { ...data.header.style, display: val ? "block" : "none"} };
      } else {
        return data.header.style.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = { ...data.header, style: { ...data.header.style, color: col }};
      } else {
        return data.header.style.color;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.header = { ...data.header, style:{...data.header.style, textAlign } };
      } else {
        return data.header.style.textAlign;
      }
    },
    textChange: (text?: string) => {
      if (text !== undefined) {
        data.header = { ...data.header, text };
      } else {
        return data.header.text.length
          ? data.header.text
          : document.querySelector("h2.header")?.textContent;
      }
    },
  },
  change_template: {},
};

const getData = async (linkData: object) => {
  data = { ...data, ...linkData };
};

export { data, rules, getData };