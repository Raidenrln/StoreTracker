import { Search, SunDim } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StoreCard from "../components/StoreCard";
export type SampleTindahan = {
  id: string;
  name: string;
  category: string;
  openTime: string;
  closeTime: string;
  facebook: string;
};

export const tindahan = [
  {
    id: "341312334521321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "341312321345343321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "34133124543321321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "341316543623213231",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "34133121231321321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "341312312123231321",
    name: "Aling Nena Sari-Sariiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "34131232332131321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
  {
    id: "34131213213321",
    name: "Aling Nena Sari-Sari",
    category: "Grocery",
    openTime: "08:00",
    closeTime: "20:00",
    facebook: "",
  },
];

export default function Store() {
  const category = ["All", "Grocery", "Pharmacy", "Hardware", "Bakery"];
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Stores Tracked</Text>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>
          {/* Search input content */}
          <View style={styles.searchContent}>
            <Search size={20} style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search stores" />
          </View>
          {/*  */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.categoryContent}
          >
            {category.map((item) => (
              <Pressable
                key={item}
                style={activeCategory === item ? styles.activeCategory : styles.categoryButtons}
                onPress={() => setActiveCategory(item)}
              >
                <Text
                  style={{
                    color: activeCategory === item ? "white" : "black",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {/* Store List content */}
          <View style={styles.storeListContent}>
            <FlatList
              data={tindahan}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <StoreCard stores={item} />}
              contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  searchContent: {
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#E4EBE4",
    borderRadius: 12,
    paddingLeft: 48,
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    color: "#647368",
    zIndex: 1,
    left: 12,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeCategory: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#17724A",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#17724A",
  },
  categoryButtons: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#C6D2C6",
  },
  storeListContent: {
    flex: 1,
    minHeight: 0,
    borderRadius: 24,
  },
});
