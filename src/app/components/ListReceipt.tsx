import { useReceipt } from "@/context/ReceiptContext";
import { ReceiptText } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReceiptModal, { ReceiptDetails } from "./modals/ReceiptModal";

const ListReceipt = () => {
  const now = new Date();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDetails | null>(null);
  const { receipt } = useReceipt();
  // useEffect(() => {
  //   console.log(receipt);
  // });
  const thisMonth = now
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
    })
    .split("/")
    .join("-");

  const thisDay = now.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const thisDayTotalFilter = receipt
    .filter((r) => {
      const date = new Date(r.dateCreated).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return date === thisDay;
    })
    .reduce((sub, r) => sub + r.total, 0);

  // Start from a base date (hardcoded to Oct 19, 2026 here)
  const startOfWeek = new Date(now);

  // Move back to Monday of the current week:
  // getDay() is 0 for Sunday ... 6 for Saturday, so (getDay() + 6) % 7
  // converts it to 0 for Monday ... 6 for Sunday, i.e. days since Monday
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  // Reset the time to local midnight
  startOfWeek.setHours(0, 0, 0, 0);
  // console.log(startOfWeek);

  // Start of next week (7 days later), used  as the exclusive upper bound
  const startOfNextWeek = new Date(startOfWeek);
  startOfNextWeek.setDate(startOfWeek.getDate() + 7);
  // console.log(startOfNextWeek);
  // Sum the totals of all receip ts that fall within this week
  const weekTotalFilter = receipt
    // Keep only receipts dated within [startOfWeek, startOfNextWeek)
    .filter((r) => {
      // Parse the receipt date as local midnight so it compares correctly
      const date = new Date(r.dateCreated);
      return date >= startOfWeek && date < startOfNextWeek;
    })
    // Add up the totals, starting from 0
    .reduce((sub, r) => sub + r.total, 0);

  // console.log(weekTotalFilter);

  const monthTotalFilter = receipt
    .filter((r) => {
      // console.log(r.date);
      const date = new Date(r.dateCreated)
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
        })
        .split("/")
        .join("-");
      return date === thisMonth;
    })
    .reduce((sub, r) => sub + r.total, 0);

  const montlyFilterShowList = receipt.filter((r) => {
    const date = new Date(r.dateCreated)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
      })
      .split("/")
      .join("-");
    return date === thisMonth;
  });
  // console.log(montlyFilterShowList);
  const formatDateList = (d: string) => {
    const dateFromList = new Date(d);
    const format = [
      dateFromList.getFullYear(),
      String(dateFromList.getMonth() + 1).padStart(2, "0"),
      String(dateFromList.getDate()).padStart(2, "0"),
    ].join("-");

    return format;
  };

  const handlePressReceipt = (item: any) => {
    // Safely calculate total items
    const totalItems =
      item.products?.reduce((sum: number, p: any) => sum + (p.quantity || 1), 0) || 0;

    // Group products by store
    const storeGroups: Record<string, any[]> = {};
    if (item.products) {
      item.products.forEach((p: any) => {
        const storeName = p.storeName || p.store || "Unknown Store";
        if (!storeGroups[storeName]) storeGroups[storeName] = [];
        storeGroups[storeName].push({
          name: p.name || "Item",
          price: p.price || 0,
        });
      });
    }

    const stores = Object.keys(storeGroups).map((storeName) => ({
      storeName,
      items: storeGroups[storeName],
    }));

    setSelectedReceipt({
      id: item.id,
      date: new Date(item.dateCreated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      totalItems,
      totalPrice: item.total,
      stores,
    });
  };

  return (
    <View style={styles.container}>
      {/*  */}
      <View style={styles.overview}>
        <Text style={styles.overviewHeader}>Spending overview</Text>
        <View style={styles.overviewCardsContent}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              Today
            </Text>
            <Text style={styles.overviewCardPriceText}>₱{thisDayTotalFilter}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              This week
            </Text>
            <Text style={styles.overviewCardPriceText}>₱{weekTotalFilter}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              This month
            </Text>
            <Text style={styles.overviewCardPriceText}>₱{monthTotalFilter}</Text>
          </View>
        </View>
      </View>
      {/*  */}
      <View style={styles.divider} />
      {/*  */}
      <View style={styles.receiptContainer}>
        <Text style={styles.overviewHeader}>Recent receipts</Text>
        <View style={styles.receiptContainerList}>
          <FlatList
            data={montlyFilterShowList}
            keyExtractor={(r) => r.id}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentInsetAdjustmentBehavior="never"
            contentContainerStyle={styles.receiptListContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.receiptContent}
                onPress={() => handlePressReceipt(item)}
              >
                <View style={styles.receiptIconBg}>
                  <ReceiptText color={"#1E764F"} />
                </View>
                <View style={styles.receiptIdTextContent}>
                  <Text style={styles.receiptIdText}>{item.id}</Text>
                  <Text style={styles.receiptIdDate}>{formatDateList(item.dateCreated)}</Text>
                </View>
                <View style={styles.receiptTotalPriceContent}>
                  <Text style={styles.receiptTotalPriceText}>₱{item.total}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.receiptDivider} />}
            style={styles.receiptList}
          />
        </View>
      </View>
      <ReceiptModal
        visible={!!selectedReceipt}
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onDelete={() => {
          console.log("Delete receipt", selectedReceipt?.id);
          setSelectedReceipt(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overview: {
    gap: 8,
  },
  overviewHeader: {
    fontSize: 20,
    fontWeight: 600,
  },
  overviewCardsContent: {
    flexDirection: "row",
    gap: 8,
  },

  overviewCard: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "white",
  },
  overviewCardText: {
    color: "#7D8A81",
    fontSize: 16,
    fontWeight: 500,
  },
  overviewCardPriceText: {
    color: "#126F46",
    fontSize: 24,
    fontWeight: 700,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E5E1",
    width: "100%",
    marginVertical: 8,
  },
  receiptContainer: {
    flex: 1,
    gap: 8,
    marginBottom: 16,
  },
  receiptContainerList: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  receiptList: {
    flex: 1,
  },
  receiptListContent: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  receiptContent: {
    alignContent: "center",
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },
  receiptIconBg: {
    padding: 12,
    backgroundColor: "#E6EEE7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  receiptIdTextContent: {
    flex: 2,
  },
  receiptIdText: {
    fontSize: 18,
    fontWeight: 600,
  },
  receiptIdDate: {
    color: "#839087",
  },
  receiptTotalPriceContent: {
    alignSelf: "center",
  },
  receiptTotalPriceText: {
    fontSize: 20,
    fontWeight: 600,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#E0E5E1",
    marginHorizontal: 12,
    marginVertical: 4,
  },
});
export default ListReceipt;
