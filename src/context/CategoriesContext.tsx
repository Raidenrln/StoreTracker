import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const CATEGORIES_STORAGE_KEY = "@storetracker/categories";

type CategoriesModel = {
  storeCategories: string[];
  productCategories: string[];
  unitTypes: string[];
  addCategory: (type: "store" | "product" | "unit", name: string) => void;
  removeCategory: (type: "store" | "product" | "unit", name: string) => void;
};

const defaultCategories = {
  storeCategories: ["Grocery", "Pharmacy", "Hardware", "Bakery"],
  productCategories: ["Meat", "Vegetables", "Drinks", "Pantry"],
  unitTypes: ["per piece", "per liter", "per kilo"],
};

const CategoriesContext = createContext<CategoriesModel | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(defaultCategories);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CATEGORIES_STORAGE_KEY)
      .then((saved) => {
        if (saved) setCategories({ ...defaultCategories, ...JSON.parse(saved) });
      })
      .catch((error) => console.warn("Could not load categories", error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded)
      AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories)).catch((error) =>
        console.warn("Could not save categories", error),
      );
  }, [categories, loaded]);

  const addCategory = (type: "store" | "product" | "unit", name: string) => {
    const key =
      type === "store" ? "storeCategories" : type === "product" ? "productCategories" : "unitTypes";
    setCategories((current) =>
      current[key].includes(name) ? current : { ...current, [key]: [...current[key], name] },
    );
  };
  const removeCategory = (type: "store" | "product" | "unit", name: string) => {
    const key =
      type === "store" ? "storeCategories" : type === "product" ? "productCategories" : "unitTypes";
    setCategories((current) => ({
      ...current,
      [key]: current[key].filter((item) => item !== name),
    }));
  };

  return (
    <CategoriesContext.Provider value={{ ...categories, addCategory, removeCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error("useCategories must be used inside CategoriesProvider");
  return context;
}
