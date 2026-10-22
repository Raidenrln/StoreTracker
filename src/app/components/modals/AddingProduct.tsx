import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import {
  Button,
  Column,
  DropdownMenu,
  DropdownMenuItem,
  Host,
  ModalBottomSheet,
  OutlinedButton,
  OutlinedTextField,
  Row,
  Shape,
  Spacer,
  Text,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { useState, type Dispatch, type SetStateAction } from "react";
import uuid from "react-native-uuid";

interface AddingProductModel {
  onClose: Dispatch<SetStateAction<boolean>>;
}

const categories = ["Meat", "Vegetables", "Drinks", "Pantry"];
const units = ["per piece", "per liter", "per kilo"];
const stores = ["Aling Nena Sari-Sari"];
const green = "#15714A";
const ink = "#172D22";
const outline = "#CAD8CC";
const fieldShape = Shape.RoundedCorner({
  cornerRadii: { topStart: 14, topEnd: 14, bottomStart: 14, bottomEnd: 14 },
});
const chipShape = Shape.RoundedCorner({
  cornerRadii: { topStart: 24, topEnd: 24, bottomStart: 24, bottomEnd: 24 },
});
const buttonShape = Shape.RoundedCorner({
  cornerRadii: { topStart: 16, topEnd: 16, bottomStart: 16, bottomEnd: 16 },
});
const fieldColors = {
  focusedTextColor: ink,
  unfocusedTextColor: ink,
  cursorColor: green,
  focusedIndicatorColor: green,
  unfocusedIndicatorColor: outline,
  focusedPlaceholderColor: "#858B87",
  unfocusedPlaceholderColor: "#858B87",
};

export default function AddingProduct({ onClose }: AddingProductModel) {
  const now = new Date();
  const productName = useNativeState("");
  const price = useNativeState("");
  const [category, setCategory] = useState("Meat");
  const [unit, setUnit] = useState("");
  const [store, setStore] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const { addProduct } = useProduct();
  const { stores } = useStore();
  const addNewProduct = () => {
    const newProduct = {
      id: uuid.v4(),
      name: productName.value,
      dateCreated: String(now),
      price: Number(price.value),
      storeBelong: store,
      boughtQuantity: 0,
      category: category,
      priceHistory: [],
      unit: unit,
    };
    addProduct(newProduct);
    onClose(false);
  };
  const storeNameShow = stores.find((s) => s.id === store);
  return (
    <Host matchContents>
      <ModalBottomSheet
        onDismissRequest={() => onClose(false)}
        containerColor="#FFFFFF"
        contentColor={ink}
        scrimColor="#10211780"
        skipPartiallyExpanded
        sheetGesturesEnabled
      >
        <Column
          verticalArrangement={{ spacedBy: 14 }}
          modifiers={[fillMaxWidth(), height(580), padding(22, 0, 22, 20)]}
        >
          <Row verticalAlignment="center">
            <Text color={ink} style={{ fontSize: 23, fontWeight: "bold" }}>
              Add product
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Button
              onClick={() => onClose(false)}
              colors={{ containerColor: "#FFFFFF", contentColor: "#5B6D62" }}
              contentPadding={{ start: 4, top: 4, end: 4, bottom: 4 }}
            >
              <Text style={{ fontSize: 27 }}>×</Text>
            </Button>
          </Row>

          <Column verticalArrangement={{ spacedBy: 6 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Product name
            </Text>
            <OutlinedTextField
              value={productName}
              singleLine
              shape={fieldShape}
              colors={fieldColors}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Placeholder>
                <Text color="#858B87">e.g. Cooking oil</Text>
              </OutlinedTextField.Placeholder>
            </OutlinedTextField>
          </Column>

          <Column verticalArrangement={{ spacedBy: 6 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Category
            </Text>
            <DropdownMenu expanded={categoryOpen} onDismissRequest={() => setCategoryOpen(false)}>
              <DropdownMenu.Trigger>
                <OutlinedButton
                  onClick={() => setCategoryOpen(true)}
                  shape={fieldShape}
                  colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                  modifiers={[fillMaxWidth(), height(52)]}
                >
                  <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
                    <Text color={ink}>{category}</Text>
                    <Spacer modifiers={[weight(1)]} />
                    <Text color={ink} style={{ fontSize: 20 }}>
                      ⌄
                    </Text>
                  </Row>
                </OutlinedButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Items>
                {categories.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setCategoryOpen(false);
                    }}
                  >
                    <DropdownMenuItem.Text>
                      <Text>{item}</Text>
                    </DropdownMenuItem.Text>
                  </DropdownMenuItem>
                ))}
              </DropdownMenu.Items>
            </DropdownMenu>
          </Column>

          <Column verticalArrangement={{ spacedBy: 7 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Unit type
            </Text>
            <Row horizontalArrangement={{ spacedBy: 8 }}>
              {units.map((item) => {
                const selected = unit === item;
                const ChipButton = selected ? Button : OutlinedButton;
                return (
                  <ChipButton
                    key={item}
                    onClick={() => setUnit(item)}
                    shape={chipShape}
                    colors={
                      selected
                        ? { containerColor: green, contentColor: "#FFFFFF" }
                        : { containerColor: "#FFFFFF", contentColor: ink }
                    }
                    modifiers={[height(42)]}
                  >
                    <Text color={selected ? "#FFFFFF" : ink}>{item}</Text>
                  </ChipButton>
                );
              })}
            </Row>
          </Column>

          <Column verticalArrangement={{ spacedBy: 6 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Price (₱)
            </Text>
            <OutlinedTextField
              value={price}
              singleLine
              shape={fieldShape}
              colors={fieldColors}
              keyboardOptions={{ keyboardType: "decimal" }}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Placeholder>
                <Text color="#858B87">0.00</Text>
              </OutlinedTextField.Placeholder>
            </OutlinedTextField>
          </Column>

          <Column verticalArrangement={{ spacedBy: 6 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Store
            </Text>
            <DropdownMenu expanded={storeOpen} onDismissRequest={() => setStoreOpen(false)}>
              <DropdownMenu.Trigger>
                <OutlinedButton
                  onClick={() => setStoreOpen(true)}
                  shape={fieldShape}
                  colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                  modifiers={[fillMaxWidth(), height(52)]}
                >
                  <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
                    <Text color={ink}>{storeNameShow?.name}</Text>
                    <Spacer modifiers={[weight(1)]} />
                    <Text color={ink} style={{ fontSize: 20 }}>
                      ⌄
                    </Text>
                  </Row>
                </OutlinedButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Items>
                {stores.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => {
                      setStore(item.id);
                      setStoreOpen(false);
                    }}
                  >
                    <DropdownMenuItem.Text>
                      <Text>{item.name}</Text>
                    </DropdownMenuItem.Text>
                  </DropdownMenuItem>
                ))}
              </DropdownMenu.Items>
            </DropdownMenu>
          </Column>

          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <OutlinedButton
              onClick={() => onClose(false)}
              shape={buttonShape}
              colors={{ containerColor: "#FFFFFF", contentColor: green }}
              modifiers={[weight(1), height(54)]}
            >
              <Text color={green} style={{ fontWeight: "600" }}>
                Cancel
              </Text>
            </OutlinedButton>
            <Button
              onClick={() => addNewProduct()}
              shape={buttonShape}
              colors={{ containerColor: green, contentColor: "#FFFFFF" }}
              modifiers={[weight(1), height(54)]}
            >
              <Text color="#FFFFFF" style={{ fontWeight: "bold" }}>
                Save product
              </Text>
            </Button>
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
