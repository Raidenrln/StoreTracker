import { StoreDataModel, useStore } from "@/context/StoreContext";
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
interface AddingStoreModel {
  onClose: Dispatch<SetStateAction<boolean>>;
}

const categories = ["Grocery", "Pharmacy", "Hardware", "Bakery"];
const green = "#15714A";
const ink = "#172D22";
const mutedGreen = "#CAD8CC";
const fieldShape = Shape.RoundedCorner({
  cornerRadii: { topStart: 14, topEnd: 14, bottomStart: 14, bottomEnd: 14 },
});
const buttonShape = Shape.RoundedCorner({
  cornerRadii: { topStart: 16, topEnd: 16, bottomStart: 16, bottomEnd: 16 },
});
const fieldColors = {
  focusedTextColor: ink,
  unfocusedTextColor: ink,
  cursorColor: green,
  focusedIndicatorColor: green,
  unfocusedIndicatorColor: mutedGreen,
  focusedPlaceholderColor: "#858B87",
  unfocusedPlaceholderColor: "#858B87",
};

export default function AddingStore({ onClose }: AddingStoreModel) {
  const storeName = useNativeState("");
  const opens = useNativeState("08:00 AM");
  const closes = useNativeState("09:00 PM");
  const facebook = useNativeState("");
  const [category, setCategory] = useState("Grocery");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { addingNewStore } = useStore();
  const addNewStore = () => {
    const store: StoreDataModel = {
      id: uuid.v4(),
      name: storeName.value,
      category: category,
      dateCreated: new Date().toISOString(),
      openTime: opens.value,
      closeTime: closes.value,
      facebookPage: facebook.value,
      products: [],
    };
    addingNewStore(store);
    onClose(false);
  };
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
          verticalArrangement={{ spacedBy: 16 }}
          modifiers={[fillMaxWidth(), padding(22, 0, 22, 20)]}
        >
          <Row verticalAlignment="center">
            <Text color={ink} style={{ fontSize: 23, fontWeight: "bold" }}>
              Add store
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

          <Column verticalArrangement={{ spacedBy: 7 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Store name
            </Text>
            <OutlinedTextField
              value={storeName}
              singleLine
              shape={fieldShape}
              colors={fieldColors}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Placeholder>
                <Text color="#858B87">e.g. Aling Nena Sari-Sari</Text>
              </OutlinedTextField.Placeholder>
            </OutlinedTextField>
          </Column>

          <Column verticalArrangement={{ spacedBy: 7 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Category
            </Text>
            <DropdownMenu expanded={categoryOpen} onDismissRequest={() => setCategoryOpen(false)}>
              <DropdownMenu.Trigger>
                <OutlinedButton
                  onClick={() => setCategoryOpen(true)}
                  shape={fieldShape}
                  colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                  modifiers={[fillMaxWidth(), height(54)]}
                >
                  <Row verticalAlignment="center" modifiers={[fillMaxWidth()]}>
                    <Text color={ink} style={{ fontSize: 16 }}>
                      {category}
                    </Text>
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

          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <Column verticalArrangement={{ spacedBy: 7 }} modifiers={[weight(1)]}>
              <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
                Opens
              </Text>
              <OutlinedTextField value={opens} singleLine shape={fieldShape} colors={fieldColors}>
                <OutlinedTextField.TrailingIcon>
                  <Text color={ink} style={{ fontSize: 19 }}>
                    ◷
                  </Text>
                </OutlinedTextField.TrailingIcon>
              </OutlinedTextField>
            </Column>
            <Column verticalArrangement={{ spacedBy: 7 }} modifiers={[weight(1)]}>
              <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
                Closes
              </Text>
              <OutlinedTextField value={closes} singleLine shape={fieldShape} colors={fieldColors}>
                <OutlinedTextField.TrailingIcon>
                  <Text color={ink} style={{ fontSize: 19 }}>
                    ◷
                  </Text>
                </OutlinedTextField.TrailingIcon>
              </OutlinedTextField>
            </Column>
          </Row>

          <Column verticalArrangement={{ spacedBy: 7 }}>
            <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
              Facebook page
            </Text>
            <OutlinedTextField
              value={facebook}
              singleLine
              shape={fieldShape}
              colors={fieldColors}
              keyboardOptions={{
                keyboardType: "uri",
                capitalization: "none",
                autoCorrectEnabled: false,
              }}
              modifiers={[fillMaxWidth()]}
            >
              <OutlinedTextField.Placeholder>
                <Text color="#858B87">facebook.com/storename</Text>
              </OutlinedTextField.Placeholder>
            </OutlinedTextField>
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
              onClick={() => addNewStore()}
              shape={buttonShape}
              colors={{ containerColor: green, contentColor: "#FFFFFF" }}
              modifiers={[weight(1), height(54)]}
            >
              <Text color="#FFFFFF" style={{ fontWeight: "bold" }}>
                Save store
              </Text>
            </Button>
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
