import { useProduct } from "@/context/ProductContext";
import { useReceipt } from "@/context/ReceiptContext";
import { useStore } from "@/context/StoreContext";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

export interface StoreGroup {
  storeName: string;
  items: ReceiptItem[];
}

export interface ReceiptDetails {
  id: string;
  date: string;
  totalItems: number;
  totalPrice: number;
  stores: StoreGroup[];
}

interface ReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  receipt: ReceiptDetails | null;
}

const ink = "#1A1A1A";
const green = "#1C6940";

const formatPrice = (price: number) =>
  `₱${(Number.isFinite(price) ? price : 0).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export default function ReceiptModal({ visible, onClose, onDelete, receipt }: ReceiptModalProps) {
  const { receipt: savedReceipts } = useReceipt();
  const { products } = useProduct();
  const { stores } = useStore();

  if (!receipt) return null;

  // Receipts store product and store IDs. Join them to the current catalogs here
  // so the modal shows the names and prices users actually recognize.
  const savedReceipt = savedReceipts.find((item) => item.id === receipt.id);
  const groupedItems = new Map<string, { storeName: string; items: ReceiptItem[] }>();

  for (const bought of savedReceipt?.products ?? []) {
    const product = products.find((item) => item.id === bought.id);
    const storeId = bought.storeBelong || product?.storeBelong || "unknown";
    const store = stores.find((item) => item.id === storeId);
    const groupKey = storeId;
    const group = groupedItems.get(groupKey) ?? {
      storeName: store?.name ?? "Unknown store",
      items: [],
    };

    group.items.push({
      name: product?.name ?? "Product no longer available",
      price: product?.price ?? 0,
      quantity: Math.max(1, Number(bought.quantity) || 1),
    });
    groupedItems.set(groupKey, group);
  }

  const displayStores = groupedItems.size > 0 ? Array.from(groupedItems.values()) : receipt.stores;
  const itemCount = savedReceipt?.products.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close receipt" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={1}>
                {receipt.id}
              </Text>
              <Text style={styles.subtitle}>
                {receipt.date} · {itemCount ?? receipt.totalItems} items
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {displayStores.length > 0 ? (
              displayStores.map((store, storeIndex) => (
                <View key={`${store.storeName}-${storeIndex}`} style={styles.storeCard}>
                  <Text style={styles.storeName}>{store.storeName}</Text>
                  {store.items.map((item, itemIndex) => (
                    <View key={`${item.name}-${itemIndex}`} style={styles.itemRow}>
                      <View style={styles.itemText}>
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        {formatPrice(item.price)}
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No product details are available for this receipt.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>{formatPrice(receipt.totalPrice)}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.deleteButton} onPress={onDelete} accessibilityRole="button">
              <Text style={styles.deleteText}>Delete receipt</Text>
            </Pressable>
            <Pressable style={styles.doneButton} onPress={onClose} accessibilityRole="button">
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "#00000066" },
  scrim: { ...StyleSheet.absoluteFill },
  sheet: {
    maxHeight: "88%",
    minHeight: "53%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CED9D0",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: { flex: 1, paddingRight: 12 },
  title: { color: ink, fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#69776D", fontSize: 14, marginTop: 6 },
  close: { color: "#627168", fontSize: 30, lineHeight: 34 },
  list: { flexShrink: 1 },
  listContent: { paddingBottom: 8 },
  storeCard: {
    borderWidth: 1,
    borderColor: "#E0E8E0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  storeName: { color: "#19734D", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemText: { flex: 1, paddingRight: 12 },
  itemName: { color: "#1D2B22", fontSize: 16 },
  quantity: { color: "#777777", fontSize: 12, marginTop: 3 },
  itemPrice: { color: ink, fontSize: 16, fontWeight: "700" },
  emptyCard: { padding: 18, borderRadius: 16, backgroundColor: "#F7F8F7" },
  emptyText: { color: "#707070", fontSize: 14, lineHeight: 20 },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 22,
  },
  totalLabel: { color: ink, fontSize: 18, fontWeight: "700" },
  totalPrice: { color: ink, fontSize: 22, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10 },
  deleteButton: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#19734D",
    borderRadius: 14,
  },
  deleteText: { color: "#19734D", fontSize: 15, fontWeight: "700" },
  doneButton: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#19734D",
    borderRadius: 14,
  },
  doneText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
