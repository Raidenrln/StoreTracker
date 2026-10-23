import type { ProductDataModel } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import { Pencil, Scale, ShoppingCart, Store, Tag, Trash } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface ProductCardProps {
  product: ProductDataModel;
  onViewDetails: () => void;
  onAddToCart: () => void;
  onCompare: () => void;
  onEdit: () => void;
}

const formatPrice = (price: number) => `${String.fromCharCode(0x20b1)}${price.toFixed(2)}`;

const ProductCard = ({
  product,
  onViewDetails,
  onAddToCart,
  onCompare,
  onEdit,
}: ProductCardProps) => {
  const { stores } = useStore();
  const showToast = useToast();
  const { deleteProduct } = useProduct();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const store = stores.find((item) => item.id === product.storeBelong);

  return (
    <View style={styles.content}>
      <View style={styles.productNameContent}>
        <Pressable onPress={onViewDetails} style={{ flex: 1 }}>
          <Text style={styles.productName} ellipsizeMode="tail" numberOfLines={1}>
            {product.name}
          </Text>
        </Pressable>
        <View style={styles.productPriceBadge}>
          <Text style={styles.productPriceText}>{formatPrice(product.price)}</Text>
        </View>
      </View>

      <View style={styles.productStoreBelongContent}>
        <Store color="#56675C" size={16} />
        <Text style={styles.productStoreBelongText} numberOfLines={1} ellipsizeMode="tail">
          {store?.name ?? "Unknown store"}
        </Text>
      </View>

      <View style={styles.productCategoryBadge}>
        <Text style={styles.productCategoryText}>{product.category}</Text>
      </View>

      <View style={styles.productBottomContent}>
        <View style={styles.productUnitContent}>
          <Tag color="#56675C" size={16} />
          <Text style={styles.productUnitText} numberOfLines={1}>
            {product.unit}
          </Text>
        </View>

        <View style={styles.productButtonsContent}>
          <Pressable
            style={styles.productButtons}
            onPress={onAddToCart}
            accessibilityLabel="Add product to cart"
          >
            <ShoppingCart color="#006134" />
          </Pressable>
          <Pressable
            style={styles.productButtons}
            onPress={onCompare}
            accessibilityLabel="Compare product"
          >
            <Scale color="#006134" />
          </Pressable>
          <Pressable
            style={styles.productButtons}
            onPress={onEdit}
            accessibilityLabel="Edit product"
          >
            <Pencil color="#006134" />
          </Pressable>
          <Pressable
            style={styles.productButtonsDelete}
            onPress={() => setConfirmDelete(true)}
            accessibilityLabel="Delete product"
          >
            <Trash color="#852111" />
          </Pressable>
        </View>
      </View>

      <ConfirmDeleteModal
        visible={confirmDelete}
        itemName={product.name}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteProduct(product.id);
          setConfirmDelete(false);
          showToast("Product deleted");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#C6D2C6",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 12,
  },
  productNameContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  productName: { fontSize: 20, fontWeight: 600, flexShrink: 1 },
  productPriceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#DDF1E5",
  },
  productPriceText: { color: "#286D4D", fontWeight: 600 },
  productStoreBelongContent: { flexDirection: "row", alignItems: "center", gap: 4 },
  productStoreBelongText: { color: "#56675C", flexShrink: 1 },
  productCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E6EEE7",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  productCategoryText: { color: "#334C3C", fontWeight: 600 },
  productBottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  productUnitContent: { flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 1 },
  productUnitText: { color: "#56675C", marginTop: -1, flexShrink: 1 },
  productButtonsContent: { flexDirection: "row", gap: 8 },
  productButtons: { borderWidth: 1, padding: 8, borderRadius: 12, borderColor: "#006134" },
  productButtonsDelete: { borderWidth: 1, padding: 8, borderRadius: 12, borderColor: "#E5BEB7" },
});

export default ProductCard;
