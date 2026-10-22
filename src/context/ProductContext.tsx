import { createContext, ReactNode, useContext, useState } from "react";

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
