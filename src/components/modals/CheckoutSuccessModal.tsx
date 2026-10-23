import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function CheckoutSuccessModal({
  visible,
  receiptId,
  onClose,
}: {
  visible: boolean;
  receiptId: string;
  onClose: () => void;
}) {
  const [scale] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    if (visible) {
      scale.setValue(0.5);
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    }
  }, [visible, scale]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
            <Check size={38} color="white" strokeWidth={3} />
          </Animated.View>
          <Text style={styles.title}>Checkout complete!</Text>
          <Text style={styles.message}>Receipt {receiptId} was saved successfully.</Text>
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
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
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    alignItems: "center",
    padding: 28,
    gap: 12,
  },
  checkCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#15714A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { color: "#172D22", fontSize: 22, fontWeight: "700" },
  message: { color: "#647368", fontSize: 15, textAlign: "center" },
  button: {
    marginTop: 8,
    width: "100%",
    backgroundColor: "#15714A",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});
