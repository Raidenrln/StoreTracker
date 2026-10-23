import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./ModalUI";

export default function ConfirmDeleteModal({
  visible,
  itemName,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Delete {itemName}?</Text>
          <Text style={styles.message}>This {itemName} will be permanently removed.</Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.delete}>
              <Text style={styles.deleteText}>Delete</Text>
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
  message: { color: colors.muted, fontSize: 15 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 20, marginTop: 8 },
  cancel: { padding: 8 },
  cancelText: { color: colors.green, fontWeight: "700" },
  delete: { padding: 8 },
  deleteText: { color: "#A12B24", fontWeight: "700" },
});
