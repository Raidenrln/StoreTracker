import { SunDim } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const cart = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={style.container}>
        <View style={style.content}>
          <View style={style.header}>
            <View>
              <Text style={style.title}>Cart</Text>
            </View>
            <Pressable>
              <SunDim size={36} />
            </Pressable>
          </View>
          {/*  */}
          <View style={{ flexDirection: "column", gap: 12 }}>
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#bcbcbc",
                borderRadius: 12,
              }}
            >
              <View style={{ flexDirection: "column", padding: 8, gap: 8 }}>
                <View>
                  <Text style={{ color: "#19734C", fontSize: 16, fontWeight: 600 }}>
                    Aling Nena Sari-Sari
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontWeight: 600, fontSize: 16 }}>Cooking oil</Text>
                    <Text style={{ color: "#8B978F", fontSize: 12 }}>₱102 per liter</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Pressable
                      style={{
                        width: 28,
                        height: 28,
                        borderWidth: 1,
                        borderColor: "#8B978F",
                        borderRadius: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18, textAlign: "center", fontWeight: 700 }}>-</Text>
                    </Pressable>
                    <View>
                      <Text style={{ textAlign: "center", marginTop: 4, fontWeight: 600 }}>1L</Text>
                    </View>
                    <Pressable
                      style={{
                        width: 28,
                        height: 28,
                        borderWidth: 1,
                        borderColor: "#8B978F",
                        borderRadius: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18, textAlign: "center", fontWeight: 400 }}>+</Text>
                    </Pressable>
                  </View>
                  <Text
                    style={{ textAlign: "center", marginTop: 4, fontWeight: 600, fontSize: 16 }}
                  >
                    ₱102
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#bcbcbc",
                borderRadius: 12,
              }}
            >
              <View style={{ flexDirection: "column", padding: 8, gap: 8 }}>
                <View>
                  <Text style={{ color: "#19734C", fontSize: 16, fontWeight: 600 }}>
                    Mabalacat Public Market
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontWeight: 600, fontSize: 16 }}>Cooking oil</Text>
                    <Text style={{ color: "#8B978F", fontSize: 12 }}>₱102 per liter</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                  >
                    <Pressable
                      style={{
                        width: 28,
                        height: 28,
                        borderWidth: 1,
                        borderColor: "#8B978F",
                        borderRadius: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18, textAlign: "center", fontWeight: 700 }}>-</Text>
                    </Pressable>
                    <View>
                      <Text style={{ textAlign: "center", marginTop: 4, fontWeight: 600 }}>1L</Text>
                    </View>
                    <Pressable
                      style={{
                        width: 28,
                        height: 28,
                        borderWidth: 1,
                        borderColor: "#8B978F",
                        borderRadius: "100%",
                      }}
                    >
                      <Text style={{ fontSize: 18, textAlign: "center", fontWeight: 400 }}>+</Text>
                    </Pressable>
                  </View>
                  <Text
                    style={{ textAlign: "center", marginTop: 4, fontWeight: 600, fontSize: 16 }}
                  >
                    ₱102
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
    backgroundColor: "#F3F6F1",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  header: {
    height: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
  },
});

export default cart;
