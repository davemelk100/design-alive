import { createContext, useContext, useState, ReactNode } from "react";

interface StoreContextType {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <StoreContext.Provider value={{ activeCategory, setActiveCategory }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
