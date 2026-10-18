import { Clock, Eye, Pencil, Trash } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SampleTindahan } from "../(tabs)/store";

interface StoreCardModel {
  stores: SampleTindahan;
}

const StoreCard = ({ stores }: StoreCardModel) => {
  return (
    <View style={styles.content}>
      <View style={styles.storeNameContent}>
        <Text style={styles.storeName} ellipsizeMode="tail" numberOfLines={1}>
          {stores.name}
        </Text>
        <View style={styles.storeStatusBadge}>
          <Text style={styles.storeStatusText}>Open</Text>
        </View>
      </View>

      {/*  */}
      <View style={styles.storeCategoryBadge}>
        <Text style={styles.storeCategoryText}>Grocery</Text>
      </View>
      {/*  */}
      <View style={styles.storeBottomContent}>
        <View style={styles.storeTimeContent}>
          <Clock color={"#56675C"} size={16} />
          <Text style={styles.storeTimeText}>8:00 AM - 9:00 PM</Text>
        </View>

        <View style={styles.storeButtonsContent}>
          <Pressable style={styles.storeButtons}>
            <Eye color={"#006134"} />
          </Pressable>
          <Pressable style={styles.storeButtons}>
            <Pencil color={"#006134"} />
          </Pressable>
          <Pressable style={styles.storeButtonsDelete}>
            <Trash color={"#852111"} style={styles.storeButtonIcons} />
          </Pressable>
        </View>
      </View>
      {/*  */}
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
  storeNameContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  storeName: {
    fontSize: 20,
    fontWeight: 600,
    flexShrink: 1,
  },
  storeCategoryContent: {
    flex: 1,
  },
  storeStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#DDF1E5",
  },
  storeStatusText: {
    color: "#286D4D",
    fontWeight: 600,
  },
  storeCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#E6EEE7",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  storeCategoryText: {
    color: "#334C3C",
    fontWeight: 600,
  },
  storeBottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  storeTimeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storeTimeIcon: {
    color: "#56675C",
  },
  storeTimeText: {
    color: "#56675C",
    marginTop: -1,
  },
  storeButtonsContent: {
    flexDirection: "row",
    gap: 12,
  },
  storeButtons: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    borderColor: "#006134",
  },
  storeButtonsDelete: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    borderColor: "#E5BEB7",
  },
  storeButtonIcons: {},
});

export default StoreCard;
