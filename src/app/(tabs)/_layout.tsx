import { Tabs } from "expo-router";
const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="store" options={{ title: "Store" }} />
      <Tabs.Screen name="products" options={{ title: "Products" }} />
    </Tabs>
  );
};

export default TabLayout;
