let data: { [index: string]: any } = {
  colorScheme: "#2196f3",
  errorColor: "#ff8f33"
};

data = {
  body: {
    backgroundColor: data.colorScheme,
  },
  box: {
    background: "#f8f8f8",
    maxWidth: "360px",
    width: "360px",
  },
  header: {
    fontSize: "24px",
    color: "#353535",
    textAlign: "center",
    text: "",
    fontWeight: "bold",
  },
  avatar: {
    top: "-50px",
    borderRadius: "50%",
    background: "#f8f8f8",
    height: "100px",
    lineHeight: "85px",
    right: '-100px',
    width: "100px",
    display: 'flex',
    transform: "translateX(-50%)",
    src: '',
    text: '',
    "&::before": {
      background: data.colorScheme,
      height: "90px",
      width: "90px",
      borderRadius: "50%",
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
        data.body = {
          ...data.body,
          backgroundColor: color,
        };
        data.avatar = {
          ...data.avatar,
          "&::before": {
            ...data.avatar["&::before"],
            backgroundColor: color,
          },
        };
      } else {
        return data.colorScheme;
      }
    },
  },
  avatar: {
    imgChange: (newD?: {
      borderColor: string;
      size: number;
      display?: boolean;
      text?: string;
      src?: string;
    }) => {
      if (newD !== undefined) {
        data.avatar = {
          ...data.avatar,
          background: newD.borderColor,
          display: newD?.display ? "flex" : "none",
          width: newD.size+'px',
          height: newD.size+'px',
          right: '-'+newD.size+'px',
          "&::before": {
            ...data.avatar["&::before"],
            height: (newD.size - 10)+'px',
            width: (newD.size - 10)+'px',
          },
          text: newD?.text,
          src: newD?.src,
        };
      } else {

        return {
          ...data.avatar,
          width: data.avatar.width.substring(0, data.avatar.width.length - 2),
          borderColor: data.avatar.background
        };
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.avatar = {
          ...data.avatar,
          "&::before": { ...data.avatar["&::before"], backgroundColor: col },
        };
      } else {
        return data.avatar["&::before"].backgroundColor;
      }
    },
  },
  header: {
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.header = { ...data.header, display: val ? "block" : "none" };
      } else {
        return data.header.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = { ...data.header, color: col };
      } else {
        return data.header.color;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.header = { ...data.header, textAlign };
      } else {
        return data.header.textAlign;
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