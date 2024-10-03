import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { TextInput, Button, Menu, Provider, RadioButton } from "react-native-paper";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MilkEntry = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false); // Track syncing status

  const navigation = useNavigation();
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    loadData();

    return () => unsubscribe();
  }, [date]);

  const loadData = async () => {
    setLoading(true);
    if (isConnected) {
      await fetchCattleData();
      await fetchUsers();
      await fetchExistingMilkData();
      await syncOfflineData();
    } else {
      await loadLocalCattleData();
      await loadLocalUsers();
      await loadLocalMilkData();
    }
    setLoading(false);
  };

  const syncOfflineData = async () => {
    if (isSyncing) return; // Prevent multiple syncs
  
    setIsSyncing(true);
    try {
      const localMilkData = await AsyncStorage.getItem('offlineMilkData');
      if (localMilkData) {
        let offlineData = JSON.parse(localMilkData);
        
        for (const entry of offlineData) {
          if (!entry.synced || entry.isEdited) {
            try {
              if (!entry.synced) {
                // If not synced, post new data
                await axios.post('https://nareshwadi-goshala.onrender.com/milk', entry);
                entry.synced = true;
              } else if (entry.isEdited) {
                // If edited, update the server
                await axios.put(`https://nareshwadi-goshala.onrender.com/milk/date/${entry.date}`, entry);
                entry.isEdited = false; // Mark as not edited after successful update
              }
            } catch (error) {
              console.error('Error syncing data:', error);
              // Handle error (e.g., by logging or retrying)
            }
          }
        }
  
        // Update AsyncStorage with the synced and edited status
        await AsyncStorage.setItem('offlineMilkData', JSON.stringify(offlineData));
      }
    } catch (error) {
      console.error('Error reading local data:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  

  const fetchCattleData = async () => {
    try {
      const response = await axios.get('https://nareshwadi-goshala.onrender.com/getCattle');
      const cattleData = response.data.map(cattle => ({
        cattleName: cattle.name,
        milkman: '',
        milkEntry: '',
        session1Filled: false,
        session2Filled: false,
      }));
      setData(cattleData);
      await AsyncStorage.setItem('cattleData', JSON.stringify(cattleData));
    } catch (error) {
      console.error('Error fetching cattle data:', error);
      Alert.alert('Error', 'Failed to fetch cattle data');
    }
  };

  const loadLocalCattleData = async () => {
    try {
      const localData = await AsyncStorage.getItem('cattleData');
      if (localData) {
        setData(JSON.parse(localData));
      }
    } catch (error) {
      console.error('Error loading local cattle data:', error);
      Alert.alert('Error', 'Failed to load local cattle data');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://nareshwadi-goshala.onrender.com/users');
      // setUsers(response.data)
      const milkmen = response.data.filter(user => user.userType === 'Milkman');
      setUsers(milkmen)
      console.log(users)
      await AsyncStorage.setItem('usersData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const loadLocalUsers = async () => {
    try {
      const localUsers = await AsyncStorage.getItem('usersData');
      if (localUsers) {
        setUsers(JSON.parse(localUsers));
      }
    } catch (error) {
      console.error('Error loading local users data:', error);
    }
  };
 
  const fetchExistingMilkData = async () => {
    try {
      
      const response = await axios.get(`https://nareshwadi-goshala.onrender.com/milk/${date}`);
      const existingMilkData = response.data;
      if (existingMilkData && existingMilkData.data) {
        const updatedData = data.map(item => {
          const existingItem = existingMilkData.data.find(d => d.cattleName === item.cattleName);
          if (existingItem) {
            return {
              ...item,
              milkEntry: existingItem.sess1, // Assuming you're working with session 1
              milkman: existingItem.milkman1,
              session1Filled: !!existingItem.sess1,
              session2Filled: !!existingItem.sess2,
            };
          }
          return item;
        });
        setData(updatedData);
        await AsyncStorage.setItem(`milkData-${date}`, JSON.stringify(updatedData));

        // Check if all entries are filled for both sessions
        const allEntriesFilled = updatedData.every(item => item.session1Filled && item.session2Filled);
        if (allEntriesFilled) {
          Alert.alert(
            'Milk Entry Done',
            'Milk entry is done for this date.',
            [
              {
                text: 'View Data',
                onPress: () => navigation.navigate('MilkData'),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error fetching existing milk data:', error);
    }
  };

  const loadLocalMilkData = async () => {
    try {
      const localData = await AsyncStorage.getItem(`milkData-${date}`);
      if (localData) {
        setData(JSON.parse(localData));
      }
    } catch (error) {
      console.error('Error loading local milk data:', error);
      Alert.alert('Error', 'Failed to load local milk data');
    }
  };

  const handleSerialNumberChange = (index, newSerialNumber, cattleId) => {
  
    const updatedData = [...data];
    updatedData[index].serialNumber = newSerialNumber;
    updatedData[index]._id = cattleId; // Ensure that the id is being passed correctly
  
    setData(updatedData); // Update the state with the new serial numbers
  };

  // Function to update the serial numbers (API call)
const updateSerialNumbers = async () => {
  // Validate serial numbers
  const serialNumbers = data.map(item => 
    item.serialNumber ? parseInt(item.serialNumber.toString(), 10) : NaN
  );
  
  const hasDuplicates = new Set(serialNumbers).size !== serialNumbers.length;
  const hasInvalidNumbers = serialNumbers.some(num => isNaN(num) || num < 1);

  if (hasDuplicates) {
    Alert.alert("Invalid Input", "Serial numbers must be unique.");
    return;
  }

  if (hasInvalidNumbers) {
    Alert.alert("Invalid Input", "Serial numbers must be positive integers.");
    return;
  }
try {
// Iterate over each cattle entry to send individual update requests
for (const item of data) {
if (item._id && item.serialNumber) {
  // API call to update serial number for each cattle
  const response = await axios.put(`/cattle/${item._id}/serial-number`, {
    serialNumber: item.serialNumber,
  });

  if (response.status !== 200) {
    throw new Error("Failed to update serial number for cattle ID: " + item._id);
  }
}
}

// Sort data based on serialNumber
const sortedData = [...data].sort((a, b) => a.serialNumber - b.serialNumber);
// Update the data state with sorted data
setData(sortedData);

alert("Serial numbers updated successfully.");
} catch (error) {
console.error("Error updating serial numbers:", error);
alert("Failed to update serial numbers.");
}
};

  const handleSave = async () => {
    setLoading(true);
  
    try {
      const updatedData = data.map((item) => {
        const sessionData =
          selectedSession === "Session 1"
            ? { sess1: item.milkEntry, milkman1: item.milkman }
            : { sess2: item.milkEntry, milkman2: item.milkman };
        return {
          cattleName: item.cattleName,
          ...sessionData,
        };
      });
  
      if (isConnected) {
        // If online, send data to the server
        await axios.post("https://nareshwadi-goshala.onrender.com/milk", {
          date,
          data: updatedData,
        });
  
        Alert.alert("Success", `${selectedSession} data is stored.`);
        navigation.navigate("MilkData");
      } else {
        // If offline, save data locally in AsyncStorage
        const localMilkData = await AsyncStorage.getItem("offlineMilkData");
        const offlineData = localMilkData ? JSON.parse(localMilkData) : [];
  
        // Append the new data
        offlineData.push({ date, data: updatedData, synced: false });
  
        await AsyncStorage.setItem("offlineMilkData", JSON.stringify(offlineData));
  
        Alert.alert(
          "Offline",
          "Data saved locally. It will sync with the server when you're online."
        );
      }
    } catch (error) {
      console.error("Error saving milk data:", error);
      Alert.alert("Error", "Failed to save milk data");
    }
  
    setLoading(false);
  };
  
  const renderInput = (item, index) => (
    <TextInput
      value={item.milkEntry}
      onChangeText={(text) => {
        const newData = [...data];
        newData[index].milkEntry = text;
        setData(newData);
      }}
      
      style={styles.input}
      keyboardType="numeric"
    />
  );
  

  const renderMenu = (item, index) => (
    <Menu
      visible={visible[index]}
      onDismiss={() => setVisible({ ...visible, [index]: false })}
      anchor={
        <TouchableOpacity
          onPress={() => setVisible({ ...visible, [index]: true })}
          style={[
            styles.selectButton,
            {
              backgroundColor:
                item.session1Filled || item.session2Filled
                  ? "#d3d3d3"
                  : "#0F67B1",
            },
          ]}
        >
          <Text style={styles.selectButtonText}>
            {item.milkman || "Select Milkman"}
          </Text>
        </TouchableOpacity>
      }
    >
      {users.map((user) => (
        <Menu.Item
          key={user._id}
          onPress={() => {
            const newData = [...data];
            newData[index].milkman = user.name;
            setData(newData);
            setVisible({ ...visible, [index]: false });
          }}
          title={user.name}
        />
      ))}
    </Menu>
  );

  const getRowStyle = (item) => {
    if ((selectedSession === "Session 1" && item.session1Filled) || 
        (selectedSession === "Session 2" && item.session2Filled)) {
      return { backgroundColor: "#f0f0f0" }; // Example background color for filled rows
    }
    return {};
  };
  
  const renderHeader = () => (
    <View style={styles.calendarContainer}>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dateButtonText}>
          {moment(date).format("MMM D, YYYY")}
        </Text>
      </TouchableOpacity>
      {modalVisible && (
        <View style={styles.modal}>
          <Calendar
            current={date}
            onDayPress={(day) => {
              const selectedDate = moment(day.dateString).format("YYYY-MM-DD");
              setDate(selectedDate);
              setModalVisible(false);
            }}
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
      )}
    </View>
  );

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 , marginTop : 5 , textAlign : "center" }}> Milk Entry </Text> 
        <Text style={{ fontSize: 19, fontWeight: "bold", marginBottom: 2, marginTop : 2}} > Select Date: </Text>
        {renderHeader()}
        <View style={styles.sessionToggle}>
          <Text>Select Session:</Text>
          <RadioButton.Group
            onValueChange={(value) => setSelectedSession(value)}
            value={selectedSession}
          >
            <View style={styles.radioButton}>
              <RadioButton value="Session 1" />
              <Text>Session 1</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="Session 2" />
              <Text>Session 2</Text>
            </View>
          </RadioButton.Group>
        </View>
        {selectedSession && (
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={["Serial No." ,"Cattle Name", "Milkman", selectedSession]}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
              widthArr={[65, 110,110,98 ]}
            />
            {data.map((item, index) => (
              <TableWrapper key={index} style={[styles.tableRow, getRowStyle(item)]}>
                    <Cell
  data={
    <View style={styles.serialNumberColumn}>
      <TextInput
        value={item.serialNumber?.toString()}
        onChangeText={(newSerialNumber) =>
          handleSerialNumberChange(index, newSerialNumber, item._id)
        }
        style={[styles.tableText, styles.input]}
        keyboardType="numeric"
      />
    </View>
  }
  textStyle={styles.tableText}
  width={65}
/>
                <Cell data={item.cattleName} textStyle={styles.tableText} />
                <Cell data={renderMenu(item, index)}  textStyle={styles.tableText}/>
                <Cell data={renderInput(item, index)} textStyle={styles.tableText} />
              </TableWrapper>
            ))}
          </Table>
        )}

        {selectedSession&& (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={updateSerialNumbers}
            disabled={loading}
          >
            <Text style={styles.updateButtonText}>
              {loading ? "Updating..." : "Update Order"}
            </Text>
          </TouchableOpacity>
        )}

        {selectedSession && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        )}

        <Button
          mode="contained"
          style={{ marginTop: 20  , padding : 5 , backgroundColor : "#4B70F5"}} 
          onPress={() => navigation.navigate("MilkData")}
        >
          View Milk Data
        </Button>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#ffffff",
  },
  tableBorder: {
    borderColor: "#cccccc",
    borderWidth: 0.5
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
    backgroundColor: "#f1f8ff",
  },
  tableText: {
    textAlign: "center",
    padding: 5,
  },
  input: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#B592FF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sessionToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  selectButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#ffffff",
    fontSize: 12.5,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    elevation: 4,
  },
  dateButton: {
    backgroundColor: "#0F67B1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  serialNumberColumn: {
    width: 65, // Adjust this value as needed for your layout
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#0F67B1", // Example custom color for update button
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MilkEntry;
