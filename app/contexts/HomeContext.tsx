import React, { createContext, useState } from 'react'
import { useCryptea } from './Cryptea';

export const HomeContext = createContext<{
  show?: boolean;
  open?: () => any;
  close?: () => any;
}>({}); 

export const HomeProvider = ({ children }: { children: React.ReactElement }) => {


    const [showModal, setShowModal] = useState(false);

    return (
        <HomeContext.Provider value={{
            show: showModal,
            open: () => setShowModal(true),
            close: () => setShowModal(false)
        }}>
                {children} 
        </HomeContext.Provider>
    )

}
