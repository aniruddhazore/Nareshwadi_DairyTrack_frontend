import React, { useState, useEffect } from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import axios from "axios";
import { CheckBox } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { FontAwesome6 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#B592FF",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  checkboxContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
  },
  cattleText: {
    fontSize: 20,
    marginLeft: 10,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 18,
  },
  checkbox: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectAllButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 20,
  },
  selectAllButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

const DewormingUpdate = () => {
  const [dewormers, setDewormers] = useState([]);
  const [cattle, setCattle] = useState([]);
  const [selectedDewormer, setSelectedDewormer] = useState(null);
  const [newDewormer, setNewDewormer] = useState("");
  const [selectedCattle, setSelectedCattle] = useState([]);
  const [dewormingDate, setDewormingDate] = useState("");
  const [isDewormingDatePickerVisible, setDewormingDatePickerVisibility] =
    useState(false);
  const [isDewormerModalVisible, setDewormerModalVisibility] = useState(false);
  const [selectAllCattle, setSelectAllCattle] = useState(false);

  useEffect(() => {
    fetchDewormers();
    fetchCattle();
  }, []);

  const fetchDewormers = async () => {
    try {
      const response = await axios.get("http://nareshwadi-goshala.onrender.com/dewormers");
      setDewormers(response.data);
    } catch (error) {
      console.error("Error fetching dewormers:", error);
    }
  };

  const addNewDewormer = async () => {
    try {
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/dewormers", {
        name: newDewormer,
      });
      setDewormers([...dewormers, response.data.dewormer]);
      setNewDewormer("");
    } catch (error) {
      console.error("Error adding new dewormer:", error);
    }
  };

  const fetchCattle = async () => {
    try {
      const response = await axios.get("http://nareshwadi-goshala.onrender.com/getCattle");
      setCattle(response.data);
    } catch (error) {
      console.error("Error fetching cattle:", error);
    }
  };

  const toggleCattleSelection = (cattleId) => {
    setSelectedCattle((prevSelected) =>
      prevSelected.includes(cattleId)
        ? prevSelected.filter((id) => id !== cattleId)
        : [...prevSelected, cattleId]
    );
  };

  const toggleSelectAllCattle = () => {
    setSelectAllCattle(!selectAllCattle);
    if (!selectAllCattle) {
      const allCattleIds = cattle.map((cow) => cow._id);
      setSelectedCattle(allCattleIds);
    } else {
      setSelectedCattle([]);
    }
  };


  const saveDewormings = async () => {
    try {
      if (!selectedDewormer || selectedCattle.length === 0 || !dewormingDate) {
        Alert.alert(
          "Error",
          "Please select a dewormer, cattle, and deworming date."
        );
        return;
      }
  
      const dewormingData = {
        dewormerId: selectedDewormer,
        cattleIds: selectedCattle,
        date: dewormingDate,
      };
  
      console.log("Sending data to backend:", dewormingData);
  
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/dewormings", dewormingData);
  
      console.log("Dewormings saved successfully:", response.data);
      setSelectedCattle([]);
      setSelectedDewormer(null);
      setDewormingDate("");
      Alert.alert("Success", "Dewormings saved successfully!");
    } catch (error) {
      console.error("Error saving dewormings:", error);
      Alert.alert("Error", "Failed to save dewormings. Please try again.");
    }
  };
  

  const handleDewormingDateConfirm = (date) => {
    const selectedDate = moment(date);

    if (selectedDate.isSameOrBefore(moment())) {
      setDewormingDate(selectedDate.format("YYYY-MM-DD"));
    } else {
      Alert.alert("Invalid Date", "Please select a date before today's date.");
    }
    setDewormingDatePickerVisibility(false);
  };

  const renderCattleItem = (item) => (
    <View key={item._id} style={styles.checkboxContainer}>
      <TouchableOpacity onPress={() => toggleCattleSelection(item._id)}>
        <CheckBox
          checked={selectedCattle.includes(item._id)}
          onPress={() => toggleCattleSelection(item._id)}
          containerStyle={styles.checkbox}
        />
      </TouchableOpacity>
      <FontAwesome6 name="cow" size={24} color="black" />
      <Text style={styles.cattleText}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Deworming Update</Text>

      <Text style={styles.label}>Select a Dewormer:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setDewormerModalVisibility(true)}
      >
        <Text>
          {selectedDewormer
            ? dewormers.find((d) => d._id === selectedDewormer).name
            : "Select a Dewormer"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isDewormerModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={dewormers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDewormer(item._id);
                    setDewormerModalVisibility(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
            <Button
              title="Close"
              onPress={() => setDewormerModalVisibility(false)}
              style={styles.button}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Add a New Dewormer:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new dewormer name"
        value={newDewormer}
        onChangeText={setNewDewormer}
      />
      <Button
        title="Add Dewormer"
        onPress={addNewDewormer}
        style={styles.button}
      />

      <Text style={styles.label}>Select Deworming Date:</Text>
      <TouchableOpacity
        style={styles.datePickerInput}
        onPress={() => setDewormingDatePickerVisibility(true)}
      >
        <Text style={styles.datePickerInput}>
          {dewormingDate
            ? `Deworming Date: ${dewormingDate}`
            : "Select Deworming Date"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDewormingDatePickerVisible}
        mode="date"
        onConfirm={handleDewormingDateConfirm}
        onCancel={() => setDewormingDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Select Cattle:</Text>
      <TouchableOpacity
        onPress={toggleSelectAllCattle}
        style={styles.selectAllButton}
      >
        <Text style={styles.selectAllButtonText}>
          {selectAllCattle ? "Deselect All" : "Select All"}
        </Text>
      </TouchableOpacity>
      {cattle.map(renderCattleItem)}

      <TouchableOpacity style={styles.button} onPress={saveDewormings}>
        <Text style={styles.buttonText}>Save Dewormings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DewormingUpdate;