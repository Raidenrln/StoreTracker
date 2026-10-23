import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "./ToastContext";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "@storetracker/cart";

type CartItem = {
  id: string;
  quantity: number;
  storeBelong: string;
};

interface CartContextModel {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, change: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextModel | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const showToast = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (!savedCart) return;

        const parsedCart: unknown = JSON.parse(savedCart);
        if (isMounted && Array.isArray(parsedCart)) {
          setCart(parsedCart as CartItem[]);
        }
      } catch (error) {
        console.warn("Could not load saved cart", error);
      } finally {
        if (isMounted) setStorageLoaded(true);
      }
    };

    void loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;

    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)).catch((error) => {
      console.warn("Could not save cart", error);
    });
  }, [cart, storageLoaded]);

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const alreadyInCart = currentCart.some((cartItem) => cartItem.id === item.id);

      if (alreadyInCart) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
    showToast("Added to cart");
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((currentCart) =>
      currentCart
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
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("useCart must be used inside of CartProvider.");
  }
  return cartContext;
};
