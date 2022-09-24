import React, { createContext, useState } from 'react'

export const HomeContext = createContext<{
  show?: boolean;
  open?: () => any;
  close?: () => any;
}>({}); 

export const HomeProvider = ({ children }: { children: JSX.Element }) => {

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
