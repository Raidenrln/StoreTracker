import { useProduct } from "@/context/ProductContext";
import { useReceipt } from "@/context/ReceiptContext";
import { useStore } from "@/context/StoreContext";
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
} from "@expo/ui/jetpack-compose";
import { border, fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Children, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { ActionButton, Bold, colors, Muted } from "./ModalUI";

export interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
  unit?: string;
}

export interface StoreGroup {
  storeName: string;
  items: ReceiptItem[];
}

export interface ReceiptDetails {
  id: string;
  date: string;
  totalItems: number;
  totalPrice: number;
  stores: StoreGroup[];
}

type ReceiptModalProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  receipt: ReceiptDetails | null;
};

function formatPrice(price: number) {
  const safePrice = Number.isFinite(price) ? price : 0;
  return `₱${safePrice.toLocaleString("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function ReceiptModal({ visible, onClose, onDelete, receipt }: ReceiptModalProps) {
  const { receipt: savedReceipts } = useReceipt();
  const { products } = useProduct();
  const { stores } = useStore();
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const { height: screenHeight } = useWindowDimensions();
  const close = async () => {
    await sheetRef.current?.hide();
    onClose();
  };

  if (!visible || !receipt) return null;

  // Use the checkout snapshot so later catalog edits do not change old receipt details.
  const savedReceipt = savedReceipts.find((item) => item.id === receipt.id);
  const groupedItems = new Map<string, StoreGroup>();

  for (const bought of savedReceipt?.products ?? []) {
    const product = products.find((item) => item.id === bought.id);
    const storeId = bought.storeBelong || product?.storeBelong || "unknown";
    const store = stores.find((item) => item.id === storeId);
    const group = groupedItems.get(storeId) ?? {
      storeName: bought.storeName ?? store?.name ?? "Unknown store",
      items: [],
    };

    group.items.push({
      name: bought.name ?? product?.name ?? "Product no longer available",
      price:
        typeof bought.price === "number" && Number.isFinite(bought.price)
          ? bought.price
          : (product?.price ?? 0),
      quantity: Math.max(1, Number(bought.quantity) || 1),
      unit: bought.unit ?? product?.unit,
    });
    groupedItems.set(storeId, group);
  }

  const displayStores = groupedItems.size > 0 ? Array.from(groupedItems.values()) : receipt.stores;
  const itemCount = savedReceipt?.products.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

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
              {receipt.id}
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
                <Muted
                  size={14}
                >{`${receipt.date} · ${itemCount ?? receipt.totalItems} items`}</Muted>

                {displayStores.length > 0 ? (
                  displayStores.map((store, storeIndex) => (
                    <Column
                      key={`${store.storeName}-${storeIndex}`}
                      verticalArrangement={{ spacedBy: 8 }}
                      modifiers={[fillMaxWidth(), border(1, "#E0E8E0"), padding(14, 12, 14, 12)]}
                    >
                      <Bold size={16} color={colors.green}>
                        {store.storeName}
                      </Bold>
                      {store.items.map((item, itemIndex) => {
                        const quantity = Math.max(1, Number(item.quantity) || 1);
                        return (
                          <Row key={`${item.name}-${itemIndex}`} verticalAlignment="center">
                            <Column modifiers={[weight(1)]}>
                              <Text color={colors.ink} style={{ fontSize: 15 }}>
                                {item.name}
                              </Text>
                              <Muted size={12}>
                                {`${quantity} × ${formatPrice(item.price)}${item.unit ? ` ${item.unit}` : " each"}`}
                              </Muted>
                            </Column>
                            <Bold size={16}>{formatPrice(item.price * quantity)}</Bold>
                          </Row>
                        );
                      })}
                    </Column>
                  ))
                ) : (
                  <Muted size={14}>No product details are available for this receipt.</Muted>
                )}
              </>,
            )}
          </LazyColumn>
          <Row verticalAlignment="center">
            <Text color={colors.ink} style={{ fontSize: 18, fontWeight: "bold" }}>
              Total
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Text color={colors.ink} style={{ fontSize: 22, fontWeight: "bold" }}>
              {formatPrice(receipt.totalPrice)}
            </Text>
          </Row>
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Delete receipt" secondary onPress={onDelete} />
            <ActionButton label="Done" onPress={onClose} />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}
