import React, { createContext, useState } from 'react'

export const HomeContext = createContext<String | Boolean>(''); 

export const HomeContextSet = createContext<any>(() => {

});

export const HomeProvider = ({ children }: { children: JSX.Element }) => {

    const [showModal, setShowModal] = useState(false);

    const setShowMod = () => setShowModal(!showModal)

    return (
        <HomeContext.Provider value={showModal}>
            <HomeContextSet.Provider value={setShowMod}>
                {children} 
            </HomeContextSet.Provider>
        </HomeContext.Provider>
    )

}
