import { useCart } from "@/context/CartContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { SunDim } from "lucide-react-native";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatCurrency = (amount: number) =>
  `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

const Cart = () => {
  const { stores } = useStore();
  const { products } = useProduct();
  const { cart, updateQuantity, clearCart } = useCart();

  const groupedCart = stores
    .map((store) => {
      const items = cart
        .filter((cartItem) => cartItem.storeBelong === store.id)
        .map((cartItem) => {
          const product = products.find((item) => item.id === cartItem.id);
          return { cartItem, product };
        })
        .filter((item) => item.product !== undefined);

      return { store, items };
    })
    .filter((group) => group.items.length > 0);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    Alert.alert("Checkout", "Receipt saving is not connected yet.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.subtitle}>
              {groupedCart.length} {groupedCart.length === 1 ? "store" : "stores"} · {itemCount}{" "}
              {itemCount === 1 ? "item" : "items"}
            </Text>
            <Text style={styles.title}>Cart</Text>
          </View>
          <Pressable style={styles.settingsButton} accessibilityLabel="Cart settings">
            <SunDim size={24} color={COLORS.text} />
          </Pressable>
        </View>

        {groupedCart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.mutedText}>Add products to see them grouped by store.</Text>
          </View>
        ) : (
          <>
            <View style={styles.storeList}>
              {groupedCart.map(({ store, items }) => (
                <View key={store.id} style={styles.storeCard}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  {items.map(({ cartItem, product }) => {
                    if (!product) return null;

                    return (
                      <View key={cartItem.id} style={styles.productRow}>
                        <View style={styles.productInfo}>
                          <Text style={styles.productName} numberOfLines={1}>
                            {product.name}
                          </Text>
                          <Text style={styles.unitPrice} numberOfLines={1}>
                            {formatCurrency(product.price)} {product.unit}
                          </Text>
                        </View>

                        <View style={styles.quantityControls}>
                          <Pressable
                            onPress={() => updateQuantity(cartItem.id, -1)}
                            style={styles.quantityButton}
                            accessibilityLabel={`Decrease ${product.name} quantity`}
                          >
                            <Text style={styles.quantityButtonText}>−</Text>
                          </Pressable>
                          <Text style={styles.quantityLabel} numberOfLines={1}>
                            {cartItem.quantity} {product.unit}
                          </Text>
                          <Pressable
                            onPress={() => updateQuantity(cartItem.id, 1)}
                            style={styles.quantityButton}
                            accessibilityLabel={`Increase ${product.name} quantity`}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </Pressable>
                        </View>

                        <Text style={styles.lineTotal} numberOfLines={1}>
                          {formatCurrency(product.price * cartItem.quantity)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.mutedText}>Items</Text>
                <Text style={styles.summaryValue}>{itemCount}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable onPress={clearCart} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </Pressable>
              <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout and save receipt</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const COLORS = {
  background: "#F3F6F1",
  border: "#DDE6DC",
  green: "#16794F",
  muted: "#718078",
  text: "#1C3027",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CAD8CA",
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  storeList: {
    gap: 12,
  },
  storeCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  storeName: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "700",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  productName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  unitPrice: {
    color: COLORS.muted,
    fontSize: 13,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#CAD8CA",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 24,
  },
  quantityLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    minWidth: 42,
    maxWidth: 70,
  },
  lineTotal: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
    minWidth: 48,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  clearButton: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: "700",
  },
  checkoutButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 20,
    gap: 6,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
});

export default Cart;
