import { useCart } from "@/context/CartContext";
import type { ProductDataModel } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import type { StoreDataModel } from "@/context/StoreContext";
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
import { border, fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Children, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { ActionButton, Bold, colors, Muted, shapes, Tag } from "./ModalUI";

const smallPadding = { start: 6, end: 6, top: 0, bottom: 0 };

export default function StoreDetailsModal({
  store,
  onClose,
  onEdit,
  onEditProduct,
  onViewProduct,
  onCompareProduct,
}: {
  store: StoreDataModel;
  onClose: () => void;
  onEdit: () => void;
  onEditProduct: (product: ProductDataModel) => void;
  onViewProduct: (product: ProductDataModel) => void;
  onCompareProduct: (product: ProductDataModel) => void;
}) {
  const { products } = useProduct();
  const { addToCart } = useCart();
  const storeProducts = products.filter((product) => product.storeBelong === store.id);
  const openNow = isOpenNow(store.openTime, store.closeTime);
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
            <Text color={colors.ink} style={{ fontSize: 23, fontWeight: "bold" }}>
              {store.name}
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
            modifiers={[fillMaxWidth(), height(Math.round(screenHeight * 0.5))]}
          >
            {Children.toArray(
              <>
                <Row horizontalArrangement={{ spacedBy: 8 }}>
                  <Tag label={store.category} />
                  <Tag
                    label={openNow ? "Open" : "Closed"}
                    color={openNow ? "#DDF1E5" : "#FCE8E6"}
                  />
                </Row>
                <Row verticalAlignment="center">
                  <Muted>Hours</Muted>
                  <Spacer modifiers={[weight(1)]} />
                  <Bold>{`${store.openTime} – ${store.closeTime}`}</Bold>
                </Row>
                <Row verticalAlignment="center">
                  <Muted>Facebook page</Muted>
                  <Spacer modifiers={[weight(1)]} />
                  <Bold color={colors.green}>{store.facebookPage || "Not added"}</Bold>
                </Row>
                <Bold>{`Products added (${storeProducts.length})`}</Bold>
                {storeProducts.map((product) => (
                  <Column
                    key={product.id}
                    verticalArrangement={{ spacedBy: 8 }}
                    modifiers={[fillMaxWidth(), border(1, colors.line), padding(14, 12, 14, 12)]}
                  >
                    <Row verticalAlignment="center">
                      <Bold>{product.name}</Bold>
                      <Spacer modifiers={[weight(1)]} />
                      <Bold>{`₱${product.price.toFixed(2)} ${product.unit.replace("per ", "/ ")}`}</Bold>
                    </Row>
                    <Row horizontalArrangement={{ spacedBy: 6 }}>
                      <OutlinedButton
                        onClick={() => onViewProduct(product)}
                        shape={shapes.field}
                        contentPadding={smallPadding}
                        colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                        modifiers={[weight(1), height(40)]}
                      >
                        <Text color={colors.green} style={{ fontSize: 13 }}>
                          View
                        </Text>
                      </OutlinedButton>
                      <OutlinedButton
                        onClick={() => onCompareProduct(product)}
                        shape={shapes.field}
                        contentPadding={smallPadding}
                        colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                        modifiers={[weight(1), height(40)]}
                      >
                        <Text color={colors.green} style={{ fontSize: 13 }}>
                          Compare
                        </Text>
                      </OutlinedButton>
                      <OutlinedButton
                        onClick={() => onEditProduct(product)}
                        shape={shapes.field}
                        contentPadding={smallPadding}
                        colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                        modifiers={[weight(1), height(40)]}
                      >
                        <Text color={colors.green} style={{ fontSize: 13 }}>
                          Edit
                        </Text>
                      </OutlinedButton>
                      <Button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            quantity: 0,
                            storeBelong: product.storeBelong,
                          });
                          onClose();
                        }}
                        shape={shapes.field}
                        contentPadding={smallPadding}
                        colors={{ containerColor: colors.green, contentColor: "#FFFFFF" }}
                        modifiers={[weight(1), height(40)]}
                      >
                        <Text color="#FFFFFF" style={{ fontSize: 13 }}>
                          Add to cart
                        </Text>
                      </Button>
                    </Row>
                  </Column>
                ))}
              </>,
            )}
          </LazyColumn>
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Edit store" secondary onPress={onEdit} />
            <ActionButton label="Open Facebook page" onPress={onClose} />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}

function isOpenNow(openTime: string, closeTime: string) {
  const open = toMinutes(openTime);
  const close = toMinutes(closeTime);
  if (open === null || close === null || open === close) return false;
  const now = new Date();
  const minute = now.getHours() * 60 + now.getMinutes();
  return open < close ? minute >= open && minute < close : minute >= open || minute < close;
}

function toMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59) return null;
  if (match[3]) hour = (hour % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + minute;
}
