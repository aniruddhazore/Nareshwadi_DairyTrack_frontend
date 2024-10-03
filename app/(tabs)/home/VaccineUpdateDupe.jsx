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
});

const VaccineUpdateDupe = () => {
  const [vaccines, setVaccines] = useState([]);
  const [cattle, setCattle] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [newVaccine, setNewVaccine] = useState("");
  const [selectedCattle, setSelectedCattle] = useState([]);
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [isVaccinationDatePickerVisible, setVaccinationDatePickerVisibility] =
    useState(false);
  const [isVaccineModalVisible, setVaccineModalVisibility] = useState(false);

  useEffect(() => {
    fetchVaccines();
    fetchCattle();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await axios.get("https://nareshwadi-goshala.onrender.com/vaccines");
      setVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const addNewVaccine = async () => {
    try {
      const response = await axios.post("https://nareshwadi-goshala.onrender.com/vaccines", {
        name: newVaccine,
      });
      setVaccines([...vaccines, response.data.vaccine]);
      setNewVaccine("");
    } catch (error) {
      console.error("Error adding new vaccine:", error);
    }
  };

  const fetchCattle = async () => {
    try {
      const response = await axios.get("https://nareshwadi-goshala.onrender.com/getCattle");
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

  const saveVaccinations = async () => {
    try {
      if (!selectedVaccine || selectedCattle.length === 0 || !vaccinationDate) {
        Alert.alert(
          "Error",
          "Please select a vaccine, cattle, and vaccination date."
        );
        return;
      }

      const response = await axios.post("https://nareshwadi-goshala.onrender.com/vaccinations", {
        vaccineId: selectedVaccine,
        cattleIds: selectedCattle,
        date: vaccinationDate,
      });

      console.log("Vaccinations saved successfully:", response.data);
      setSelectedCattle([]);
      setSelectedVaccine(null);
      setVaccinationDate("");
      Alert.alert("Success", "Vaccinations saved successfully!");
    } catch (error) {
      console.error("Error saving vaccinations:", error);
      Alert.alert("Error", "Failed to save vaccinations. Please try again.");
    }
  };

  const handleVaccinationDateConfirm = (date) => {
    const selectedDate = moment(date);

    if (selectedDate.isSameOrBefore(moment())) {
      setVaccinationDate(selectedDate.format("YYYY-MM-DD"));
    } else {
      Alert.alert("Invalid Date", "Please select a date before today's date.");
    }
    setVaccinationDatePickerVisibility(false);
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
      <Text style={styles.cattleText}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Vaccination Update</Text>

      <Text style={styles.label}>Select a Vaccine:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setVaccineModalVisibility(true)}
      >
        <Text>
          {selectedVaccine
            ? vaccines.find((v) => v._id === selectedVaccine).name
            : "Select a Vaccine"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isVaccineModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={vaccines}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedVaccine(item._id);
                    setVaccineModalVisibility(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
            <Button
              title="Close"
              onPress={() => setVaccineModalVisibility(false)}
              style={styles.button}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Add a New Vaccine:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new vaccine name"
        value={newVaccine}
        onChangeText={setNewVaccine}
      />
      <Button
        title="Add Vaccine"
        onPress={addNewVaccine}
        style={styles.button}
      />

      <Text style={styles.label}>Select Vaccination Date:</Text>
      <TouchableOpacity
        style={styles.datePickerInput}
        onPress={() => setVaccinationDatePickerVisibility(true)}
      >
        <Text style={styles.datePickerInput}>
          {vaccinationDate
            ? `Vaccination Date: ${vaccinationDate}`
            : "Select Vaccination Date"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isVaccinationDatePickerVisible}
        mode="date"
        onConfirm={handleVaccinationDateConfirm}
        onCancel={() => setVaccinationDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Select Cattle:</Text>
      {cattle.map((cow) => (
        <View key={cow._id} style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => toggleCattleSelection(cow._id)}>
            <CheckBox
              checked={selectedCattle.includes(cow._id)}
              onPress={() => toggleCattleSelection(cow._id)}
              containerStyle={styles.checkbox}
            />
          </TouchableOpacity>
          <FontAwesome6 name="cow" size={24} color="black" />
          <Text style={styles.cattleText}>{cow.name}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={saveVaccinations}>
        <Text style={styles.buttonText}>Save Vaccinations</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VaccineUpdateDupe;
