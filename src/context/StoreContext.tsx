import { createContext, ReactNode, useContext, useState } from "react";

export type StoreDataModel = {
  id: string;
  name: string;
  category: string;
  dateCreated: string;
  openTime: string;
  closeTime: string;
  facebookPage: string;
  products: [];
};

interface StoreContextModel {
  stores: StoreDataModel[];
  addingNewStore: (store: StoreDataModel) => void;
}

export const StoreContext = createContext<StoreContextModel | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<StoreDataModel[]>([]);

  const addingNewStore = (store: StoreDataModel) => {
    setStores((prev) => [...prev, store]);
  };
  console.log(stores);

  return (
    <StoreContext.Provider value={{ stores, addingNewStore }}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return storeContext;
};
