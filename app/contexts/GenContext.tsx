import { createContext, useState } from "react";

interface ChartParam {
  amount?: number | string;
  date?: string;
  hide?: boolean;
}

type AmountType = "variable" | "range" | "fixed";
type LinkType = "onetime" | "sub";

interface LinkBase {
  desc?: string;
  title?: string;
  slug?: string;
  redirect?: string;
}

interface LinkMain extends LinkBase {
  amount?: string | number;
  amountType?: AmountType;
}

interface LinkError extends LinkBase {
  amount?: string;
  type?: string;
  amountType?: string;
  [index:string]: any
}

interface LinkErrors extends LinkError {
  update?: (e: object) => any;
  refresh?: () => void
}

export type Link = {
  type: LinkType;
  update?: (typx: object) => any;
  errors?: LinkErrors;
  [index: string]: any;
} & LinkMain;

export interface Chartx extends ChartParam {
  update?: (opt: ChartParam) => any;
}

export interface dash {
  sidebar: {
    open?: boolean;
    toggle?: () => void;
    openDelay?: boolean;
    openPage?: boolean;
  };
  template: {
    isLoading?: boolean;
    toggle?: (e: boolean) => void;
  };
  chartData: Chartx;
  newLink: Link;
  logout: {
    active?: boolean;
    update?: (e: boolean) => void;
  };
}

export const DashContext = createContext<dash>({
  sidebar: {},
  logout: {},
  template: {},
  chartData: {},
  newLink: {
    type: "onetime",
    errors: {},
  },
});

export const GenProvider = ({ children }: { children: JSX.Element }) => {

  const [isOpen, close] = useState(true);
  const [isOpen2, close2] = useState(true);
  const [isOpen3, close3] = useState(true);

  const [tLoading, setTloading] = useState<boolean>(true);

  const [islogout, setIsLogout] = useState<boolean>(false);

  const [chartx, updChart] = useState<ChartParam>({
    amount: 0,
    date: "",
    hide: true,
  });

  const toggle = () => {
    close(!isOpen);

    setTimeout(() => {
      close2(!isOpen2);
    }, 10);

    setTimeout(() => {
      close3(!isOpen3);
    }, 900);
  };

  const [linkData, setLinkData] = useState<Link>({
    desc: "",
    title: "",
    slug: "",
    type: "onetime",
    redirect: "",
    amount: "",
    amountType: "variable",
  });

  const OriginalError:LinkError  = {
    desc: "",
    title: "",
    slug: "",
    type: "",
    redirect: "",
    amount: "",
    amountType: "",
  }

  const [errorData, setErrorData] = useState<LinkError>({ ...OriginalError });

  return (
    <DashContext.Provider
      value={{
        newLink: {
          ...linkData,
          errors: {
            ...errorData,
            refresh: () => setErrorData({ ...OriginalError }),
            update: (typx: object) => setErrorData({ ...errorData, ...typx }),
          },
          update: (typx: object) => {
            setLinkData({ ...linkData, ...typx });
            const err: {[index: string]: string} = {};

            Object.keys(typx).forEach(e => {
                err[e] = '';
            });

            setErrorData({ ...errorData, ...err});
          },
        },
        sidebar: {
          toggle,
          open: isOpen,
          openDelay: isOpen3,
          openPage: isOpen2,
        },
        logout: {
          active: islogout,
          update: (e: boolean) => setIsLogout(e),
        },
        template: {
          isLoading: tLoading,
          toggle: (e: boolean) => setTloading(e),
        },
        chartData: {
          amount: chartx.amount,
          date: chartx.date,
          hide: chartx.hide,
          update: (opt: ChartParam) => updChart(opt),
        },
      }}
    >
      {children}
    </DashContext.Provider>
  );
};
