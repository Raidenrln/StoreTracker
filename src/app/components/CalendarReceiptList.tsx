import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
type SelectedDateModel = {
  year: string;
  month: string;
  day: string;
};
const CalendarReceiptList = () => {
  const now = new Date();
  const dateNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  console.log(dateNow);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>();
  const convertToMonthYear = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  useEffect(() => {
    setSelectedDate(selectedDate);
  });
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            padding: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#D1DBD1",
            borderRadius: 24,
          }}
        >
          <ChevronLeft />
        </View>
        <View style={{ flex: 2, justifyContent: "center", alignContent: "center" }}>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: 600 }}>
            {convertToMonthYear}
          </Text>
        </View>
        <View
          style={{
            padding: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#D1DBD1",
            borderRadius: 24,
          }}
        >
          <ChevronRight />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#E2E9E1",
          borderRadius: 16,
        }}
      >
        <Text style={{ color: "#77847B", alignSelf: "center" }}>Spend in October</Text>
        <Text style={{ color: "#147048", fontWeight: 600, fontSize: 20, alignSelf: "center" }}>
          ₱670
        </Text>
      </View>
      <Calendar
        style={{
          borderColor: "gray",
          borderRadius: 16,
          overflow: "hidden",
        }}
        hideArrows={true}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          textSectionTitleDisabledColor: "#d9e1e8",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "black",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "#15714A",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "blue",
          indicatorColor: "blue",
          textDayFontFamily: "roboto",
          textMonthFontFamily: "roboto",
          textDayHeaderFontFamily: "roboto",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
        // hideDayNames={true}
        // markedDates={{
        //   "2026-10-06": { selected: true, marked: true, selectedColor: "blue" },
        //   "2012-03-02": { marked: true },
        //   "2012-03-03": { selected: true, marked: true, selectedColor: "blue" },
        // }}
        onDayPress={(day) => {
          console.log("selected day", day);
          setSelectedDate(day.dateString);
          setSelectedMonth(day.month);
        }}
        onMonthChange={(month) => {
          console.log("month changed", month);
        }}
        hideExtraDays={true}
        enableSwipeMonths={true}
        renderHeader={() => null}
        // initialDate={'2012-03-01'}
        // initialDate={dateNow}
        // minDate={dateNow}
        // current={dateNow}
      />
      <View style={{ gap: 8, marginTop: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: 700 }}>Thu, Oct 15</Text>
          <Text style={{ fontSize: 18, fontWeight: 700, color: "#116F46" }}>₱670</Text>
        </View>
        <View style={styles.receiptContainerList}>
          <View style={styles.receiptContent}>
            <View style={styles.receiptIconBg}>
              <ReceiptText color={"#1E764F"} />
            </View>
            <View style={styles.receiptIdTextContent}>
              <Text style={styles.receiptIdText}>REC-000000000001</Text>
              <Text style={styles.receiptIdDate}>Oct 19</Text>
            </View>
            <View style={styles.receiptTotalPriceContent}>
              <Text style={styles.receiptTotalPriceText}>₱1200</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  receiptContainerList: {
    backgroundColor: "white",
    borderRadius: 12,
  },
  receiptContent: {
    alignContent: "center",
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },
  receiptIconBg: {
    padding: 12,
    backgroundColor: "#E6EEE7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  receiptIdTextContent: {
    flex: 2,
  },
  receiptIdText: {
    fontSize: 18,
    fontWeight: 600,
  },
  receiptIdDate: {
    color: "#839087",
  },
  receiptTotalPriceContent: {
    alignSelf: "center",
  },
  receiptTotalPriceText: {
    fontSize: 20,
    fontWeight: 600,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#E0E5E1",
    marginHorizontal: 12,
    marginVertical: 4,
  },
});
export default CalendarReceiptList;
