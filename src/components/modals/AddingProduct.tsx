import { useCategories } from "@/context/CategoriesContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
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
import AddCategoryDialog from "./AddCategoryDialog";

interface AddingProductModel {
  onClose: Dispatch<SetStateAction<boolean>>;
}

const green = "#15714A";
const errorRed = "#B3261E";
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
  const [category, setCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [unit, setUnit] = useState("");
  const [store, setStore] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addProduct } = useProduct();
  const showToast = useToast();
  const { stores } = useStore();
  const { productCategories: categories, unitTypes: units, addCategory } = useCategories();
  const selectedCategory = category || categories[0] || "";
  const validate = () => {
    const next: Record<string, string> = {};
    if (!productName.value.trim()) next.name = "Product name is required";
    if (!selectedCategory) next.category = "Category is required";
    if (!unit) next.unit = "Select a unit type";
    const priceText = price.value.trim();
    if (!priceText) next.price = "Price is required";
    else if (!(Number(priceText) > 0)) next.price = "Enter a valid price greater than 0";
    if (!store) next.store = "Select a store";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const addNewProduct = () => {
    if (!validate()) return;
    const newProduct = {
      id: uuid.v4(),
      name: productName.value.trim(),
      dateCreated: String(now),
      price: Number(price.value),
      storeBelong: store,
      boughtQuantity: 0,
      category: selectedCategory,
      priceHistory: [],
      unit: unit,
    };
    addProduct(newProduct);
    showToast("Product added");
    onClose(false);
  };
  const saveCategory = (name: string) => {
    addCategory("product", name);
    setCategory(name);
    setAddingCategory(false);
  };
  const storeNameShow = stores.find((s) => s.id === store);
  return (
    <>
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
            modifiers={[fillMaxWidth(), padding(22, 0, 22, 20)]}
          >
            <>
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
                {errors.name ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.name}
                  </Text>
                ) : null}
              </Column>

              <Column verticalArrangement={{ spacedBy: 6 }}>
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
                          modifiers={[fillMaxWidth(), height(52)]}
                        >
                          <Row
                            verticalAlignment="center"
                            modifiers={[fillMaxWidth(), padding(12, 0, 12, 0)]}
                          >
                            <Text color={ink}>
                              {category || categories[0] || "Select category"}
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
                  ) : (
                    <OutlinedButton
                      onClick={() =>
                        setErrors((current) => ({ ...current, category: "Add a category first" }))
                      }
                      shape={fieldShape}
                      colors={{ containerColor: "#FFFFFF", contentColor: ink }}
                      modifiers={[weight(1), height(52)]}
                    >
                      <Text color="#858B87">No categories yet</Text>
                    </OutlinedButton>
                  )}
                  <Button
                    onClick={() => setAddingCategory(true)}
                    shape={buttonShape}
                    colors={{ containerColor: green, contentColor: "#FFFFFF" }}
                    modifiers={[height(52)]}
                  >
                    <Text color="#FFFFFF">+ Add</Text>
                  </Button>
                </Row>
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
                {errors.unit ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.unit}
                  </Text>
                ) : null}
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
                {errors.price ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.price}
                  </Text>
                ) : null}
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
                        <Text color={ink}>{storeNameShow?.name ?? "Select store"}</Text>
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
                {errors.store ? (
                  <Text color={errorRed} style={{ fontSize: 12 }}>
                    {errors.store}
                  </Text>
                ) : null}
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
            </>
          </Column>
        </ModalBottomSheet>
      </Host>
      <AddCategoryDialog
        visible={addingCategory}
        title="New product category"
        onCancel={() => setAddingCategory(false)}
        onSave={saveCategory}
      />
    </>
  );
}
