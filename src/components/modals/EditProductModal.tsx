import { useCategories } from "@/context/CategoriesContext";
import type { ProductDataModel } from "@/context/ProductContext";
import type { StoreDataModel } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import type { ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  Button,
  Column,
  Host,
  LazyColumn,
  ModalBottomSheet,
  Row,
  Spacer,
  Text,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Children, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  ActionButton,
  ChipGroup,
  ChoiceChip,
  ErrorText,
  FormField,
  Label,
  Muted,
  colors,
} from "./ModalUI";

export default function EditProductModal({
  product,
  stores,
  onClose,
  onSave,
}: {
  product: ProductDataModel;
  stores: StoreDataModel[];
  onClose: () => void;
  onSave: (product: ProductDataModel) => void;
}) {
  const { productCategories: categories, unitTypes: units } = useCategories();
  const showToast = useToast();
  const name = useNativeState(product.name);
  const price = useNativeState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [unit, setUnit] = useState(product.unit);
  const [storeId, setStoreId] = useState(product.storeBelong);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const { height: screenHeight } = useWindowDimensions();
  const close = async () => {
    await sheetRef.current?.hide();
    onClose();
  };

  const save = () => {
    const next: Record<string, string> = {};
    const numericPrice = Number(price.value);
    if (!name.value.trim()) next.name = "Product name is required";
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      next.price = "Enter a valid price greater than 0";
    }
    if (!stores.some((store) => store.id === storeId)) {
      next.store = stores.length > 0 ? "Choose a store" : "Add a store before saving this product";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const priceHistory =
      numericPrice === product.price
        ? product.priceHistory
        : [
            ...product.priceHistory,
            {
              previousPrice: product.price,
              newPrice: numericPrice,
              changedAt: new Date().toISOString(),
            },
          ];
    onSave({
      ...product,
      name: name.value.trim(),
      price: numericPrice,
      category,
      unit,
      storeBelong: storeId,
      priceHistory,
    });
    showToast("Product updated");
    onClose();
  };

  return (
    <Host matchContents>
      <ModalBottomSheet
        ref={sheetRef}
        onDismissRequest={onClose}
        containerColor="#FFFFFF"
        contentColor={colors.ink}
        scrimColor="#10211780"
        skipPartiallyExpanded
        sheetGesturesEnabled
      >
        <Column
          verticalArrangement={{ spacedBy: 14 }}
          modifiers={[fillMaxWidth(), padding(22, 0, 22, 20)]}
        >
          <Row verticalAlignment="center">
            <Text color={colors.ink} style={{ fontSize: 23, fontWeight: "bold" }}>
              Edit product
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Button
              onClick={close}
              colors={{ containerColor: "#FFFFFF", contentColor: "#5B6D62" }}
              contentPadding={{ start: 4, top: 4, end: 4, bottom: 4 }}
            >
              <Text style={{ fontSize: 27 }}>×</Text>
            </Button>
          </Row>
          <LazyColumn
            verticalArrangement={{ spacedBy: 14 }}
            modifiers={[fillMaxWidth(), height(Math.round(screenHeight * 0.6))]}
          >
            {Children.toArray(
              <>
                <FormField
                  label="Product name"
                  state={name}
                  placeholder="Enter a product name"
                  error={errors.name}
                />
                <Column verticalArrangement={{ spacedBy: 8 }}>
                  <Label>Category</Label>
                  <ChipGroup>
                    {categories.map((item) => (
                      <ChoiceChip
                        key={item}
                        label={item}
                        selected={category === item}
                        onPress={() => setCategory(item)}
                      />
                    ))}
                  </ChipGroup>
                </Column>
                <Column verticalArrangement={{ spacedBy: 8 }}>
                  <Label>Unit type</Label>
                  <ChipGroup>
                    {units.map((item) => (
                      <ChoiceChip
                        key={item}
                        label={item}
                        selected={unit === item}
                        onPress={() => setUnit(item)}
                      />
                    ))}
                  </ChipGroup>
                </Column>
                <FormField
                  label="Price (₱)"
                  state={price}
                  placeholder="0.00"
                  keyboardType="decimal"
                  error={errors.price}
                />
                <Column verticalArrangement={{ spacedBy: 8 }}>
                  <Label>Store</Label>
                  {stores.length > 0 ? (
                    <ChipGroup>
                      {stores.map((store) => (
                        <ChoiceChip
                          key={store.id}
                          label={store.name}
                          selected={storeId === store.id}
                          onPress={() => {
                            setStoreId(store.id);
                            setErrors((current) => ({ ...current, store: "" }));
                          }}
                        />
                      ))}
                    </ChipGroup>
                  ) : (
                    <Muted>Add a store before saving this product.</Muted>
                  )}
                  <ErrorText message={errors.store} />
                </Column>
              </>,
            )}
          </LazyColumn>
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Cancel" secondary onPress={onClose} />
            <ActionButton label="Save changes" onPress={save} />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
