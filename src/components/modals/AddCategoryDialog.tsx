import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "./ModalUI";

export default function AddCategoryDialog({
  visible,
  title,
  onCancel,
  onSave,
}: {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const cancel = () => {
    setName("");
    onCancel();
  };

  const save = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave(trimmedName);
    setName("");
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={cancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Category name"
            placeholderTextColor="#87938A"
            accessibilityLabel="Category name"
            returnKeyType="done"
            onSubmitEditing={save}
            style={styles.input}
          />
          <View style={styles.actions}>
            <Pressable onPress={cancel} accessibilityRole="button" style={styles.actionButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={save} accessibilityRole="button" style={styles.actionButton}>
              <Text style={styles.saveText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#10211780",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 22,
    gap: 12,
    elevation: 8,
  },
  title: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#CAD8CC",
    borderRadius: 14,
    paddingHorizontal: 14,
    color: colors.ink,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 20, marginTop: 8 },
  actionButton: { padding: 8 },
  cancelText: { color: colors.green, fontWeight: "700" },
  saveText: { color: colors.green, fontWeight: "700" },
});
