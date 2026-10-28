import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function SettingsButton() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        router.replace("/(tabs)/settings");
      }}
    >
      <Settings size={24} color="#12281c" strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#cfd8cf",
    alignItems: "center",
    justifyContent: "center",
  },
});
