import { ProductProvider } from "@/context/ProductContext";
import { StoreProvider } from "@/context/StoreContext";
import { Tabs } from "expo-router";
const TabLayout = () => {
  return (
    <StoreProvider>
      <ProductProvider>
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
          <Tabs.Screen name="store" options={{ title: "Store" }} />
          <Tabs.Screen name="products" options={{ title: "Products" }} />
          <Tabs.Screen name="cart" options={{ title: "Cart" }} />
          <Tabs.Screen name="receipts" options={{ title: "Receipts" }} />
        </Tabs>
      </ProductProvider>
    </StoreProvider>
  );
};

export default TabLayout;
