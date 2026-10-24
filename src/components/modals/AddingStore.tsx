import { useCategories } from "@/context/CategoriesContext";
import { StoreDataModel, useStore } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
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
import {
  fillMaxWidth,
  height,
  padding,
  verticalScroll,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import { ChevronDown, Clock3, Plus, X } from "lucide-react-native";
import { useState, type Dispatch, type SetStateAction } from "react";
import uuid from "react-native-uuid";
import AddCategoryDialog from "./AddCategoryDialog";
import { NoTouch } from "./ModalUI";
interface AddingStoreModel {
  onClose: Dispatch<SetStateAction<boolean>>;
}

const green = "#15714A";
const ink = "#172D22";
const mutedGreen = "#CAD8CC";
const errorRed = "#B3261E";
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
  const [opens, setOpens] = useState(() => {
    const time = new Date();
    time.setHours(8, 0, 0, 0);
    return time;
  });
  const [closes, setCloses] = useState(() => {
    const time = new Date();
    time.setHours(21, 0, 0, 0);
    return time;
  });
  const [activeTimePicker, setActiveTimePicker] = useState<"opens" | "closes" | null>(null);
  const facebook = useNativeState("");
  const [category, setCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addingNewStore } = useStore();
  const showToast = useToast();
  const { storeCategories: categories, addCategory } = useCategories();
  const selectedCategory = category || categories[0] || "";
  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  const validate = () => {
    const next: Record<string, string> = {};
    if (!storeName.value.trim()) next.name = "Store name is required";
    if (!selectedCategory) next.category = "Category is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const addNewStore = () => {
    if (!validate()) return;
    const store: StoreDataModel = {
      id: uuid.v4(),
      name: storeName.value,
      category: selectedCategory,
      dateCreated: new Date().toISOString(),
      openTime: formatTime(opens),
      closeTime: formatTime(closes),
      facebookPage: facebook.value,
      products: [],
    };
    addingNewStore(store);
    showToast("Store added");
    onClose(false);
  };
  const saveCategory = (name: string) => {
    addCategory("store", name);
    setCategory(name);
    setAddingCategory(false);
  };
  return (
    <>
      <Host style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
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
            modifiers={[fillMaxWidth(), verticalScroll(), padding(22, 0, 22, 20)]}
          >
            <>
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
                  <NoTouch size={20}>
                    <X color="#5B6D62" size={24} />
                  </NoTouch>
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
                {errors.name ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.name}
                  </Text>
                ) : null}
              </Column>

              <Column verticalArrangement={{ spacedBy: 7 }}>
                <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
                  Category
                </Text>
                <Row horizontalArrangement={{ spacedBy: 8 }}>
                  {categories.length > 0 ? (
                    <DropdownMenu
                      expanded={categoryOpen}
                      onDismissRequest={() => setCategoryOpen(false)}
                      modifiers={[weight(1)]}
                    >
                      <DropdownMenu.Trigger>
                        <OutlinedButton
                          onClick={() => setCategoryOpen(true)}
                          shape={fieldShape}
                          colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                          modifiers={[fillMaxWidth(), height(54)]}
                        >
                          <Row
                            verticalAlignment="center"
                            modifiers={[fillMaxWidth(), padding(12, 0, 12, 0)]}
                          >
                            <Text color={ink} style={{ fontSize: 16 }}>
                              {category || categories[0] || "Select category"}
                            </Text>
                            <Spacer modifiers={[weight(1)]} />
                            <ChevronDown color={ink} size={18} />
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
                  ) : (
                    <OutlinedButton
                      onClick={() =>
                        setErrors((current) => ({ ...current, category: "Add a category first" }))
                      }
                      shape={fieldShape}
                      colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                      modifiers={[weight(1), height(54)]}
                    >
                      <Text color="#858B87">No categories yet</Text>
                    </OutlinedButton>
                  )}
                  <Button
                    onClick={() => setAddingCategory(true)}
                    shape={buttonShape}
                    colors={{ containerColor: green, contentColor: "#FFFFFF" }}
                    modifiers={[height(54)]}
                  >
                    <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}>
                      <Plus color="#FFFFFF" size={17} />
                      <Text color="#FFFFFF">Add</Text>
                    </Row>
                  </Button>
                </Row>
                {errors.category ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.category}
                  </Text>
                ) : null}
              </Column>

              <Row horizontalArrangement={{ spacedBy: 12 }}>
                <Column verticalArrangement={{ spacedBy: 7 }} modifiers={[weight(1)]}>
                  <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
                    Opens
                  </Text>
                  <OutlinedButton
                    onClick={() => setActiveTimePicker("opens")}
                    shape={fieldShape}
                    colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                    modifiers={[fillMaxWidth(), height(54)]}
                  >
                    <Row
                      verticalAlignment="center"
                      modifiers={[fillMaxWidth(), padding(12, 0, 12, 0)]}
                    >
                      <Text color={ink}>{formatTime(opens)}</Text>
                      <Spacer modifiers={[weight(1)]} />
                      <Clock3 color={ink} size={18} />
                    </Row>
                  </OutlinedButton>
                </Column>
                <Column verticalArrangement={{ spacedBy: 7 }} modifiers={[weight(1)]}>
                  <Text color={ink} style={{ fontSize: 14, fontWeight: "500" }}>
                    Closes
                  </Text>
                  <OutlinedButton
                    onClick={() => setActiveTimePicker("closes")}
                    shape={fieldShape}
                    colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                    modifiers={[fillMaxWidth(), height(54)]}
                  >
                    <Row
                      verticalAlignment="center"
                      modifiers={[fillMaxWidth(), padding(12, 0, 12, 0)]}
                    >
                      <Text color={ink}>{formatTime(closes)}</Text>
                      <Spacer modifiers={[weight(1)]} />
                      <Clock3 color={ink} size={18} />
                    </Row>
                  </OutlinedButton>
                </Column>
              </Row>

              {activeTimePicker ? (
                <DateTimePicker
                  mode="time"
                  value={activeTimePicker === "opens" ? opens : closes}
                  is24Hour={false}
                  accentColor={green}
                  onValueChange={(_event, selectedTime) => {
                    if (activeTimePicker === "opens") setOpens(selectedTime);
                    else setCloses(selectedTime);
                    setActiveTimePicker(null);
                  }}
                  onDismiss={() => setActiveTimePicker(null)}
                />
              ) : null}

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
            </>
          </Column>
        </ModalBottomSheet>
      </Host>
      <AddCategoryDialog
        visible={addingCategory}
        title="New store category"
        onCancel={() => setAddingCategory(false)}
        onSave={saveCategory}
      />
    </>
  );
}
