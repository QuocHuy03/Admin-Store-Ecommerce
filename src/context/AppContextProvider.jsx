import { createContext, useState } from "react";

export const AppContext = createContext({});

export function AppContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AppContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AppContext.Provider>
  );
}
