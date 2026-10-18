import { FlatList, Text, View } from "react-native";
import { SampleTindahan } from "../(tabs)/store";

interface StoreListModel {
  stores: SampleTindahan[];
}

const StoreList = ({ stores }: StoreListModel) => {
  return (
    <FlatList
      data={stores}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.category}</Text>
          <Text>
            {item.openTime} - {item.closeTime}
          </Text>
        </View>
      )}
    />
  );
};

export default StoreList;
