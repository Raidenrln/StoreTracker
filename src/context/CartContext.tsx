import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "@storetracker/cart";

export type CartDataModel = {
  id: string;
  quantity: number;
  storeBelong: string;
};

export interface CartContextModel {
  cart: CartDataModel[];
  addToCart: (p: CartDataModel) => void;
  updateQuantity: (productId: string, change: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextModel | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartDataModel[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (active && savedCart) {
          const parsed: unknown = JSON.parse(savedCart);
          if (Array.isArray(parsed)) setCart(parsed as CartDataModel[]);
        }
      } catch (error) {
        console.warn("Could not load saved cart", error);
      } finally {
        if (active) setStorageLoaded(true);
      }
    };

    void loadCart();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)).catch((error) => {
      console.warn("Could not save cart", error);
    });
  }, [cart, storageLoaded]);

  const addToCart = (p: CartDataModel) => {
    setCart((prev) => {
      const pExist = prev.find((c) => c.id === p.id);

      if (pExist) {
        return prev.map((c) => (c.id === p.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const useCartContext = useContext(CartContext);
  if (!useCartContext) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return useCartContext;
};
