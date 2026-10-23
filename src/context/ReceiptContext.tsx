import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const RECEIPTS_STORAGE_KEY = "@storetracker/receipts";

type ProductBought = {
  id: string;
  quantity: number;
  storeBelong: string;
  name?: string;
  price?: number;
  unit?: string;
  storeName?: string;
};

type ReceiptDataModel = {
  id: string;
  dateCreated: string;
  products: ProductBought[];
  total: number;
};

interface ReceiptContextModel {
  receipt: ReceiptDataModel[];
  addingNewReceipt: (receipt: ReceiptDataModel) => void;
  deleteReceipt: (receiptId: string) => void;
}

export const ReceiptContext = createContext<ReceiptContextModel | null>(null);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
  const [receipt, setReceipt] = useState<ReceiptDataModel[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadReceipts = async () => {
      try {
        const savedReceipts = await AsyncStorage.getItem(RECEIPTS_STORAGE_KEY);
        if (!savedReceipts) return;

        const parsedReceipts: unknown = JSON.parse(savedReceipts);
        if (isMounted && Array.isArray(parsedReceipts)) {
          setReceipt(parsedReceipts as ReceiptDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved receipts", error);
      } finally {
        if (isMounted) setStorageLoaded(true);
      }
    };

    void loadReceipts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipt)).catch((error) => {
      console.warn("Could not save receipts", error);
    });
  }, [receipt, storageLoaded]);

  const addingNewReceipt = (newReceipt: ReceiptDataModel) => {
    setReceipt((currentReceipts) => [...currentReceipts, newReceipt]);
  };

  const deleteReceipt = (receiptId: string) => {
    setReceipt((currentReceipts) => currentReceipts.filter((item) => item.id !== receiptId));
  };

  return (
    <ReceiptContext.Provider value={{ receipt, addingNewReceipt, deleteReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipt = () => {
  const receiptContext = useContext(ReceiptContext);
  if (!receiptContext) {
    throw new Error("useReceipt must be inside of ReceiptProvider.");
  }
  return receiptContext;
};
