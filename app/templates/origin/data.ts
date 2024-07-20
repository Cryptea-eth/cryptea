import pattern from "../../../public/images/pattern.png";

let data: {
  [index: string]: any;
} = {
  colorScheme: "#8036de",
  hoverColorScheme: "#4a168e",
  boardScheme: "#ffebcd",
  boardScheme0: "#dfcdb3",
  lightColorScheme1: "#8036de23",
  errorColor: "#ff8f33",
  white: "#fff",
};

data = {
  board0: {
    height: "150px",
    position: "relative",
    marginBottom: "25px",
    display: "block",
    backgroundColor: data.boardScheme0,
  },
  board: {
    backgroundSize: 90,
    backgroundBlendMode: "multiply",
    backgroundRepeat: "repeat",
    display: "block",
    backgroundColor: data.boardScheme,
    height: "135px",
    backgroundImage: `url(${pattern.src})`,
  },
  linkImage: {
    borderColor: data.colorScheme,
    borderStyle: "solid",
    left: 0,
    right: 0,
    display: "block",
    borderRadius: "50%",
    bottom: "-40px",
    borderWidth: "4px",
  },
  image: {
    src: "",
    text: "",
    style: {
      bgcolor: data.colorScheme,
      width: 140,
      height: 140,
    }
  },
  header: {
    text: "",
    style: {
      fontSize: 36,
      display: "block",
      backgroundColor: "#ffffff0",
      lineHeight: "40px",
      textAlign: "",
      fontWeight: 600,
      color: "#363636",
    },
  },
  introText: {
    text: "",
    style: {
      color: "rgb(131, 131, 131)",
      fontSize: 18,
      lineHeight: "28px",
      textAlign: "left",
      display: "block",
      backgroundColor: "#ffffff0",
    },
  },
  workState: {
    style: {
    backgroundColor:
      data.colorScheme.length > 7
        ? data.colorScheme.substring(0, 7) + "23"
        : data.colorScheme + "23",
    color: data.colorScheme,
    borderRadius: "9999px",
    display: "block",
    fontWeight: "bold",
    padding: "16px",
    textAlign: "left",
    },
    text: "",
  },
  error: {
    backgroundColor: data.errorColor,
    color: data.white,
  },
  socials: {
    facebook: {
      link: "",
      hidden: false,
    },
    twitter: {
      link: "",
      hidden: false,
    },
    instagram: {
      link: "",
      hidden: false,
    },
    linkedin: {
      link: "",
      hidden: false,
    },
    backgroundColor: data.colorScheme,
  },
  ...data,
};

export const getData = async (linkData: object) => {
  data = { ...data, ...linkData };
};

const rules: { [index: string]: any } = {
  body: {
    colorScheme: (color?: string) => {
      if (color !== undefined) {
        data.colorScheme = color;
        data.linkImage = { ...data.linkImage, borderColor: color };
        data.image = { ...data.image, bgcolor: color };

        data.workState = {
          ...data.workState,
          style: {
            ...data.workState.style,
            backgroundColor:
              color.length > 7 ? color.substring(0, 7) + "23" : color + "23",
            color,
          },
        };
      } else {
        return data.colorScheme;
      }
    },
  },
  board: {
    imgChange: (newD?: {
      borderColor: string;
      size: number;
      display?: boolean;
      text?: string;
      src?: string;
    }) => {
      if (newD !== undefined) {
        data.linkImage = {
          ...data.linkImage,
          borderColor: newD.borderColor,
          display: newD?.display ? "block" : "none",
        };
        data.image = {
          ...data.image,
          style: {
             ...data.image.style,
             width: newD.size,
             height: newD.size,
          },
          text: newD?.text,
          src: newD?.src,
        };
      } else {
        return {
          ...data.image.style,
          text: data.image.text,
          src: data.image.src,
          ...data.linkImage,
        };
      }
    },
    bgBColorChange: (layer: number, newd?: {}) => {
      if (newd !== undefined) {
        if (layer) {
          data.board = { ...data.board, ...newd };
        } else {
          data.board0 = { ...data.board0, ...newd };
        }
      } else {
        return layer ? data.board.backgroundColor : data.board0.backgroundColor;
      }
    },
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.board0 = { ...data.board0, display: val ? "block" : "none" };
      } else {
        return data.board0.display;
      }
    },
    height: (val?: number) => {
      if (val !== undefined) {
        data.board0 = { ...data.board0, height: `${val}px` };
        data.board = { ...data.board, height: `${val - 15}px` };
      } else {
        return data.board0.height.substring(0, data.board0.height.length - 2);
      }
    },
  },
  header: {
    textChange: (text?: string) => {
      if (text !== undefined) {
        data.header = { ...data.header, text };
      } else {
        return data.header.text.length
          ? data.header.text
          : document.querySelector(".header_page")?.textContent;
      }
    },
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.header = { ...data.header, style: { ...data.header.style, display: val ? "block" : "none" }};
      } else {
        return data.header.style.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = { ...data.header, style: { ...data.header.style, color: col } };
      } else {
        return data.header.style.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = { ...data.header, style:{ ...data.header.style, backgroundColor: col } };
      } else {
        return data.header.style.backgroundColor;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.header = { ...data.header, style: { ...data.header.style, textAlign } };
      } else {
        return data.header.style.textAlign;
      }
    },
  },
  introtext: {
    textChange: (text?: string) => {
      if (text !== undefined) {
        data.introText = { ...data.introText, text };
      } else {
        return data.introText.text.length
          ? data.introText.text
          : document.querySelector(".intro_text_page")?.textContent;
      }
    },
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.introText = {
          ...data.introText,
          style: { ...data.introText.style, display: val ? "block" : "none" },
        };
      } else {
        return data.introText.style.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.introText = { ...data.introText,
          style: { ...data.introText.style, color: col } };
      } else {
        return data.introText.style.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.introText = { ...data.introText,
          style: { ...data.introText.style, backgroundColor: col } };
      } else {
        return data.introText.style.backgroundColor;
      }
    },
    spacing: true,
    textAdd: true,
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.introText = { ...data.introText,
          style: { ...data.introText.style,
          textAlign }
        };
      } else {
        return data.introText.style.textAlign;
      }
    },
  },
  socials: {
    socialAdd: (umb?: {}) => {
      if (umb !== undefined) {
        data.socials = { ...data.socials, ...umb };
      } else {
        return data.socials;
      }
    },
    socialImg: true,
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.socials = { ...data.socials,
           backgroundColor: col };
      } else {
        return data.socials.backgroundColor;
      }
    },
  },
  purpose_statement: {
    textChange: (text?: string) => {
      if (text !== undefined) {
        data.workState = { ...data.workState, text };
      } else {
        return data.workState.text.length
          ? data.workState.text
          : document.querySelector(".work_state_page")?.textContent;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.workState = { ...data.workState, textAlign };
      } else {
        return data.workState.textAlign;
      }
    },
    hide: (val: boolean) => {
      if (val !== undefined) {
        data.workState = { ...data.workState, display: val ? "block" : "none" };
      } else {
        return data.workState.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.workState = { ...data.workState, color: col };
      } else {
        return data.workState.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.workState = { ...data.workState, backgroundColor: col };
      } else {
        return data.workState.backgroundColor;
      }
    },
    spacing: true,
  },
  change_template: {},
};

export { data, rules };
