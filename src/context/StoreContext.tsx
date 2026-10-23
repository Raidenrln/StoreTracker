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
  updateStore: (store: StoreDataModel) => void;
  deleteStore: (storeId: string) => void;
}

export const StoreContext = createContext<StoreContextModel | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<StoreDataModel[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStores = async () => {
      try {
        const savedStores = await AsyncStorage.getItem(STORES_STORAGE_KEY);
        if (!savedStores) return;

        const parsedStores: unknown = JSON.parse(savedStores);
        if (isMounted && Array.isArray(parsedStores)) {
          setStores(parsedStores as StoreDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved stores", error);
      } finally {
        if (isMounted) setStorageLoaded(true);
      }
    };

    void loadStores();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores)).catch((error) => {
      console.warn("Could not save stores", error);
    });
  }, [stores, storageLoaded]);

  const addingNewStore = (store: StoreDataModel) => {
    setStores((currentStores) => [...currentStores, store]);
  };

  const updateStore = (updatedStore: StoreDataModel) => {
    setStores((currentStores) =>
      currentStores.map((store) => (store.id === updatedStore.id ? updatedStore : store)),
    );
  };

  const deleteStore = (storeId: string) => {
    setStores((currentStores) => currentStores.filter((store) => store.id !== storeId));
  };

  return (
    <StoreContext.Provider value={{ stores, addingNewStore, updateStore, deleteStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const storeContext = useContext(StoreContext);
  if (!storeContext) {
    throw new Error("useStore must be used inside of StoreProvider.");
  }
  return storeContext;
};
