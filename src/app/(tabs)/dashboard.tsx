import { useProduct } from "@/context/ProductContext";
import { useReceipt } from "@/context/ReceiptContext";
import { useStore } from "@/context/StoreContext";
import { Clock, Receipt, TrendingDown, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsButton from "../../components/Settings";

// ---------- Colors ----------
const COLORS = {
  background: "#F3F6F1",
  card: "#FFFFFF",
  border: "#DFE7DE",
  text: "#13261B",
  textSoft: "#293B30",
  muted: "#6B7A70",
  green: "#1F7A4D",
  red: "#C0392B",
};

// ---------- Small helpers ----------
const peso = (amount: number) => `₱ ${amount.toLocaleString("en-PH")}`;

// ---------- Small reusable pieces ----------
function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function StatCard({ number, label }: { number: number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// One row in the "Price changes" list
function PriceChangeRow({
  product,
  store,
  oldPrice,
  newPrice,
  changedAt,
}: {
  product: string;
  store: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
}) {
  const isCheaper = newPrice < oldPrice;
  const color = isCheaper ? COLORS.green : COLORS.red;
  const Icon = isCheaper ? TrendingDown : TrendingUp;

  return (
    <View style={styles.priceChangeCard}>
      <View style={styles.priceChangeHeader}>
        <View style={styles.priceChangeTitleGroup}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {product}
          </Text>
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {store}
          </Text>
        </View>
        <View
          style={[styles.priceChangeBadge, { backgroundColor: isCheaper ? "#E4F3E9" : "#FCE9E7" }]}
        >
          <Icon size={15} color={color} />
          <Text style={[styles.priceChangeAmount, { color }]}>
            {peso(Math.abs(newPrice - oldPrice))}
          </Text>
        </View>
      </View>
      <View style={styles.priceChangeFooter}>
        <Text style={styles.oldPrice}>{peso(oldPrice)}</Text>
        <Text style={styles.priceArrow}>→</Text>
        <Text style={[styles.newPrice, { color }]}>{peso(newPrice)}</Text>
        <Text style={styles.priceChangeDate}>
          {new Date(changedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
      </View>
    </View>
  );
}

// ---------- The screen ----------
const Dashboard = () => {
  const now = new Date();
  const { stores } = useStore();
  const { products } = useProduct();
  const { receipt } = useReceipt();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfToday - now.getDay() * 86400000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const spend = {
    today: receipt
      .filter((item) => new Date(item.dateCreated).getTime() >= startOfToday)
      .reduce((sum, item) => sum + item.total, 0),
    week: receipt
      .filter((item) => new Date(item.dateCreated).getTime() >= startOfWeek)
      .reduce((sum, item) => sum + item.total, 0),
    month: receipt
      .filter((item) => new Date(item.dateCreated).getTime() >= startOfMonth)
      .reduce((sum, item) => sum + item.total, 0),
    lastMonth: receipt
      .filter((item) => {
        const date = new Date(item.dateCreated).getTime();
        return date >= startOfLastMonth && date < startOfMonth;
      })
      .reduce((sum, item) => sum + item.total, 0),
  };
  const storesOpen = stores.filter((store) =>
    isStoreOpen(store.openTime, store.closeTime, now),
  ).length;
  const productsTracked = products.length;
  const priceChanges = products
    .flatMap((product) =>
      product.priceHistory.map((change) => ({
        id: `${product.id}-${change.changedAt}`,
        product: product.name,
        store: stores.find((store) => store.id === product.storeBelong)?.name ?? "Unknown store",
        oldPrice: change.previousPrice,
        newPrice: change.newPrice,
        changedAt: change.changedAt,
      })),
    )
    .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
    .slice(0, 3);
  const closingSoon = stores
    .map((store) => {
      const end = parseStoreTime(store.closeTime);
      const nowMinute = now.getHours() * 60 + now.getMinutes();
      const minutes = end === null ? -1 : end - nowMinute;
      return { id: store.id, name: store.name, minutes };
    })
    .filter((store) => store.minutes > 0 && store.minutes <= 120)
    .sort((a, b) => a.minutes - b.minutes);
  const recentReceipts = receipt
    .slice()
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      store: stores.find((store) => store.id === item.products[0]?.storeBelong)?.name ?? "Receipt",
      date: new Date(item.dateCreated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      total: item.total,
    }));
  const dateFormat = now.toLocaleString("en-US", { month: "short", day: "2-digit" });
  const getDay = now.toLocaleDateString("en-US", { weekday: "long" });

  // How much more or less than last month (in %)
  const monthChange =
    spend.lastMonth === 0
      ? 0
      : Math.round(((spend.month - spend.lastMonth) / spend.lastMonth) * 100);
  const spentLess = monthChange <= 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>
              {dateFormat} · {getDay}
            </Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <SettingsButton />
        </View>

        {/* Spending: the main card of the screen */}
        <View style={styles.spendCard}>
          <Text style={styles.spendLabel}>Spent this month</Text>
          <Text style={styles.spendBig}>{peso(spend.month)}</Text>
          <Text style={styles.spendCompare}>
            {spentLess ? "↓" : "↑"} {Math.abs(monthChange)}% vs last month
          </Text>

          <View style={styles.spendTiles}>
            <View style={styles.spendTile}>
              <Text style={styles.spendTileLabel}>Today</Text>
              <Text style={styles.spendTileValue}>{peso(spend.today)}</Text>
            </View>
            <View style={styles.spendTile}>
              <Text style={styles.spendTileLabel}>This week</Text>
              <Text style={styles.spendTileValue}>{peso(spend.week)}</Text>
            </View>
          </View>
        </View>

        {/* Quick numbers */}
        <View style={styles.statRow}>
          <StatCard number={storesOpen} label="Stores open now" />
          <StatCard number={productsTracked} label="Products tracked" />
        </View>

        {/* Price changes */}
        <SectionTitle>Price changes</SectionTitle>
        <View style={styles.priceChangesList}>
          {priceChanges.length > 0 ? (
            priceChanges.map((item) => <PriceChangeRow key={item.id} {...item} />)
          ) : (
            <View style={styles.emptyPriceChanges}>
              <Text style={styles.emptyPriceTitle}>No price changes yet.</Text>
              <Text style={styles.rowSubtitle}>Update a product price to see changes here.</Text>
            </View>
          )}
        </View>

        {/* Closing soon */}
        <SectionTitle>Closing soon</SectionTitle>
        <View style={styles.priceChangesList}>
          {closingSoon.length > 0 ? (
            closingSoon.map((store) => (
              <View key={store.id} style={styles.closingSoonCard}>
                <View style={styles.closingSoonStore}>
                  <Clock size={20} color={COLORS.muted} />
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {store.name}
                  </Text>
                </View>
                <View style={styles.closingSoonBadge}>
                  <Text style={styles.closingSoonBadgeText}>Closes in {store.minutes} min</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyPriceChanges}>
              <Text style={styles.emptyPriceTitle}>No stores closing soon.</Text>
              <Text style={styles.rowSubtitle}>
                Stores closing within two hours will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Recent receipts */}
        <SectionTitle>Recent receipts</SectionTitle>
        {recentReceipts.length > 0 ? (
          <View style={styles.listCard}>
            {recentReceipts.map((receipt) => (
              <View key={receipt.id} style={styles.row}>
                <Receipt size={20} color={COLORS.muted} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.rowTitle}>{receipt.store}</Text>
                  <Text style={styles.rowSubtitle}>{receipt.date}</Text>
                </View>
                <Text style={styles.rowTitle}>{peso(receipt.total)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyPriceChanges}>
            <Text style={styles.emptyPriceTitle}>No receipts yet.</Text>
            <Text style={styles.rowSubtitle}>
              Complete a checkout and your saved purchases will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

function parseStoreTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  if (match[3]) hour = (hour % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

function isStoreOpen(openTime: string, closeTime: string, now: Date) {
  const open = parseStoreTime(openTime);
  const close = parseStoreTime(closeTime);
  if (open === null || close === null || open === close) return false;
  const minute = now.getHours() * 60 + now.getMinutes();
  return open < close ? minute >= open && minute < close : minute >= open || minute < close;
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 12, paddingBottom: 32 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  date: { color: COLORS.muted, fontSize: 14 },
  title: { fontSize: 32, fontWeight: "700", color: COLORS.text },

  // Spending card (dark green so it stands out)
  spendCard: {
    backgroundColor: COLORS.text,
    borderRadius: 24,
    padding: 20,
    gap: 4,
  },
  spendLabel: { color: "#B9CDBF", fontSize: 15 },
  spendBig: { color: "white", fontSize: 44, fontWeight: "700" },
  spendCompare: { color: "#8FD6AE", fontSize: 15, marginBottom: 12 },
  spendTiles: { flexDirection: "row", gap: 10 },
  spendTile: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  spendTileLabel: { color: "#B9CDBF", fontSize: 14 },
  spendTileValue: { color: "white", fontSize: 20, fontWeight: "700" },

  // Quick numbers
  statRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
  },
  statNumber: { fontSize: 40, fontWeight: "700", color: COLORS.text },
  statLabel: { color: COLORS.textSoft },

  // Lists
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
  },
  listCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowTitle: { fontSize: 16, fontWeight: "500", color: COLORS.text },
  rowSubtitle: { fontSize: 14, color: COLORS.muted },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceChangesList: { gap: 10 },
  emptyPriceChanges: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 18,
    gap: 6,
  },
  emptyPriceTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  closingSoonCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  closingSoonStore: { flexDirection: "row", alignItems: "center", gap: 10 },
  closingSoonBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E4F3E9",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closingSoonBadgeText: { color: COLORS.green, fontSize: 13, fontWeight: "700" },
  priceChangeCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  priceChangeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  priceChangeTitleGroup: { flex: 1, gap: 3 },
  priceChangeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  priceChangeAmount: { fontSize: 13, fontWeight: "700" },
  priceChangeFooter: { flexDirection: "row", alignItems: "center", gap: 7 },
  priceArrow: { color: COLORS.muted, fontSize: 15 },
  priceChangeDate: { color: COLORS.muted, fontSize: 12, marginLeft: "auto" },
  newPrice: { fontSize: 16, fontWeight: "700" },
  oldPrice: {
    fontSize: 13,
    color: COLORS.muted,
    textDecorationLine: "line-through",
  },
});

export default Dashboard;
