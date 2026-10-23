import { SunDim } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Dashboard = () => {
  const now = new Date();
  const dateFormat = now.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
  });
  const getDay = now.toLocaleDateString("en-US", {
    weekday: "long",
  });
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <View style={style.container}>
        <View style={style.content}>
          <View style={style.header}>
            <View>
              <View style={style.date}>
                <Text>{dateFormat}</Text>
                <Text>{getDay}</Text>
              </View>

              <Text style={style.title}>Dashboard</Text>
            </View>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>
          {/*  */}
          <View style={style.trackedCard}>
            <View style={style.trackedProductStore}>
              <View style={style.storeOpenCard}>
                <Text style={style.trackedNumber}>7</Text>
                <Text>Store open now</Text>
              </View>
              <View style={style.storeOpenCard}>
                <Text style={style.trackedNumber}>48</Text>
                <Text>Products tracked</Text>
              </View>
            </View>

            <View style={style.totalSpendCard}>
              <Text style={style.totalSpendTitle}>Total spend</Text>
              <View style={style.totalSpendCardsContent}>
                <View style={style.totalSpendTodayCard}>
                  <Text style={style.titleSpend}>Today</Text>
                  <Text style={style.spendValue}>₱ 0</Text>
                </View>
                <View style={style.totalSpendTodayCard}>
                  <Text style={style.titleSpend}>This week</Text>
                  <Text style={style.spendValue}>₱ 132</Text>
                </View>
                <View style={style.totalSpendTodayCard}>
                  <Text style={style.titleSpend}>This month</Text>
                  <Text style={style.spendValue}>₱ 678</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
    backgroundColor: "#F3F6F1",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  header: {
    height: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  date: {
    flexDirection: "row",
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
  },
  trackedCard: {
    flexDirection: "column",
    gap: 12,
  },
  storeOpenCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderColor: "#DFE7DE",
    borderRadius: 16,
  },
  trackedProductStore: {
    flexDirection: "row",
    gap: 12,
  },
  trackedNumber: {
    color: "#13261B",
    fontSize: 48,
    fontWeight: 700,
  },
  //
  totalSpendCard: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#DFE7DE",
    flexDirection: "column",
    backgroundColor: "white",
  },
  totalSpendTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  totalSpendCardsContent: {
    gap: 6,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  totalSpendTodayCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F3F6F1",
  },
  titleSpend: {
    fontSize: 16,
    color: "#293B30",
  },
  spendValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#293B30",
  },
});
export default Dashboard;
