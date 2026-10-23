import { useCategories } from "@/context/CategoriesContext";
import { Check, Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// ---------- Colors ----------
const COLORS = {
  background: "#f4f6f1",
  card: "#ffffff",
  text: "#12281c",
  muted: "#6b7a70",
  green: "#1f7a4d",
  border: "#cfd8cf",
};

type ListName = "store" | "product" | "unit";

type ChipProps = { label: string; onRemove: () => void };

function Chip({ label, onRemove }: ChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <X size={18} color={COLORS.muted} />
      </Pressable>
    </View>
  );
}

// ---------- Section title + chips + dashed "+ Add" button ----------

type ChipSectionProps = {
  title: string;
  items: string[];
  onAdd: () => void;
  onRemove: (item: string) => void;
};

function ChipSection({ title, items, onAdd, onRemove }: ChipSectionProps) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipRow}>
        {items.map((item) => (
          <Chip key={item} label={item} onRemove={() => onRemove(item)} />
        ))}

        <Pressable style={styles.addButton} onPress={onAdd}>
          <Plus size={20} color={COLORS.green} />
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------- A row with a green checkbox ----------

type CheckRowProps = { label: string; checked: boolean; onToggle: () => void };

function CheckRow({ label, checked, onToggle }: CheckRowProps) {
  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={[styles.checkbox, !checked && styles.checkboxOff]}>
        {checked && <Check size={28} color="white" />}
      </View>
    </Pressable>
  );
}

// ---------- The screen ----------

export default function Settings() {
  const { storeCategories, productCategories, unitTypes, addCategory, removeCategory } =
    useCategories();
  const lists: Record<ListName, string[]> = {
    store: storeCategories,
    product: productCategories,
    unit: unitTypes,
  };

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [closingReminder, setClosingReminder] = useState(true);

  // Which list we're adding to (null = popup closed)

  const [adding, setAdding] = useState<ListName | null>(null);
  const [newName, setNewName] = useState("");

  function removeItem(listName: ListName, item: string) {
    removeCategory(listName, item);
  }

  function saveNewItem() {
    const name = newName.trim();
    if (adding && name !== "" && !lists[adding].includes(name)) {
      addCategory(adding, name);
    }
    setNewName("");
    setAdding(null);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Customize</Text>
        <Text style={styles.title}>Settings</Text>

        <ChipSection
          title="Store categories"
          items={lists.store}
          onAdd={() => setAdding("store")}
          onRemove={(item) => removeItem("store", item)}
        />

        <ChipSection
          title="Product categories"
          items={lists.product}
          onAdd={() => setAdding("product")}
          onRemove={(item) => removeItem("product", item)}
        />

        <ChipSection
          title="Unit types"
          items={lists.unit}
          onAdd={() => setAdding("unit")}
          onRemove={(item) => removeItem("unit", item)}
        />

        <Text style={styles.sectionTitle}>Alerts and app</Text>
        <View style={styles.card}>
          <CheckRow
            label="Price change alerts"
            checked={priceAlerts}
            onToggle={() => setPriceAlerts(!priceAlerts)}
          />
          <CheckRow
            label="Store closing reminder"
            checked={closingReminder}
            onToggle={() => setClosingReminder(!closingReminder)}
          />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Currency</Text>
            <Text style={styles.currency}>₱ PHP</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Backup and export</Text>
            <Text style={styles.mutedValue}>CSV</Text>
          </View>
        </View>
      </ScrollView>

      {/* Popup for typing a new item */}
      <Modal visible={adding !== null} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add new item</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Name"
              autoFocus
              onSubmitEditing={saveNewItem}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setNewName("");
                  setAdding(null);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveNewItem}>
                <Text style={styles.saveText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },

  subtitle: { fontSize: 16, color: COLORS.muted },
  title: { fontSize: 32, fontWeight: "700", color: COLORS.text },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 28,
    marginBottom: 12,
  },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
  },
  chipText: { fontSize: 16, color: COLORS.text },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 999,
  },
  addText: { fontSize: 16, color: COLORS.green },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e3e8e3",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  row: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: { fontSize: 17, color: COLORS.text },
  currency: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  mutedValue: { fontSize: 17, color: COLORS.muted },
  checkbox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOff: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 30,
  },
  modalBox: { backgroundColor: COLORS.card, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
    marginTop: 16,
  },
  cancelText: { fontSize: 16, color: COLORS.muted },
  saveText: { fontSize: 16, fontWeight: "700", color: COLORS.green },
});
