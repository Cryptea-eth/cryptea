import pattern from "../../../public/images/pattern.png";

let udata: {[index: string]: any} = {

};


let data: {
  [index: string]: any;
} = {
  colorScheme: "#f57059",
  hoverColorScheme: "#ff320e",
  boardScheme: "#ffebcd",
  boardScheme0: "#dfcdb3",
  lightColorScheme1: "#f5705923",
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
    bgcolor: data.colorScheme,
    width: 140,
    height: 140,
    src: '',
  },
  header: {
    fontSize: 36,
    display: "block",
    backgroundColor: "#ffffff0",
    lineHeight: "40px",
    textAlign: "",
    fontWeight: 600,
    color: "#363636",
    text: "",
  },
  introText: {
    color: "rgb(131, 131, 131)",
    fontSize: 18,
    lineHeight: "28px",
    text: "",
    textAlign: "left",
    display: "block",
    backgroundColor: "#ffffff0",
  },
  workState: {
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
  ...data
};

export const getData = async (linkData: object) => {
  
  data = {...data, ...linkData };

};


const rules: { [index: string]: any } = {
  body: {
    colorScheme: (color?: string) => {
      if (color !== undefined) {
        data.colorScheme = color;
        data.linkImage = { ...data.linkImage, borderColor: color };
        data.image = { ...data.image, bgcolor: color }
        data.workState = {
          ...data.workState,
          backgroundColor:
            color.length > 7
              ? color.substring(0, 7) + "23"
              : color + "23",
          color,
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
      src?: string
    }) => {
      if (newD !== undefined) {
        data.linkImage = {
          ...data.linkImage,
          borderColor: newD.borderColor,
          display: newD?.display ? "block" : "none"
        };
        data.image = {
          ...data.image,
          width: newD.size,
          height: newD.size,
          src: newD?.src
        };

      } else {
        return { ...data.image, ...data.linkImage };
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
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = { ...data.header, backgroundColor: col };
      } else {
        return data.header.backgroundColor;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.header = { ...data.header, textAlign };
      } else {
        return data.header.textAlign;
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
        data.introText = { ...data.introText, display: val ? "block" : "none" };
      } else {
        return data.introText.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.introText = { ...data.introText, color: col };
      } else {
        return data.introText.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.introText = { ...data.introText, backgroundColor: col };
      } else {
        return data.introText.backgroundColor;
      }
    },
    spacing: true,
    textAdd: true,
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.introText = { ...data.introText, textAlign };
      } else {
        return data.introText.textAlign;
      }
    },
  },
  socials: {
    socialAdd: (umb?: {}) => {
      console.log(umb)
      if (umb !== undefined) {
        data.socials = { ...data.socials, ...umb };
      } else {
        return data.socials;
      }
    },
    socialImg: true,
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.socials = { ...data.socials, backgroundColor: col };
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
};


export { data, rules };