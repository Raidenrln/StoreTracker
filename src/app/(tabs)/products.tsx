import { useCart } from "@/context/CartContext";
import { useCategories } from "@/context/CategoriesContext";
import { useProduct, type ProductDataModel } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { Plus, Search, ShoppingCart } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddingProduct from "../../components/modals/AddingProduct";
import CompareProductModal from "../../components/modals/CompareProductModal";
import EditProductModal from "../../components/modals/EditProductModal";
import ProductDetailsModal from "../../components/modals/ProductDetailsModal";
import ProductCard from "../../components/ProductCard";
import SettingsButton from "../../components/Settings";

type ProductModal = "details" | "edit" | "compare" | null;

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDataModel | null>(null);
  const [activeModal, setActiveModal] = useState<ProductModal>(null);

  const { products, updateProduct } = useProduct();
  const { stores } = useStore();
  const { addToCart } = useCart();
  const { productCategories } = useCategories();
  const categories = ["All", ...productCategories.filter((item) => item !== "All")];
  const selectedCategory = categories.includes(activeCategory) ? activeCategory : "All";

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openProductModal = (product: ProductDataModel, modal: Exclude<ProductModal, null>) => {
    setSelectedProduct(product);
    setActiveModal(modal);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Products</Text>
            <View style={{ flexDirection: "row", alignContent: "center", gap: 16 }}>
              <Pressable
                style={{
                  backgroundColor: "#15714A",
                  width: 48,
                  height: 48,
                  borderRadius: 100,
                  alignContent: "center",
                  justifyContent: "center",
                }}
                onPress={() => setShowAddModal(true)}
              >
                <Plus color="white" style={{ alignSelf: "center" }} size={32} />
              </Pressable>
              <Pressable style={{ alignSelf: "center" }}>
                <SettingsButton />
              </Pressable>
            </View>
          </View>

          <View style={styles.searchContent}>
            <Search size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((item) => (
              <Pressable
                key={item}
                style={selectedCategory === item ? styles.activeCategory : styles.categoryButtons}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={{ color: selectedCategory === item ? "white" : "black" }}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.productListContent}>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onViewDetails={() => openProductModal(item, "details")}
                  onAddToCart={() =>
                    addToCart({ id: item.id, quantity: 0, storeBelong: item.storeBelong })
                  }
                  onCompare={() => openProductModal(item, "compare")}
                  onEdit={() => openProductModal(item, "edit")}
                />
              )}
              contentContainerStyle={{ gap: 12, paddingBottom: 16, flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                const hasProducts = products.length > 0;
                const EmptyIcon = hasProducts ? Search : ShoppingCart;

                return (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <EmptyIcon color="#15714A" size={28} />
                    </View>
                    <Text style={styles.emptyTitle}>
                      {hasProducts
                        ? "No products match these filters"
                        : "Your product list is empty"}
                    </Text>
                    <Text style={styles.emptyDescription}>
                      {hasProducts
                        ? "Try a different search or category to find a product."
                        : "Add a product with its store and price to start comparing local deals."}
                    </Text>
                    <Pressable
                      style={styles.emptyAction}
                      onPress={() => {
                        if (hasProducts) {
                          setActiveCategory("All");
                          setSearch("");
                        } else {
                          setShowAddModal(true);
                        }
                      }}
                    >
                      {!hasProducts ? <Plus color="white" size={18} /> : null}
                      <Text style={styles.emptyActionText}>
                        {hasProducts ? "Clear search and filters" : "Add a product"}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>

      {showAddModal ? <AddingProduct onClose={setShowAddModal} /> : null}
      {selectedProduct && activeModal === "details" ? (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeProductModal}
          onEdit={() => setActiveModal("edit")}
          onAddToCart={() => {
            addToCart({
              id: selectedProduct.id,
              quantity: 0,
              storeBelong: selectedProduct.storeBelong,
            });
            closeProductModal();
          }}
        />
      ) : null}
      {selectedProduct && activeModal === "edit" ? (
        <EditProductModal
          product={selectedProduct}
          stores={stores}
          onClose={closeProductModal}
          onSave={updateProduct}
        />
      ) : null}
      {selectedProduct && activeModal === "compare" ? (
        <CompareProductModal product={selectedProduct} onClose={closeProductModal} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  content: { flex: 1, gap: 12 },
  header: { justifyContent: "space-between", flexDirection: "row", alignItems: "center" },
  title: { fontSize: 32, fontWeight: 700 },
  searchContent: { position: "relative", justifyContent: "center" },
  searchInput: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#E4EBE4",
    borderRadius: 12,
    paddingLeft: 48,
    fontSize: 16,
  },
  searchIcon: { position: "absolute", color: "#647368", zIndex: 1, left: 12 },
  categoryContent: { flexDirection: "row", alignItems: "center", gap: 8 },
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
  productListContent: { flex: 1, minHeight: 0, borderRadius: 24 },
  emptyState: {
    flex: 1,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDE6DE",
    backgroundColor: "white",
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6EEE7",
    marginBottom: 4,
  },
  emptyTitle: { color: "#1A3024", fontSize: 18, fontWeight: "700", textAlign: "center" },
  emptyDescription: { color: "#647368", fontSize: 14, lineHeight: 20, textAlign: "center" },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    marginTop: 4,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#15714A",
  },
  emptyActionText: { color: "white", fontSize: 15, fontWeight: "700" },
});
