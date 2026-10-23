import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { ReceiptProvider } from "@/context/ReceiptContext";
import { StoreProvider } from "@/context/StoreContext";
import { Tabs } from "expo-router";
const TabLayout = () => {
  return (
    <StoreProvider>
      <ProductProvider>
        <CartProvider>
          <ReceiptProvider>
            <Tabs screenOptions={{ headerShown: false }}>
              <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
              <Tabs.Screen name="store" options={{ title: "Store" }} />
              <Tabs.Screen name="products" options={{ title: "Products" }} />
              <Tabs.Screen name="cart" options={{ title: "Cart" }} />
              <Tabs.Screen name="receipts" options={{ title: "Receipts" }} />
            </Tabs>
          </ReceiptProvider>
        </CartProvider>
      </ProductProvider>
    </StoreProvider>
  );
};

export default TabLayout;
