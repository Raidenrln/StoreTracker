import { ReceiptText } from "lucide-react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";

const ListReceipt = () => {
  const receipts = [
    { id: "REC-000000000001", date: "Oct 19", total: 142 },
    { id: "REC-000000000002", date: "Oct 18", total: 300 },
    { id: "REC-000000000003", date: "Oct 17", total: 552 },
  ];
  return (
    <View>
      {/*  */}
      <View style={styles.overview}>
        <Text style={styles.overviewHeader}>Spending overview</Text>
        <View style={styles.overviewCardsContent}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              Today
            </Text>
            <Text style={styles.overviewCardPriceText}>₱10</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              This week
            </Text>
            <Text style={styles.overviewCardPriceText}>₱10</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewCardText} numberOfLines={1} adjustsFontSizeToFit>
              This month
            </Text>
            <Text style={styles.overviewCardPriceText}>₱10</Text>
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
            data={receipts}
            keyExtractor={(r) => r.id}
            renderItem={({ item }) => (
              <View style={styles.receiptContent}>
                <View style={styles.receiptIconBg}>
                  <ReceiptText color={"#1E764F"} />
                </View>
                <View style={styles.receiptIdTextContent}>
                  <Text style={styles.receiptIdText}>{item.id}</Text>
                  <Text style={styles.receiptIdDate}>{item.date}</Text>
                </View>
                <View style={styles.receiptTotalPriceContent}>
                  <Text style={styles.receiptTotalPriceText}>₱{item.total}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.receiptDivider} />}
            style={{ gap: 16 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    gap: 8,
  },
  receiptContainerList: {
    backgroundColor: "white",
    borderRadius: 12,
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
