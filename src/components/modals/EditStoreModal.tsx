import { useCategories } from "@/context/CategoriesContext";
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
  Spacer,
  Text,
  TimePickerDialog,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height, padding, weight } from "@expo/ui/jetpack-compose/modifiers";
import { Children, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { ActionButton, ChipGroup, ChoiceChip, colors, FormField, Label, shapes } from "./ModalUI";

export default function EditStoreModal({
  store,
  onClose,
  onSave,
}: {
  store: StoreDataModel;
  onClose: () => void;
  onSave: (store: StoreDataModel) => void;
}) {
  const { storeCategories: categories } = useCategories();
  const showToast = useToast();
  const name = useNativeState(store.name);
  const facebookPage = useNativeState(store.facebookPage ?? "");
  const [category, setCategory] = useState(store.category);
  const [openTime, setOpenTime] = useState(() => timeFromText(store.openTime));
  const [closeTime, setCloseTime] = useState(() => timeFromText(store.closeTime));
  const [activeTime, setActiveTime] = useState<"open" | "close" | null>(null);
  const [nameError, setNameError] = useState("");
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const { height: screenHeight } = useWindowDimensions();
  const close = async () => {
    await sheetRef.current?.hide();
    onClose();
  };

  const save = () => {
    if (!name.value.trim()) {
      setNameError("Store name is required");
      return;
    }
    onSave({
      ...store,
      name: name.value.trim(),
      category,
      openTime: formatTime(openTime),
      closeTime: formatTime(closeTime),
      facebookPage: facebookPage.value.trim(),
    });
    showToast("Store updated");
    onClose();
  };

  const timeButton = (label: string, value: Date, which: "open" | "close") => (
    <Column verticalArrangement={{ spacedBy: 6 }} modifiers={[weight(1)]}>
      <Label>{label}</Label>
      <OutlinedButton
        onClick={() => setActiveTime(which)}
        shape={shapes.field}
        colors={{ containerColor: "#FFFFFF", contentColor: colors.ink }}
        modifiers={[fillMaxWidth(), height(52)]}
      >
        <Text color={colors.ink}>{formatTime(value)}</Text>
      </OutlinedButton>
    </Column>
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
              Edit store
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
                <FormField
                  label="Store name"
                  state={name}
                  placeholder="Enter a store name"
                  error={nameError}
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
                <Row horizontalArrangement={{ spacedBy: 12 }}>
                  {timeButton("Opens", openTime, "open")}
                  {timeButton("Closes", closeTime, "close")}
                </Row>
                <FormField
                  label="Facebook page (optional)"
                  state={facebookPage}
                  placeholder="facebook.com/storename"
                  keyboardType="uri"
                />
              </>,
            )}
          </LazyColumn>
          {activeTime ? (
            <TimePickerDialog
              initialDate={(activeTime === "open" ? openTime : closeTime).toISOString()}
              is24Hour={false}
              color={colors.green}
              onDateSelected={(date) => {
                if (activeTime === "open") setOpenTime(date);
                else setCloseTime(date);
                setActiveTime(null);
              }}
              onDismissRequest={() => setActiveTime(null)}
            />
          ) : null}
          <Row horizontalArrangement={{ spacedBy: 12 }}>
            <ActionButton label="Cancel" secondary onPress={onClose} />
            <ActionButton label="Save changes" onPress={save} />
          </Row>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}

function timeFromText(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  const date = new Date();
  if (!match) return date;
  let hour = Number(match[1]);
  if (match[3]) hour = (hour % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  date.setHours(hour, Number(match[2]), 0, 0);
  return date;
}

function formatTime(value: Date) {
  return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}
