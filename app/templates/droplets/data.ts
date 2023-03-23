import pattern from "../../../public/images/pattern.png";

let data: {
  [index: string]: any;
} = {
  colorScheme: "#3cb4ac",
  errorColor: "#ff8f33",
  white: "#fff",
};

data = {
  board: {
    backgroundSize: 90,
    backgroundBlendMode: "multiply",
    backgroundRepeat: "repeat",
    backgroundColor: `#3cb4ac59`,
    height: 400,
    backgroundImage: `url(${pattern.src})`,
  },

  board0: {
    marginTop: 292.8,
  },

  linkImage: {
    display: "flex",
    width: 66,
    height: 66,
    borderColor: "#3cb4ac",
  },

  image: {
    src: "",
    text: "",
    style: {
      width: 56,
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: "#3cb4ac",
      height: 56,
      color: data.white,
    },
  },

  header: {
    text: "",
    style: {
      fontSize: 36,
      color: "#363636",
      textAlign: "left",
      display: "block",
    },
  },

  introText: {
    text: "",
    style: {
      textAlign: "left",
      display: "block",
      color: "rgb(131, 131, 131)",
      fontSize: 16,
    },
  },

  error: {
    backgroundColor: data.errorColor,
    color: data.white,
  },

  about: {
    texts: [],
    style: {
      color: "#9b9b9b",
      fontWeight: 400,
      fontSize: 15,
    },
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

    backgroundColor: "#3cb4ac",
  },
  config: {
    // total to be raised
    total: 1000,
    
    // total number of backers
    backers: 0,

    // total number of days
    expire: new Date().getTime() + (1000 * 60 * 60 * 24),

    // amount raised
    raised: 0,

    start: new Date().getTime(),

    // image
    image: `url(${pattern.src})`,
  },
  ...data,
};

const getData = async (linkData: object) => {
  data = { ...data, ...linkData };
};

const rules: { [index: string]: any } = {
  body: {
    colorScheme: (color?: string) => {
      if (color !== undefined) {
        data.colorScheme = color;
        data.linkImage = { ...data.linkImage, borderColor: color };

        data.image = {
          ...data.image,
          style: { ...data.image.style, bgcolor: color },
        };

        data.socials = {
          ...data.socials,
          backgroundColor: color,
        };

        data.board = {
          ...data.board,
          backgroundColor: `${color}59`,
        };
      } else {
        return data.colorScheme;
      }
    },
  },

  crowdfund: {
    update: (newD?: { amount: any; date: any }) => {
      if (newD !== undefined) {
        data.config = { ...data.config, ...newD };
      } else {
        return { amount: data.config.raised, date: data.config.time };
      }
    },
  },

  about_project: {
    textChangeMul: (mainD?: { texts: any[] }) => {
      if (mainD !== undefined) {
        data.about = { ...data.about, texts: mainD.texts };
      } else {
        return data.about.texts;
      }
    },
  },

  board: {
    imgMainChange: (mainD?: { src?: string; display?: boolean }) => {
      if (mainD !== undefined) {
        if (mainD.src !== undefined) {
          data.board = {
            ...data.board,
            backgroundImage: mainD.src,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundColor: "transparent",
          };
        }

        if (mainD.display !== undefined) {
          data.board = {
            ...data.board,
            backgroundImage: "none",
            backgroundColor: `${data.colorScheme}59`,
          };
        }
      } else {
        return {
          src: data.board.backgroundImage,
          display: data.board.backgroundImage != "none" ? true : false,
        };
      }
    },
    bgOBColorChange: (newd?: {}) => {
      if (newd !== undefined) {
        data.board = { ...data.board, ...newd };
      } else {
        return data.board.backgroundColor;
      }
    },

    height: (val?: number) => {
      if (val !== undefined) {
        data.board = { ...data.board, height: val };

        data.board0 = { marginTop: val - 107.2 };
      } else {
        return String(data.board.height);
      }
    },
  },

//   image: {
//     imgChange: (newD?: {
//       borderColor: string;
//       size: number;
//       text?: string;
//       src?: string;
//     }) => {
//       if (newD !== undefined) {

//         data.linkImage = {
//           ...data.linkImage,
//           width: newD.size,
//           height: newD.size,
//           borderColor: newD.borderColor,
//         };

//         data.image = {
//           ...data.image,
//           style: {
//             ...data.image.style,
//             bgcolor: newD.borderColor,
//             height: newD.size - 10,
//             width: newD.size - 10,
//           },
//           text: newD?.text,
//           src: newD?.src,
//         };
//       } else {
//         return {
//           ...data.image.style,
//           src: data.image?.src || "",
//           text: data.image.text,
//           width: String(data.image.style.width),
//           borderColor: data.image.style.bgcolor,
//         };
//       }
//     },
//     BgColorChange: (col?: string) => {
//       if (col !== undefined) {
       

//         data.image = {
//           ...data.image,
//           style: {
//             backgroundColor: col
//           },
//         };

//         data.linkImage = {
//             ...data.linkImage,
//             borderColor: col
//         }

//       } else {
//         return data.image.style.backgroundColor;
//       }
//     },
//   },

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
        data.header = {
          ...data.header,
          style: { ...data.header.style, display: val ? "block" : "none" },
        };
      } else {
        return data.header.style.display;
      }
    },
    colorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = {
          ...data.header,
          style: { ...data.header.style, color: col },
        };
      } else {
        return data.header.style.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.header = {
          ...data.header,
          style: { ...data.header.style, backgroundColor: col },
        };
      } else {
        return data.header.style.backgroundColor;
      }
    },
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.header = {
          ...data.header,
          style: { ...data.header.style, textAlign },
        };
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
        data.introText = {
          ...data.introText,
          style: { ...data.introText.style, color: col },
        };
      } else {
        return data.introText.style.color;
      }
    },
    BgColorChange: (col?: string) => {
      if (col !== undefined) {
        data.introText = {
          ...data.introText,
          style: { ...data.introText.style, backgroundColor: col },
        };
      } else {
        return data.introText.style.backgroundColor;
      }
    },
    spacing: true,
    textAdd: true,
    sortAlignment: (textAlign?: string) => {
      if (textAlign !== undefined) {
        data.introText = {
          ...data.introText,
          style: { ...data.introText.style, textAlign },
        };
      } else {
        return data.introText.style.textAlign;
      }
    },
  },
  //   socials: {
  //     socialAdd: (umb?: {}) => {
  //       if (umb !== undefined) {
  //         data.socials = { ...data.socials, ...umb };
  //       } else {
  //         return data.socials;
  //       }
  //     },
  //     socialImg: true,
  //     BgColorChange: (col?: string) => {
  //       if (col !== undefined) {
  //         data.socials = { ...data.socials, backgroundColor: col };
  //       } else {
  //         return data.socials.backgroundColor;
  //       }
  //     },
  //   },

  change_template: {},
};

export { data, rules, getData };
