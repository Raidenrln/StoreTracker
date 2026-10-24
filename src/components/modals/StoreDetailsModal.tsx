import { useCart } from "@/context/CartContext";
import type { ProductDataModel } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import type { StoreDataModel } from "@/context/StoreContext";
import { useToast } from "@/context/ToastContext";
import type { ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  Button,
  Column,
  Host,
  LazyColumn,
  ModalBottomSheet,
  OutlinedButton,
  Row,
  Shape,
  Spacer,
  Surface,
  Text,
} from "@expo/ui/jetpack-compose";
import { border, fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { ArrowLeftRight, Link2, Pencil, ShoppingCart, Trash, X } from "lucide-react-native";
import { Children, Fragment, useRef, useState } from "react";
import { Linking, useWindowDimensions } from "react-native";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Bold, colors, Muted, NoTouch, shapes, Tag } from "./ModalUI";

const iconButtonPadding = { start: 0, end: 0, top: 0, bottom: 0 };

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
  const { products, deleteProduct } = useProduct();
  const { addToCart } = useCart();
  const showToast = useToast();
  const storeProducts = products.filter((product) => product.storeBelong === store.id);
  const openNow = isOpenNow(store.openTime, store.closeTime);
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const { height: screenHeight } = useWindowDimensions();
  const [productToDelete, setProductToDelete] = useState<ProductDataModel | null>(null);
  const close = async () => {
    await sheetRef.current?.hide();
    onClose();
  };
  const facebookUrl = store.facebookPage
    ? `https://facebook.com/${store.facebookPage.replace(/^@/, "")}`
    : null;

  // Size the list to its content (capped), so there is no big empty gap
  // between the products and the bottom buttons.
  const listHeight = Math.min(
    Math.round(screenHeight * 0.5),
    110 + Math.max(storeProducts.length, 1) * 132,
  );

  return (
    <Fragment>
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
            verticalArrangement={{ spacedBy: 18 }}
            modifiers={[fillMaxWidth(), padding(22, 0, 22, 20)]}
          >
            <Row verticalAlignment="center">
              <Text color={colors.ink} style={{ fontSize: 25, fontWeight: "bold" }}>
                {store.name}
              </Text>
              <Spacer modifiers={[weight(1)]} />
              <Button
                onClick={close}
                colors={{ containerColor: "#FFFFFF", contentColor: colors.muted }}
                contentPadding={iconButtonPadding}
              >
                <NoTouch size={24}>
                  <X size={24} color={colors.muted} />
                </NoTouch>
              </Button>
            </Row>

            <Row horizontalArrangement={{ spacedBy: 6 }}>
              <Tag label={store.category} />
              <Tag label={openNow ? "Open" : "Closed"} color={openNow ? "#DDF1E5" : "#FCE8E6"} />
            </Row>

            <LazyColumn
              verticalArrangement={{ spacedBy: 14 }}
              modifiers={[fillMaxWidth(), height(listHeight)]}
            >
              {Children.toArray(
                <>
                  <Row verticalAlignment="center">
                    <Muted>Hours</Muted>
                    <Spacer modifiers={[weight(1)]} />
                    <Bold size={17}>{`${store.openTime} – ${store.closeTime}`}</Bold>
                  </Row>
                  <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 5 }}>
                    <Muted>Facebook page</Muted>
                    <Spacer modifiers={[weight(1)]} />
                    {store.facebookPage ? <Link2 size={19} color={colors.green} /> : null}
                    <Bold size={16} color={store.facebookPage ? colors.green : colors.muted}>
                      {store.facebookPage || "Not added"}
                    </Bold>
                  </Row>
                  <Bold size={17}>{`Products added (${storeProducts.length})`}</Bold>
                  {storeProducts.length ? (
                    storeProducts.map((product) => (
                      <Surface
                        key={product.id}
                        color="#FFFFFF"
                        shape={Shape.RoundedCorner({
                          cornerRadii: { topStart: 20, topEnd: 20, bottomStart: 20, bottomEnd: 20 },
                        })}
                        border={{ width: 1, color: "#DDE6DE" }}
                        modifiers={[fillMaxWidth()]}
                      >
                        <Column
                          verticalArrangement={{ spacedBy: 12 }}
                          modifiers={[fillMaxWidth(), padding(16, 14, 16, 14)]}
                        >
                          <Row verticalAlignment="center">
                            <Bold size={17}>{product.name}</Bold>
                            <Spacer modifiers={[weight(1)]} />
                            <Bold size={17}>{formatPrice(product.price)}</Bold>
                            <Muted size={14}>{` ${product.unit.replace("per ", "/ ")}`}</Muted>
                          </Row>
                          <Row horizontalArrangement={{ spacedBy: 8 }}>
                            <Spacer modifiers={[weight(1)]} />
                            <Button
                              onClick={() => {
                                addToCart({
                                  id: product.id,
                                  quantity: 0,
                                  storeBelong: product.storeBelong,
                                });
                                showToast("Added to cart");
                              }}
                              shape={shapes.field}
                              contentPadding={iconButtonPadding}
                              colors={{ containerColor: colors.green, contentColor: "#FFFFFF" }}
                              modifiers={[height(44)]}
                            >
                              <NoTouch size={21}>
                                <ShoppingCart size={21} color="#FFFFFF" />
                              </NoTouch>
                            </Button>
                            <OutlinedButton
                              onClick={() => onCompareProduct(product)}
                              shape={shapes.field}
                              contentPadding={iconButtonPadding}
                              colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                              modifiers={[height(44)]}
                            >
                              <NoTouch size={21}>
                                <ArrowLeftRight size={21} color={colors.green} />
                              </NoTouch>
                            </OutlinedButton>
                            <OutlinedButton
                              onClick={() => onEditProduct(product)}
                              shape={shapes.field}
                              contentPadding={iconButtonPadding}
                              colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                              modifiers={[height(44)]}
                            >
                              <NoTouch size={20}>
                                <Pencil size={20} color={colors.green} />
                              </NoTouch>
                            </OutlinedButton>
                            <OutlinedButton
                              onClick={() => setProductToDelete(product)}
                              shape={shapes.field}
                              contentPadding={iconButtonPadding}
                              colors={{ containerColor: "#FFFFFF", contentColor: "#A12B24" }}
                              modifiers={[height(44)]}
                            >
                              <NoTouch size={20}>
                                <Trash size={20} color="#A12B24" />
                              </NoTouch>
                            </OutlinedButton>
                          </Row>
                        </Column>
                      </Surface>
                    ))
                  ) : (
                    <Column
                      verticalArrangement={{ spacedBy: 8 }}
                      modifiers={[fillMaxWidth(), border(1, colors.line), padding(20, 16, 20, 16)]}
                    >
                      <Muted size={14}>No products added to this store yet.</Muted>
                    </Column>
                  )}
                </>,
              )}
            </LazyColumn>

            <Row horizontalArrangement={{ spacedBy: 12 }}>
              <OutlinedButton
                onClick={onEdit}
                shape={shapes.button}
                colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
                modifiers={[weight(1), height(56)]}
              >
                <Text color={colors.green} style={{ fontSize: 16, fontWeight: "600" }}>
                  Edit store
                </Text>
              </OutlinedButton>
              {facebookUrl ? (
                <Button
                  onClick={() => void Linking.openURL(facebookUrl)}
                  shape={shapes.button}
                  colors={{ containerColor: colors.green, contentColor: "#FFFFFF" }}
                  modifiers={[weight(1), height(56)]}
                >
                  <Text color="#FFFFFF" style={{ fontSize: 16, fontWeight: "bold" }}>
                    Open Facebook
                  </Text>
                </Button>
              ) : null}
            </Row>
          </Column>
        </ModalBottomSheet>
      </Host>
      <ConfirmDeleteModal
        visible={Boolean(productToDelete)}
        itemName={productToDelete?.name ?? ""}
        onCancel={() => setProductToDelete(null)}
        onConfirm={() => {
          if (!productToDelete) return;
          deleteProduct(productToDelete.id);
          setProductToDelete(null);
          showToast("Product deleted");
        }}
      />
    </Fragment>
  );
}

// Lucide icons are React Native views hosted inside Compose; they swallow taps.
// pointerEvents="none" lets the tap reach the Compose button underneath.

function formatPrice(price: number) {
  return `₱${Number.isInteger(price) ? price : price.toFixed(2)}`;
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
