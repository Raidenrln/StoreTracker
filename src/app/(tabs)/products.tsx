import { Search, SunDim } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../components/ProductCard";

export type PriceEntry = {
  price: number;
  date: string;
};

export type SampleProdukto = {
  id: string;
  name: string;
  price: number;
  category: string;
  storeBelong: string;
  priceHistory: PriceEntry[];
  unit: string;
};

const produkto: SampleProdukto[] = [
  {
    id: "123213212313",
    name: "Nescafe Creamy White",
    price: 16,
    category: "Coffee",
    storeBelong: "341312334521321",
    priceHistory: [],
    unit: "per piece",
  },
  {
    id: "123213212314",
    name: "Coke Mismo",
    price: 20,
    category: "Drinks",
    storeBelong: "341312334521321",
    priceHistory: [],
    unit: "per perpice",
  },
];

const categories = ["All", "Coffee", "Drinks", "Junk Food", "Bread"];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProducts = produkto.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Products Tracked</Text>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>

          {/* Search input content */}
          <View style={styles.searchContent}>
            <Search size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Category filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((item) => (
              <Pressable
                key={item}
                style={activeCategory === item ? styles.activeCategory : styles.categoryButtons}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={{ color: activeCategory === item ? "white" : "black" }}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Product list content */}
          <View style={styles.productListContent}>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard products={item} storeName={item.storeBelong} />
              )}
              contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text>No products found.</Text>}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    gap: 12,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
  },
  searchContent: {
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#E4EBE4",
    borderRadius: 12,
    paddingLeft: 48,
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    color: "#647368",
    zIndex: 1,
    left: 12,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeCategory: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#17724A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#17724A",
  },
  categoryButtons: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#C6D2C6",
  },
  productListContent: {
    flex: 1,
    minHeight: 0,
    borderRadius: 24,
  },
});
