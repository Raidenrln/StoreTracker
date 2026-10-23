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
  addProduct: (product: ProductDataModel) => void;
  updateProduct: (product: ProductDataModel) => void;
  deleteProduct: (productId: string) => void;
}

export const ProductContext = createContext<ProductContextModel | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductDataModel[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const savedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (!savedProducts) return;

        const parsedProducts: unknown = JSON.parse(savedProducts);
        if (isMounted && Array.isArray(parsedProducts)) {
          setProducts(parsedProducts as ProductDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved products", error);
      } finally {
        if (isMounted) setStorageLoaded(true);
      }
    };

    void loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)).catch((error) => {
      console.warn("Could not save products", error);
    });
  }, [products, storageLoaded]);

  const addProduct = (product: ProductDataModel) => {
    setProducts((currentProducts) => [...currentProducts, product]);
  };

  const updateProduct = (updatedProduct: ProductDataModel) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const productContext = useContext(ProductContext);
  if (!productContext) {
    throw new Error("useProduct must be used inside of ProductProvider.");
  }
  return productContext;
};
