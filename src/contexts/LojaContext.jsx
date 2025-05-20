import { createContext, useContext, useState } from "react";

const LojaContext = createContext();

export const LojaProvider = ({ children }) => {
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  return (
    <LojaContext.Provider value={{ lojaSelecionada, setLojaSelecionada }}>
      {children}
    </LojaContext.Provider>
  );
};

export const useLoja = () => useContext(LojaContext);
