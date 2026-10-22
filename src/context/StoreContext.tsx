import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORES_STORAGE_KEY = "@storetracker/stores";

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
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStores = async () => {
      try {
        const savedStores = await AsyncStorage.getItem(STORES_STORAGE_KEY);
        if (active && savedStores) {
          const parsed: unknown = JSON.parse(savedStores);
          if (Array.isArray(parsed)) setStores(parsed as StoreDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved stores", error);
      } finally {
        if (active) setStorageLoaded(true);
      }
    };

    void loadStores();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores)).catch((error) => {
      console.warn("Could not save stores", error);
    });
  }, [stores, storageLoaded]);

  const addingNewStore = (store: StoreDataModel) => {
    setStores((prev) => [...prev, store]);
  };
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
