import { SunDim } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarReceiptList from "../components/CalendarReceiptList";
import ListReceipt from "../components/ListReceipt";
const Receipt = () => {
  const [activeTab, setActiveTab] = useState("list");
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Receipts </Text>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>
          {/*  */}
          <View style={styles.categoryTabContainer}>
            <View style={styles.categoryTabContent}>
              <Pressable
                style={activeTab === "list" ? styles.ActivecategoryButton : styles.categoryButton}
                onPress={() => setActiveTab("list")}
              >
                <Text
                  style={activeTab === "list" ? styles.ActivecategoryText : styles.categoryText}
                >
                  List
                </Text>
              </Pressable>
              <Pressable
                style={
                  activeTab === "calendar" ? styles.ActivecategoryButton : styles.categoryButton
                }
                onPress={() => setActiveTab("calendar")}
              >
                <Text
                  style={activeTab === "calendar" ? styles.ActivecategoryText : styles.categoryText}
                >
                  Calendar
                </Text>
              </Pressable>
            </View>
          </View>

          {/*  */}
          {activeTab === "list" && <ListReceipt />}
          {activeTab === "calendar" && <CalendarReceiptList />}
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  categoryTabContainer: {
    backgroundColor: "#E6EEE7",
    gap: 4,
    borderRadius: 12,
  },
  categoryTabContent: {
    justifyContent: "space-around",
    flexDirection: "row",
    padding: 4,
    gap: 4,
  },
  ActivecategoryButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#17724A",
    paddingVertical: 16,
    borderRadius: 12,
  },
  categoryButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  ActivecategoryText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },
  categoryText: {
    color: "#2C4636",
    fontWeight: 600,
    fontSize: 16,
  },
});
export default Receipt;
