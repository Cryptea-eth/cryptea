
import { createContext, useState } from 'react';

export interface dash {
    sidebar: {
    open?: boolean, 
    toggle?: () => void,
    openDelay?: boolean,
    openPage?: boolean 
  }
}


export const DashContext = createContext<dash>({
  sidebar: {}
})

export const GenProvider = ({children}: {children: JSX.Element }) => {

          const [isOpen, close] = useState(true);
          const [isOpen2, close2] = useState(true);
          const [isOpen3, close3] = useState(true);        

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
            <DashContext.Provider value={{
                sidebar: {
                    toggle,
                    open: isOpen,
                    openDelay: isOpen3,
                    openPage: isOpen2
                },
            }}>
                {children}
            </ DashContext.Provider>
        )
      };