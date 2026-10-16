import { SunDim } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Dashboard = () => {
  return (
    <SafeAreaView edges={["top", "bottom"]}>
      <View style={style.container}>
        <View style={style.content}>
          <View style={style.header}>
            <View>
              <Text>Good Day</Text>
              <Text style={style.title}>Dashboard</Text>
            </View>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    height: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
});
export default Dashboard;
