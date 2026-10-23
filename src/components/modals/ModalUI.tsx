import {
  Button,
  Column,
  FlowRow,
  OutlinedButton,
  OutlinedTextField,
  Shape,
  Text,
  useNativeState,
} from "@expo/ui/jetpack-compose";
import {
  background,
  fillMaxWidth,
  height,
  padding,
  weight,
} from "@expo/ui/jetpack-compose/modifiers";
import type { ReactNode } from "react";

export const colors = {
  green: "#15714A",
  ink: "#172D22",
  muted: "#647368",
  line: "#DDE6DE",
  outline: "#CAD8CC",
  placeholder: "#858B87",
  red: "#B3261E",
  tag: "#E6EEE7",
};

const radius = (r: number) =>
  Shape.RoundedCorner({
    cornerRadii: { topStart: r, topEnd: r, bottomStart: r, bottomEnd: r },
  });

export const shapes = { field: radius(14), chip: radius(24), button: radius(16) };

export const fieldColors = {
  focusedTextColor: colors.ink,
  unfocusedTextColor: colors.ink,
  cursorColor: colors.green,
  focusedIndicatorColor: colors.green,
  unfocusedIndicatorColor: colors.outline,
  focusedPlaceholderColor: colors.placeholder,
  unfocusedPlaceholderColor: colors.placeholder,
};

export function Label({ children }: { children: string }) {
  return (
    <Text color={colors.ink} style={{ fontSize: 14, fontWeight: "500" }}>
      {children}
    </Text>
  );
}

export function ErrorText({ message }: { message?: string }) {
  return message ? (
    <Text color={colors.red} style={{ fontSize: 12 }}>
      {message}
    </Text>
  ) : null;
}

export function Muted({ children, size = 15 }: { children: string; size?: number }) {
  return (
    <Text color={colors.muted} style={{ fontSize: size }}>
      {children}
    </Text>
  );
}

export function Bold({
  children,
  size = 17,
  color = colors.ink,
}: {
  children: string;
  size?: number;
  color?: string;
}) {
  return (
    <Text color={color} style={{ fontSize: size, fontWeight: "bold" }}>
      {children}
    </Text>
  );
}

export function Tag({ label, color = colors.tag }: { label: string; color?: string }) {
  return (
    <Text
      color={colors.ink}
      style={{ fontSize: 14 }}
      modifiers={[background(color), padding(13, 7, 13, 7)]}
    >
      {label}
    </Text>
  );
}

type NativeText = ReturnType<typeof useNativeState<string>>;

export function FormField({
  label,
  state,
  placeholder,
  keyboardType,
  error,
}: {
  label: string;
  state: NativeText;
  placeholder?: string;
  keyboardType?: "decimal" | "uri";
  error?: string;
}) {
  return (
    <Column verticalArrangement={{ spacedBy: 6 }}>
      <Label>{label}</Label>
      <OutlinedTextField
        value={state}
        singleLine
        shape={shapes.field}
        colors={fieldColors}
        keyboardOptions={keyboardType ? { keyboardType } : undefined}
        modifiers={[fillMaxWidth()]}
      >
        <OutlinedTextField.Placeholder>
          <Text color={colors.placeholder}>{placeholder ?? ""}</Text>
        </OutlinedTextField.Placeholder>
      </OutlinedTextField>
      <ErrorText message={error} />
    </Column>
  );
}

export function ActionButton({
  label,
  onPress,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  if (secondary)
    return (
      <OutlinedButton
        onClick={onPress}
        shape={shapes.button}
        colors={{ containerColor: "#FFFFFF", contentColor: colors.green }}
        modifiers={[weight(1), height(54)]}
      >
        <Text color={colors.green} style={{ fontWeight: "600" }}>
          {label}
        </Text>
      </OutlinedButton>
    );
  return (
    <Button
      onClick={onPress}
      shape={shapes.button}
      colors={{ containerColor: colors.green, contentColor: "#FFFFFF" }}
      modifiers={[weight(1), height(54)]}
    >
      <Text color="#FFFFFF" style={{ fontWeight: "bold" }}>
        {label}
      </Text>
    </Button>
  );
}

export function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const Chip = selected ? Button : OutlinedButton;
  return (
    <Chip
      onClick={onPress}
      shape={shapes.chip}
      colors={
        selected
          ? { containerColor: colors.green, contentColor: "#FFFFFF" }
          : { containerColor: "#FFFFFF", contentColor: colors.ink }
      }
      modifiers={[height(42)]}
    >
      <Text color={selected ? "#FFFFFF" : colors.ink}>{label}</Text>
    </Chip>
  );
}

export function ChipGroup({ children }: { children: ReactNode }) {
  return (
    <FlowRow horizontalArrangement={{ spacedBy: 8 }} verticalArrangement={{ spacedBy: 8 }}>
      {children}
    </FlowRow>
  );
}
