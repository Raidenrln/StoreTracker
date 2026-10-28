import { CartProvider } from "@/context/CartContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { ProductProvider } from "@/context/ProductContext";
import { ReceiptProvider } from "@/context/ReceiptContext";
import { StoreProvider } from "@/context/StoreContext";
import { ToastProvider } from "@/context/ToastContext";
import { Tabs } from "expo-router";
import { LayoutDashboard, Package, Receipt, ShoppingCart, Store } from "lucide-react-native";

const TabLayout = () => {
  return (
    <ToastProvider>
      <CategoriesProvider>
        <StoreProvider>
          <ProductProvider>
            <CartProvider>
              <ReceiptProvider>
                <Tabs
                  screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#15714A",
                    tabBarInactiveTintColor: "#647368",
                  }}
                >
                  <Tabs.Screen
                    name="dashboard"
                    options={{
                      title: "Dashboard",
                      tabBarIcon: ({ color, size }) => (
                        <LayoutDashboard color={color} size={size} />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="store"
                    options={{
                      title: "Store",
                      tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
                    }}
                  />
                  <Tabs.Screen
                    name="products"
                    options={{
                      title: "Products",
                      tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
                    }}
                  />
                  <Tabs.Screen
                    name="cart"
                    options={{
                      title: "Cart",
                      tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
                    }}
                  />
                  <Tabs.Screen
                    name="receipts"
                    options={{
                      title: "Receipts",
                      tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />,
                    }}
                  />
                  <Tabs.Screen
                    name="settings"
                    options={{
                      title: "Settings",
                      tabBarItemStyle: { display: "none" },
                    }}
                  />
                </Tabs>
              </ReceiptProvider>
            </CartProvider>
          </ProductProvider>
        </StoreProvider>
      </CategoriesProvider>
    </ToastProvider>
  );
};

export default TabLayout;
