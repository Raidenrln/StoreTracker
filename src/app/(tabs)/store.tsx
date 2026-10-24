import { useCart } from "@/context/CartContext";
import { useCategories } from "@/context/CategoriesContext";
import { useProduct, type ProductDataModel } from "@/context/ProductContext";
import { useStore, type StoreDataModel } from "@/context/StoreContext";
import { Plus, Search, Store as StoreIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddingStore from "../../components/modals/AddingStore";
import CompareProductModal from "../../components/modals/CompareProductModal";
import EditProductModal from "../../components/modals/EditProductModal";
import EditStoreModal from "../../components/modals/EditStoreModal";
import ProductDetailsModal from "../../components/modals/ProductDetailsModal";
import StoreDetailsModal from "../../components/modals/StoreDetailsModal";
import SettingsButton from "../../components/SettingsButton";
import StoreCard from "../../components/StoreCard";

export default function Store() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchStore, setSearchStore] = useState("");
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [selectedStore, setSelectedStore] = useState<StoreDataModel | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDataModel | null>(null);
  const [activeModal, setActiveModal] = useState<
    "details" | "editStore" | "productDetails" | "editProduct" | "compare" | null
  >(null);
  const { stores, updateStore } = useStore();
  const { updateProduct } = useProduct();
  const { addToCart } = useCart();
  const { storeCategories } = useCategories();
  const categories = ["All", ...storeCategories.filter((item) => item !== "All")];
  const selectedCategory = categories.includes(activeCategory) ? activeCategory : "All";
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedStore(null);
    setSelectedProduct(null);
  };

  const filteredStore = stores.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchStore.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <SafeAreaView style={{ flex: 1, position: "relative" }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Stores</Text>

            <View style={{ flexDirection: "row", alignContent: "center", gap: 16 }}>
              <Pressable
                style={{
                  backgroundColor: "#15714A",
                  width: 48,
                  height: 48,
                  borderRadius: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                }}
                onPress={() => setShowAddModal(true)}
              >
                <Plus color={"white"} style={{ alignSelf: "center" }} size={32} />
              </Pressable>
              <Pressable style={{ alignSelf: "center" }}>
                <SettingsButton />
              </Pressable>
            </View>
          </View>
          {/* Search input content */}
          <View style={styles.searchContent}>
            <Search size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stores"
              value={searchStore}
              onChangeText={setSearchStore}
            />
          </View>
          {/*  */}
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
                <Text
                  style={{
                    color: activeCategory === item ? "white" : "black",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {/* Store List content */}
          <View style={styles.storeListContent}>
            <FlatList
              data={filteredStore}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <StoreCard
                  stores={item}
                  currentTime={currentTime}
                  onViewDetails={() => {
                    setSelectedStore(item);
                    setActiveModal("details");
                  }}
                  onEdit={() => {
                    setSelectedStore(item);
                    setActiveModal("editStore");
                  }}
                />
              )}
              contentContainerStyle={{ gap: 12, paddingBottom: 16, flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                const hasStores = stores.length > 0;
                const EmptyIcon = hasStores ? Search : StoreIcon;

                return (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <EmptyIcon color="#15714A" size={28} />
                    </View>
                    <Text style={styles.emptyTitle}>
                      {hasStores ? "No stores match these filters" : "Start with your first store"}
                    </Text>
                    <Text style={styles.emptyDescription}>
                      {hasStores
                        ? "Try a different search or category to find a store."
                        : "Save nearby stores so you can track their prices and opening hours."}
                    </Text>
                    <Pressable
                      style={styles.emptyAction}
                      onPress={() => {
                        if (hasStores) {
                          setActiveCategory("All");
                          setSearchStore("");
                        } else {
                          setShowAddModal(true);
                        }
                      }}
                    >
                      {!hasStores ? <Plus color="white" size={18} /> : null}
                      <Text style={styles.emptyActionText}>
                        {hasStores ? "Clear search and filters" : "Add a store"}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
      {showAddModal && <AddingStore onClose={setShowAddModal} />}
      {selectedStore && activeModal === "details" ? (
        <StoreDetailsModal
          store={selectedStore}
          onClose={closeModal}
          onEdit={() => setActiveModal("editStore")}
          onViewProduct={(product) => {
            setSelectedProduct(product);
            setActiveModal("productDetails");
          }}
          onEditProduct={(product) => {
            setSelectedProduct(product);
            setActiveModal("editProduct");
          }}
          onCompareProduct={(product) => {
            setSelectedProduct(product);
            setActiveModal("compare");
          }}
        />
      ) : null}
      {selectedStore && activeModal === "editStore" ? (
        <EditStoreModal store={selectedStore} onClose={closeModal} onSave={updateStore} />
      ) : null}
      {selectedProduct && activeModal === "productDetails" ? (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeModal}
          onEdit={() => setActiveModal("editProduct")}
          onAddToCart={() => {
            addToCart({
              id: selectedProduct.id,
              quantity: 0,
              storeBelong: selectedProduct.storeBelong,
            });
            closeModal();
          }}
        />
      ) : null}
      {selectedProduct && activeModal === "editProduct" ? (
        <EditProductModal
          product={selectedProduct}
          stores={stores}
          onClose={closeModal}
          onSave={updateProduct}
        />
      ) : null}
      {selectedProduct && activeModal === "compare" ? (
        <CompareProductModal product={selectedProduct} onClose={closeModal} />
      ) : null}
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
  storeListContent: {
    flex: 1,
    minHeight: 0,
    borderRadius: 24,
  },
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
