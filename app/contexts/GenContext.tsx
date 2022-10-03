
import { createContext, useState } from 'react';

interface ChartParam {
  amount?: number | string;
  date?: string;
  hide?: boolean;
}

export interface Chartx extends ChartParam {
    update?: (opt: ChartParam) => any
}

export interface dash {
    sidebar: {
    open?: boolean, 
    toggle?: () => void,
    openDelay?: boolean,
    openPage?: boolean 
  },
  template: {
    isLoading?: boolean,
    toggle?: (e: boolean) => void
  },
  chartData: Chartx,
  logout: {
      active?: boolean,
      update?: (e: boolean) => void
  }
}


export const DashContext = createContext<dash>({
  sidebar: {},
  logout: {}, 
  template: {},
  chartData: {}
})

export const GenProvider = ({children}: {children: JSX.Element }) => {

          const [isOpen, close] = useState(false);
          const [isOpen2, close2] = useState(false);
          const [isOpen3, close3] = useState(false);        

        const [tLoading, setTloading] = useState<boolean>(true);

        const [islogout, setIsLogout] = useState<boolean>(false);

        const [chartx, updChart] = useState<ChartParam>({
          amount: 0,
          date: '',
          hide: true
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


        return (
          <DashContext.Provider
            value={{
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