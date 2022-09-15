import { createContext, useState } from "react";
import { CrypteaAuth } from "./Auth";


export const Cryptea = createContext<any>({});

export const CrypteaProvider = ({ children }: { children: JSX.Element }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <CrypteaAuth>
      <Cryptea.Provider value={showModal}>{children}</Cryptea.Provider>
    </CrypteaAuth>
  );
};
