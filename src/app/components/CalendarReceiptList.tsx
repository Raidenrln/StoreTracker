import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type SelectedDateModel = {
  year: string;
  month: string;
  day: string;
};
const receipts = [
  { id: "REC-000000000001", date: "2026-10-19", total: 142 },
  { id: "REC-000000000002", date: "2026-10-20", total: 300 },
  { id: "REC-000000000003", date: "2026-10-21", total: 552 },
];

const CalendarReceiptList = () => {
  const now = new Date();
  const dateNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(dateNow);
  const [selectedDay, setSelectedDay] = useState(dateNow);
  const changeMonth = (amount: number) => {
    const date = new Date(`${currentMonth}T12:00:00`);

    date.setDate(1);
    date.setMonth(date.getMonth() + amount);

    const newMonth = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), "01"].join(
      "-",
    );
    setCurrentMonth(newMonth);
  };

  const formatDisplayYearMonth = new Date(currentMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const formatMonthName = new Date(currentMonth).toLocaleString("en-US", {
    month: "long",
  });

  const formatDayNDate = () => {
    const d = new Date(selectedDay);

    return `${d.toLocaleDateString("en-US", { weekday: "short" })}, ${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()} `;
  };

  // console.log(formatDayNDate());
  // const formatForCalendar = () => {
  //   const getMonthNYear = new Date(currentMonth);

  //   const format = `${getMonthNYear.getFullYear}-${getMonthNYear.getMonth() + 1}-${getMonthNYear.getDate()}`;
  //   return format;
  // };

  // console.log("for key", formatForCalendar());

  useEffect(() => {
    // console.log("Current month:", currentMonth);
  });
  const key = [{ color: "#E84A8A" }];

  const filteredList = receipts.filter((r) => {
    const receiptDate = new Date(r.date);
    const receiptDataFormat = [
      receiptDate.getFullYear(),
      String(receiptDate.getMonth() + 1).padStart(2, "0"),
      String(receiptDate.getDate()).padStart(2, "0"),
    ].join("-");
    // console.log("Current Month:", receiptDataFormat);
    // console.log("ReceiptDate:", receiptDataFormat);
    // console.log("Data2:", currentMonth);

    return receiptDataFormat === selectedDay;
  });

  const markedDateReceipt = receipts.map((r) => r.date);

  const markedDates = Object.fromEntries(
    markedDateReceipt.map((date) => [
      date,
      {
        selectedColor: "#116F46",
        dots: [{ color: "#1E764F", selectedDotColor: "#ffffff" }],
      },
    ]),
  );
  console.log("List:", markedDateReceipt);
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          style={{
            padding: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#D1DBD1",
            borderRadius: 24,
          }}
          onPress={() => changeMonth(-1)}
        >
          <ChevronLeft />
        </Pressable>
        <View style={{ flex: 2, justifyContent: "center", alignContent: "center" }}>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: 600 }}>
            {formatDisplayYearMonth}
          </Text>
        </View>
        <Pressable
          style={{
            padding: 12,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#D1DBD1",
            borderRadius: 24,
          }}
          onPress={() => changeMonth(1)}
        >
          <ChevronRight />
        </Pressable>
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
        <Text style={{ color: "#77847B", alignSelf: "center" }}>Spend in {formatMonthName}</Text>
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
          // backgroundColor: "#ffffff",
          // calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          // textSectionTitleDisabledColor: "#d9e1e8",
          selectedDayBackgroundColor: "#00adf5",
          // selectedDayTextColor: "#ffffff",
          todayTextColor: "#15714A",
          dayTextColor: "black",
          // textDisabledColor: "#d9e1e8",
          // dotColor: "#00adf5",
          // selectedDotColor: "#ffffff",
          // arrowColor: "#15714A",
          // disabledArrowColor: "#d9e1e8",
          // monthTextColor: "blue",
          // indicatorColor: "blue",
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
        markingType="multi-dot"
        markedDates={{
          ...markedDates,
          // "2026-10-06": {
          //   selected: true,
          //   selectedColor: "#116F46",
          //   selectedTextColor: "#FFFFFF",
          //   dots: key,
          // },
          [selectedDay]: {
            ...markedDates[selectedDay],
            selected: true,
            selectedColor: "#116F46",
            selectedTextColor: "#FFFFFF",
          },
        }}
        onDayPress={(day) => {
          setSelectedDay(day.dateString);
          console.log("selected day", day);
        }}
        onMonthChange={(month) => {
          // console.log("month changed", month);
        }}
        hideExtraDays={true}
        enableSwipeMonths={true}
        renderHeader={() => null}
        // initialDate={'2012-03-01'}
        // initialDate={dateNow}
        // minDate={dateNow}
        // current={"2012-03-01"}
        // key={formatForCalendar()}
        key={currentMonth}
        current={currentMonth}
      />
      <View style={{ gap: 8, marginTop: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 18, fontWeight: 700 }}>{formatDayNDate()}</Text>
          <Text style={{ fontSize: 18, fontWeight: 700, color: "#116F46" }}>₱670</Text>
        </View>
        <View style={styles.receiptContainerList}>
          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.receiptContent}>
                <View style={styles.receiptIconBg}>
                  <ReceiptText color={"#1E764F"} />
                </View>
                <View style={styles.receiptIdTextContent}>
                  <Text style={styles.receiptIdText}>{item.id}</Text>
                  <Text style={styles.receiptIdDate}>{item.date}</Text>
                </View>
                <View style={styles.receiptTotalPriceContent}>
                  <Text style={styles.receiptTotalPriceText}>₱{item.total}</Text>
                </View>
              </View>
            )}
          />
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
