import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    padding: 20,
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: "#f0f4f7",
    borderWidth: 0,
    marginVertical: 10,
  },
  datePickerButton: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#B592FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: "#fff",
  },
  createGroupText: {
    color: "#B592FF",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});

const AddCattle3 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {
    name,
    type,
    breed,
    herd_lifecycle, 
    dob,
    healthStatus,
    housingType,
    milkingCapacity,
    cattleid,
    weight,
    identificationMark,
    motherName,
    fatherName,
  } = route.params;

  const [vaccinated, setVaccinated] = useState(false);
  const [dewormed, setDewormed] = useState(false);
  const [vaccinationDetails, setVaccinationDetails] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [dewormingDetails, setDewormingDetails] = useState("");
  const [dewormingDate, setDewormingDate] = useState("");

  const [isVaccinationDatePickerVisible, setVaccinationDatePickerVisibility] =
    useState(false);
  const [isDewormingDatePickerVisible, setDewormingDatePickerVisibility] =
    useState(false);

  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    // Fetch existing groups from your server
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://nareshwadi-goshala.onrender.com/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleVaccinationDateConfirm = (date) => {
    const selectedDate = moment(date);
    const cattleDob = moment(dob, "DD/MM/YYYY");

    if (
      selectedDate.isSameOrBefore(moment()) &&
      selectedDate.isSameOrAfter(cattleDob)
    ) {
      setVaccinationDate(selectedDate.format("DD/MM/YYYY"));
    } else {
      // Show an alert for invalid date
      Alert.alert(
        "Invalid Date",
        "Please select a date after the cattle's DOB and before today's date."
      );
    }
    setVaccinationDatePickerVisibility(false);
  };

  const handleDewormingDateConfirm = (date) => {
    const selectedDate = moment(date);
    const cattleDob = moment(dob, "DD/MM/YYYY");

    if (
      selectedDate.isSameOrBefore(moment()) &&
      selectedDate.isSameOrAfter(cattleDob)
    ) {
      setDewormingDate(selectedDate.format("DD/MM/YYYY"));
    } else {
      // Show an alert for invalid date
      Alert.alert(
        "Invalid Date",
        "Please select a date after the cattle's DOB and before today's date."
      );
    }
    setDewormingDatePickerVisibility(false);
  };

  const handleGroupSubmit = async () => {
    try {
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/addGroup", {
        name: newGroupName,
      });
      setGroups([...groups, response.data.group]);
      setNewGroupName("");
      setGroupModalVisible(false);
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  const handleSubmit = async () => {
    const formattedDob = moment(dob, "DD/MM/YYYY").toISOString();

    try {
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/addCattle", {
        name,
        type,
        breed,
        herd_lifecycle,
        dob: formattedDob,
        health_status: healthStatus,
        housingType,
        milkCapacity: milkingCapacity,
        cattleid,
        weight,
        identificationMark,
        motherName,
        fatherName,
        vaccinated,
        vaccinationDetails,
        vaccinationDate: vaccinated
          ? moment(vaccinationDate, "DD/MM/YYYY").toISOString()
          : null,
        dewormed,
        dewormingDetails,
        dewormingDate: dewormed
          ? moment(dewormingDate, "DD/MM/YYYY").toISOString()
          : null,
        group,
      });
      console.log("Cattle added successfully");
      navigation.navigate("ViewData");
    } catch (error) {
      console.error("Axios Error:", error);
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      extraScrollHeight={Platform.OS === "ios" ? 50 : 0} // Adjust as per your needs
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <Text style={styles.headerText}>Vaccination Details</Text>

      <CheckBox
        title="Vaccinated"
        checked={vaccinated}
        onPress={() => setVaccinated(!vaccinated)}
        containerStyle={styles.checkboxContainer}
      />

      {vaccinated && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Vaccination Details"
            value={vaccinationDetails}
            onChangeText={setVaccinationDetails}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setVaccinationDatePickerVisibility(true)}
          >
            <Text style={styles.datePickerButtonText}>
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
        </>
      )}

      <CheckBox
        title="Dewormed"
        checked={dewormed}
        onPress={() => setDewormed(!dewormed)}
        containerStyle={styles.checkboxContainer}
      />

      {dewormed && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Deworming Details"
            value={dewormingDetails}
            onChangeText={setDewormingDetails}
          />
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setDewormingDatePickerVisibility(true)}
          >
            <Text style={styles.datePickerButtonText}>
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
        </>
      )}

      <Text style={styles.headerText}>Group</Text>
      <Picker
        selectedValue={group}
        onValueChange={(itemValue) => setGroup(itemValue)}
        style={styles.input}
      >
        {groups.map((grp) => (
          <Picker.Item key={grp._id} label={grp.name} value={grp._id} />
        ))}
      </Picker>

      <TouchableOpacity onPress={() => setGroupModalVisible(true)}>
        <Text style={styles.createGroupText}>Click to create a new group</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <Modal
        visible={isGroupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Create New Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleGroupSubmit}
            >
              <Text style={styles.modalButtonText}>Create Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default AddCattle3;