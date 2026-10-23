import { useCart } from "@/context/CartContext";
import type { ProductDataModel } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import type { ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  Button,
  Column,
  Host,
  LazyColumn,
  ModalBottomSheet,
  OutlinedButton,
  Row,
  Spacer,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Children, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { ActionButton, colors, Muted, shapes } from "./ModalUI";

export default function CompareProductModal({
  product,
  onClose,
}: {
  product: ProductDataModel;
  onClose: () => void;
}) {
  const { products } = useProduct();
  const { stores } = useStore();
  const { addToCart } = useCart();
  const matchingProducts = products.filter(
    (item) =>
      item.name.trim().toLowerCase() === product.name.trim().toLowerCase() &&
      item.unit === product.unit,
  );
  const sortedProducts = matchingProducts.slice().sort((a, b) => a.price - b.price);
  const [selectedId, setSelectedId] = useState(product.id);
  const selectedProduct =
    sortedProducts.find((item) => item.id === selectedId) ?? sortedProducts[0];
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const { height: screenHeight } = useWindowDimensions();
  const close = async () => {
    await sheetRef.current?.hide();
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
            <Text
              color={colors.ink}
              style={{ fontSize: 23, fontWeight: "bold" }}
            >{`Compare: ${product.name}`}</Text>
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
            modifiers={[fillMaxWidth(), height(Math.round(screenHeight * 0.5))]}
          >
            {Children.toArray(
              <>
                <Muted>
                  {`${product.category} · prices per ${product.unit.replace("per ", "")}, lowest first`}
                </Muted>
                {sortedProducts.map((item, index) => {
                  const store = stores.find((candidate) => candidate.id === item.storeBelong);
                  const selected = selectedId === item.id;
                  const textColor = selected ? "#FFFFFF" : colors.ink;
                  const subColor = selected ? "#FFFFFF" : colors.muted;
                  // Selected rows fill green; unselected rows are outlined.
                  const Card = selected ? Button : OutlinedButton;
                  return (
                    <Card
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      shape={shapes.field}
                      colors={
                        selected
                          ? { containerColor: colors.green, contentColor: "#FFFFFF" }
                          : { containerColor: "#FFFFFF", contentColor: colors.ink }
                      }
                      modifiers={[fillMaxWidth()]}
                    >
                      <Column modifiers={[fillMaxWidth(), padding(0, 8, 0, 8)]}>
                        <Row verticalAlignment="center">
                          <Text color={textColor} style={{ fontSize: 17, fontWeight: "bold" }}>
                            {`${selected ? "✓ " : ""}${store?.name ?? "Unknown store"}`}
                          </Text>
                          <Spacer modifiers={[weight(1)]} />
                          <Text color={textColor} style={{ fontSize: 17, fontWeight: "bold" }}>
                            {`₱${item.price.toFixed(2)}`}
                          </Text>
                        </Row>
                        <Text color={subColor} style={{ fontSize: 14 }}>
                          {`${
                            item.id === product.id
                              ? "Compared product"
                              : `₱${(item.price - product.price).toFixed(2)} difference`
                          }${index === 0 ? " · Lowest" : ""}`}
                        </Text>
                      </Column>
                    </Card>
                  );
                })}
                {sortedProducts.length === 0 ? (
                  <Muted>No matching products at other stores yet.</Muted>
                ) : null}
              </>,
            )}
          </LazyColumn>
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Close" secondary onPress={onClose} />
            <ActionButton
              label="Add selected to cart"
              onPress={() => {
                if (selectedProduct)
                  addToCart({
                    id: selectedProduct.id,
                    quantity: 0,
                    storeBelong: selectedProduct.storeBelong,
                  });
                onClose();
              }}
            />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
