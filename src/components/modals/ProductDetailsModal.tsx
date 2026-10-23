import type { ProductDataModel } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import type { ModalBottomSheetRef } from "@expo/ui/jetpack-compose";
import {
  Button,
  Column,
  Host,
  ModalBottomSheet,
  Row,
  Spacer,
  Text,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { useRef } from "react";
import { ActionButton, Bold, colors, Muted, Tag } from "./ModalUI";

export default function ProductDetailsModal({
  product,
  onClose,
  onEdit,
  onAddToCart,
}: {
  product: ProductDataModel;
  onClose: () => void;
  onEdit: () => void;
  onAddToCart: () => void;
}) {
  const { stores } = useStore();
  const store = stores.find((item) => item.id === product.storeBelong);
  const matching = useStorePrices(product);
  const otherPrices = matching.filter((item) => item.id !== product.id);
  const lowestOther = otherPrices.slice().sort((a, b) => a.price - b.price)[0];
  const previousPrice = product.priceHistory.at(-1)?.previousPrice;
  const priceWentUp = previousPrice !== undefined && product.price > previousPrice;
  const trend = previousPrice === undefined ? null : Math.abs(product.price - previousPrice);
  const sheetRef = useRef<ModalBottomSheetRef>(null);
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
              {product.name}
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
          <Row>
            <Tag label={product.category} />
          </Row>
          <Row verticalAlignment="bottom" horizontalArrangement={{ spacedBy: 8 }}>
            <Text color={colors.ink} style={{ fontSize: 34, fontWeight: "bold" }}>
              {`₱${product.price.toFixed(2)}`}
            </Text>
            <Muted>{product.unit}</Muted>
          </Row>
          {trend !== null ? (
            <Text color={priceWentUp ? "#A12B24" : colors.green} style={{ fontWeight: "600" }}>
              {`${priceWentUp ? "↑ Up" : "↓ Down"} from ₱${previousPrice?.toFixed(2)} (₱${trend.toFixed(2)})`}
            </Text>
          ) : null}
          <Row verticalAlignment="center">
            <Muted>Store</Muted>
            <Spacer modifiers={[weight(1)]} />
            <Bold>{store?.name ?? "Unknown store"}</Bold>
          </Row>
          {lowestOther ? (
            <>
              <Bold>Also tracked at</Bold>
              <Row verticalAlignment="center">
                <Muted>
                  {stores.find((item) => item.id === lowestOther.storeBelong)?.name ??
                    "Unknown store"}
                </Muted>
                <Spacer modifiers={[weight(1)]} />
                <Bold>{`₱${lowestOther.price.toFixed(2)} / ${product.unit.replace("per ", "")}`}</Bold>
              </Row>
            </>
          ) : (
            <Muted>No other stores track this product yet.</Muted>
          )}
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Edit" secondary onPress={onEdit} />
            <ActionButton label="Add to cart" onPress={onAddToCart} />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}

function useStorePrices(product: ProductDataModel) {
  const { products } = useProduct();
  return products.filter(
    (item) => item.name.toLowerCase() === product.name.toLowerCase() && item.unit === product.unit,
  );
}
