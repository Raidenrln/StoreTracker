import { useReceipt } from "@/context/ReceiptContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarReceiptList from "../../components/CalendarReceiptList";
import ListReceipt from "../../components/ListReceipt";
import SettingsButton from "../../components/SettingsButton";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import ReceiptModal, { type ReceiptDetails } from "../../components/modals/ReceiptModal";
const Receipt = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDetails | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteReceipt } = useReceipt();
  const showToast = useToast();
  const confirmReceiptDelete = () => {
    if (selectedReceipt) {
      deleteReceipt(selectedReceipt.id);
      showToast("Receipt deleted");
    }
    setConfirmDelete(false);
    setSelectedReceipt(null);
  };
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Receipts</Text>
              <Text style={styles.subtitle}>Track your purchases and spending</Text>
            </View>
            <Pressable style={styles.settingsButton} accessibilityLabel="Receipt settings">
              <SettingsButton />
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
          {activeTab === "list" && <ListReceipt onSelectReceipt={setSelectedReceipt} />}
          {activeTab === "calendar" && <CalendarReceiptList onSelectReceipt={setSelectedReceipt} />}
        </View>
      </View>
      <ReceiptModal
        visible={!!selectedReceipt}
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onDelete={() => setConfirmDelete(true)}
      />
      <ConfirmDeleteModal
        visible={confirmDelete}
        itemName="receipt"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={confirmReceiptDelete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    gap: 14,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
  },
  subtitle: {
    color: "#718078",
    fontSize: 14,
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#CAD8CA",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
