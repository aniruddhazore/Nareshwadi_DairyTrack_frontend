import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Alert } from "react-native";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import moment from "moment";

const ReportPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    // Validation to ensure the start date is not after the end date
    if (startDate > endDate) {
      Alert.alert("Invalid Date Range", "Start date cannot be after end date.");
      return; // Abort fetching data if validation fails
    }

    try {
      const response = await axios.get("http://nareshwadi-goshala.onrender.com/getReports", {
        params: { startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD') },
      });
    
      const transformedData = transformData(response.data);
      setData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const transformData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const date = moment(item.date).format("DD-MM-YYYY");
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {});

    const transformedData = [];
    Object.keys(groupedData).forEach((date) => {
      transformedData.push({ type: "date", date });
      groupedData[date].forEach((item) =>
        transformedData.push({ type: "cattle", ...item })
      );
      const totalYield = groupedData[date].reduce(
        (sum, item) => sum + item.total,
        0
      );
      transformedData.push({ type: "total", totalYield });
    });

    return transformedData;
  };

  const exportToExcel = () => {
    const exportData = [];
    data.forEach((item) => {
      if (item.type === "cattle") {
        const row = {
          Date: item.date ? moment(item.date).format('DD-MM-YYYY') : '', // No date for the total row
          "Cattle Name": item.cattleName,
          "Group Name": item.groupName,
          "Milking Capacity": item.milkingCapacity,
          "Session 1": item.session1,
          "Milkman 1": item.milkman1,
          "Session 2": item.session2,
          "Milkman 2": item.milkman2,
          "Total": item.total,
          "Total Yield": "",
        };
        exportData.push(row);
      } else if (item.type === "total") {
        const totalRow = {
          Date: '', // No date for the total row
          'Cattle Name': '',
          'Group Name': '',
          'Milking Capacity': '',
          'Session 1': '',
          'Milkman 1': '',
          'Session 2': '',
          'Milkman 2': '',
          'Total': '',
          'Total Yield': item.totalYield
        };
        exportData.push(totalRow);
      }
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const uri = FileSystem.cacheDirectory + "report.xlsx";
    FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    }).then(() => {
      Sharing.shareAsync(uri);
    });
  };

  const renderItem = ({ item }) => {
    if (item.type === "date") {
      return <Text style={styles.dateRow}>{item.date}</Text>;
    } else if (item.type === "total") {
      return (
        <Text style={styles.totalRow}>Total Yield: {item.totalYield}</Text>
      );
    } else {
      return (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.cattleName}</Text>
          <Text style={styles.cell}>{item.milkingCapacity}</Text>
          <Text style={styles.cell}>{item.session1}</Text>
          <Text style={styles.cell}>{item.session2}</Text>
          <Text style={styles.cell}>{item.total}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Report</Text>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.datePickerButtonText}>Select Start Date</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        <Text style={styles.dateText}>
          Start Date: {moment(startDate).format("DD-MM-YYYY")}
        </Text>
      </View>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.datePickerButtonText}>Select End Date</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
        <Text style={styles.dateText}>
          End Date: {moment(endDate).format("DD-MM-YYYY")}
        </Text>
      </View>
      <TouchableOpacity style={styles.actionButton} onPress={fetchData}>
        <Text style={styles.actionButtonText}>Fetch Report</Text>
      </TouchableOpacity>
      {data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={styles.row}>
              <Text style={styles.headerCell}>Cattle Name</Text>
              <Text style={styles.headerCell}>Milk Capacity</Text>
              <Text style={styles.headerCell}>S - 1</Text>
              <Text style={styles.headerCell}>S - 2</Text>
              <Text style={styles.headerCell}>Total Yield</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={styles.actionButton} onPress={exportToExcel}>
        <Text style={styles.actionButtonText}>Download as Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#f1f8ff",
    
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    backgroundColor: "#3FA2F6", // Purple background color for the header
    color: "#fff", // White text color for the header
    padding: 4,
    textAlign: "center",
    borderWidth:0.2,
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderLeftColor : "#ccc",
    borderLeftWidth : 0.2,
   
  },
  dateRow: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    textAlign : "center",
    borderWidth: 1.5,
    backgroundColor: "#83B4FF",
    marginVertical: 10,
   
  },
  totalRow: {
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    borderWidth: 1.5,
    backgroundColor: "#83B4FF", // Light purple background for total row
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: "#6B3FA0",
    borderRadius: 5,
    marginRight: 10,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#B592FF",
    borderRadius: 5,
    marginVertical: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ReportPage;