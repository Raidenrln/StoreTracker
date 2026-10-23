import { useStore, type StoreDataModel } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import { Clock, Eye, Pencil, Trash } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

interface StoreCardProps {
  stores: StoreDataModel;
  currentTime: Date;
  onViewDetails: () => void;
  onEdit: () => void;
}

const parseTime = (time: string) => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === "PM" ? 12 : 0);
  } else if (hours > 23) {
    return null;
  }
  return hours * 60 + minutes;
};

const formatTime = (time: string) => {
  const minutes = parseTime(time);
  if (minutes === null) return time || "--:--";
  const value = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return value.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
};

const StoreCard = ({ stores, currentTime, onViewDetails, onEdit }: StoreCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deleteStore } = useStore();
  const showToast = useToast();
  const openMinute = parseTime(stores.openTime);
  const closeMinute = parseTime(stores.closeTime);
  const nowMinute = currentTime.getHours() * 60 + currentTime.getMinutes();
  const isOpen =
    openMinute !== null &&
    closeMinute !== null &&
    (openMinute === closeMinute
      ? false
      : openMinute < closeMinute
        ? nowMinute >= openMinute && nowMinute < closeMinute
        : nowMinute >= openMinute || nowMinute < closeMinute);

  return (
    <View style={styles.content}>
      <View style={styles.storeNameContent}>
        <Text style={styles.storeName} ellipsizeMode="tail" numberOfLines={1}>
          {stores.name}
        </Text>
        <View style={[styles.storeStatusBadge, isOpen ? styles.openBadge : styles.closedBadge]}>
          <Text
            style={[
              styles.storeStatusText,
              isOpen ? styles.openStatusText : styles.closedStatusText,
            ]}
          >
            {isOpen ? "Open" : "Closed"}
          </Text>
        </View>
      </View>

      <View style={styles.storeCategoryBadge}>
        <Text style={styles.storeCategoryText}>{stores.category}</Text>
      </View>

      <View style={styles.storeBottomContent}>
        <View style={styles.storeTimeContent}>
          <Clock color="#56675C" size={16} />
          <Text style={styles.storeTimeText}>
            {formatTime(stores.openTime)} - {formatTime(stores.closeTime)}
          </Text>
        </View>
        <View style={styles.storeButtonsContent}>
          <Pressable
            style={styles.storeButtons}
            onPress={onViewDetails}
            accessibilityLabel="View store details"
          >
            <Eye color="#006134" />
          </Pressable>
          <Pressable style={styles.storeButtons} onPress={onEdit} accessibilityLabel="Edit store">
            <Pencil color="#006134" />
          </Pressable>
          <Pressable
            style={styles.storeButtonsDelete}
            onPress={() => setConfirmDelete(true)}
            accessibilityLabel="Delete store"
          >
            <Trash color="#852111" />
          </Pressable>
        </View>
      </View>

      <ConfirmDeleteModal
        visible={confirmDelete}
        itemName={stores.name}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteStore(stores.id);
          setConfirmDelete(false);
          showToast("Store deleted");
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
  storeNameContent: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  storeName: { fontSize: 20, fontWeight: 600, flexShrink: 1 },
  storeStatusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  storeStatusText: { fontWeight: 600 },
  openBadge: { backgroundColor: "#DDF1E5" },
  closedBadge: { backgroundColor: "#FCE8E6" },
  openStatusText: { color: "#286D4D" },
  closedStatusText: { color: "#A12B24" },
  storeCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E6EEE7",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  storeCategoryText: { color: "#334C3C", fontWeight: 600 },
  storeBottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  storeTimeContent: { flexDirection: "row", alignItems: "center", gap: 4 },
  storeTimeText: { color: "#56675C", marginTop: -1 },
  storeButtonsContent: { flexDirection: "row", gap: 12 },
  storeButtons: { borderWidth: 1, padding: 8, borderRadius: 12, borderColor: "#006134" },
  storeButtonsDelete: { borderWidth: 1, padding: 8, borderRadius: 12, borderColor: "#E5BEB7" },
});

export default StoreCard;
