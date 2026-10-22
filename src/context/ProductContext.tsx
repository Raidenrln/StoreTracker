import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const PRODUCTS_STORAGE_KEY = "@storetracker/products";

export type PriceHistoryModel = {
  previousPrice: number;
  newPrice: number;
  changedAt: string;
};

export type ProductDataModel = {
  id: string;
  name: string;
  dateCreated: string;
  price: number;
  storeBelong: string;
  boughtQuantity: number;
  category: string;
  priceHistory: PriceHistoryModel[];
  unit: string;
};

interface ProductContextModel {
  products: ProductDataModel[];
  addProduct: (newProduct: ProductDataModel) => void;
}

export const ProductContext = createContext<ProductContextModel | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductDataModel[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const savedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (active && savedProducts) {
          const parsed: unknown = JSON.parse(savedProducts);
          if (Array.isArray(parsed)) setProducts(parsed as ProductDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved products", error);
      } finally {
        if (active) setStorageLoaded(true);
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)).catch((error) => {
      console.warn("Could not save products", error);
    });
  }, [products, storageLoaded]);

  const addProduct = (newProduct: ProductDataModel) => {
    setProducts((prev) => [...prev, newProduct]);
  };
  return <ProductContext value={{ products, addProduct }}>{children}</ProductContext>;
};

export const useProduct = () => {
  const useProductContext = useContext(ProductContext);

  if (!useProductContext) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return useProductContext;
};
