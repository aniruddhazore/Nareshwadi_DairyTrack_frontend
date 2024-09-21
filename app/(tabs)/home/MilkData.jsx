import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const MilkData = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [session1Value, setSession1Value] = useState("");
  const [session2Value, setSession2Value] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      console.log("Network status changed:", state.isConnected);
    });
  
    // Check and set the initial network state when component mounts
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      console.log("Initial network status:", state.isConnected);
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (isConnected === null) {
      // Avoid trying to fetch or load data if the connection status is still being determined
      return;
    }
  
    if (isConnected == false) {
      console.log("No network connection, loading local data...");
      loadLocalData();
    } else {
      console.log("Network connection available, fetching data...");
      fetchMilkData();
      
    }
  }, [isConnected, date]);

  const fetchMilkData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://nareshwadi-goshala.onrender.com/milk/${date}`);
      const milkData = response.data;
      if (milkData && milkData.data) {
        setData(milkData.data);
        // Store the fetched data in AsyncStorage
        await AsyncStorage.setItem(`milkData_${date}`, JSON.stringify(milkData.data));
      } else {
        setData([]);
        // Store an empty array if no data is found
        await AsyncStorage.setItem(`milkData_${date}`, JSON.stringify([]));
      }
      
    } catch (error) {
      console.error("Error fetching milk data 2:", error);
      Alert.alert("Error", "Failed to fetch milk data 2");
      loadLocalData();
    }
    setLoading(false);
  };


  const loadLocalData = async () => {
    try {
      const localData = await AsyncStorage.getItem(`milkData_${date}`);
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error loading local milk data:", error);
      Alert.alert("Error", "Failed to load local milk data 2");
    }
    setLoading(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setSession1Value(data[index].sess1);
    setSession2Value(data[index].sess2);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (editIndex === null) return;
    setLoading(true);
  
    try {
      const updatedData = data.map((item, index) => {
        if (index === editIndex) {
          return {
            ...item,
            sess1: session1Value,
            sess2: session2Value,
            isEdited: true // Mark as edited
          };
        }
        return item;
      });
  
      setData(updatedData);
  
      // Save to local storage
      await AsyncStorage.setItem(`milkData_${date}`, JSON.stringify(updatedData));
  
      if (isConnected) {
        try {
          // Update on the server
          await axios.put(`https://nareshwadi-goshala.onrender.com/milk/date/${date}`, {
            data: updatedData,
          });
          Alert.alert("Success", "Milk sessions updated successfully.");
        } catch (error) {
          console.error("Error updating milk sessions:", error);
          Alert.alert("Error", "Failed to update milk sessions online.");
        }
      } else {
        // If offline, indicate that the data will sync later
        Alert.alert("Offline", "Data updated locally. It will sync with the server when you're online.");
      }
    } catch (error) {
      console.error("Error saving milk sessions:", error);
      Alert.alert("Error", "Failed to save milk sessions.");
    } finally {
      setLoading(false);
      setModalVisible(false);
      setEditIndex(null);
    }
  };
  
  const handleDiscard = () => {
    setSession1Value("");
    setSession2Value("");
    setModalVisible(false);
    setEditIndex(null);
  };

  const calculateTotalYield = () => {
    return data.reduce((total, item) => {
      return (
        total +
        parseFloat(item.sess1 || 0) +
        parseFloat(item.sess2 || 0)
      );
    }, 0).toFixed(2);
  };

  const renderHeader = () => (
    <View style={styles.calendarContainer}>
      <Calendar
        current={date}
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{
          [date]: {
            selected: true,
            selectedColor: "#B592FF",
            dotColor: "#ffffff",
          },
        }}
        style={styles.calendar}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#B592FF",
          dayTextColor: "#333333",
          todayTextColor: "#B592FF",
          selectedDayTextColor: "#ffffff",
          monthTextColor: "#B592FF",
          selectedDayBackgroundColor: "#B592FF",
          arrowColor: "#B592FF",
          textDisabledColor: "#d9e1e8",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        hideExtraDays={true}
        enableSwipeMonths={false}
      />
    </View>
  );

  const renderEditIcon = (index) => (
    <TouchableOpacity onPress={() => handleEdit(index)}>
      <Ionicons name="pencil" size={24} color="#0F67B1" marginLeft = {23} />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderHeader()}

      <View style={styles.totalYieldContainer}>
        <Ionicons name="analytics" size={24} color="#6B3FA0" />
        <Text style={styles.totalYieldText}>Total Milk Yield: {calculateTotalYield()} liters</Text>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : data.length === 0 ? (
        <Text>No data available for the selected date.</Text>
      ) : (
        
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={[
              "Cattle Name",
              "Session 1",
              "Session 2",
              "Total Yield",
              "Edit",
            ]}
            style={styles.tableHeader}
            textStyle={styles.tableHeaderText}
          />
          {data.map((item, index) => (
            <TableWrapper key={index} style={styles.tableRow}>
              <Cell data={item.cattleName} textStyle={styles.tableText} />
              <Cell data={item.sess1} textStyle={styles.tableText} />
              <Cell data={item.sess2} textStyle={styles.tableText} />
              <Cell
                data={(
                  parseFloat(item.sess1 || 0) + parseFloat(item.sess2 || 0)
                ).toFixed(2)}
                textStyle={styles.tableText}
              />
              <Cell data={renderEditIcon(index)} textStyle={styles.tableText} />
            </TableWrapper>
          ))}
        </Table>
        
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Data</Text>
            <TextInput
              style={styles.input}
              value={session1Value}
              onChangeText={setSession1Value}
              placeholder="Enter Session 1 Value"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={session2Value}
              onChangeText={setSession2Value}
              placeholder="Enter Session 2 Value"
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.discardButton]}
                onPress={handleDiscard}
              >
                <Text style={styles.buttonText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 8,
  },
  totalYieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  totalYieldText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#333333",
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: "#cccccc",
  },
  tableHeader: {
    height: 40,
    backgroundColor: "#3FA2F6",
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  tableText: {
    textAlign: "center",
    color: "#333333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    color: "#333333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 4,
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#6B3FA0",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  discardButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#FF6347", // A contrasting color to the save button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default MilkData;