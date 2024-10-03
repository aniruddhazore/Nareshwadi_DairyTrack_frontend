import React, { useState , useEffect } from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation,useRoute } from "@react-navigation/native";
import { route } from "@react-navigation/routers";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const AddCattle = () => {
  const route = useRoute();
  const [name, setName] = useState("");
  const [cattleid, setCattleid] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [dob, setDob] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [housingType, setHousingType] = useState("");
  const [milkingCapacity, setMilkingCapacity] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showBreedModal, setShowBreedModal] = useState(false);
  const [showHousingModal, setShowHousingModal] = useState(false);
  const [existingCattleIds, setExistingCattleIds] = useState([]);
  const { herd_lifecycle } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch existing cattle IDs
    const fetchExistingCattleIds = async () => {
      try {
        const response = await axios.get("http://nareshwadi-goshala.onrender.com/getCattleID");
        setExistingCattleIds(response.data);
      } catch (error) {
        console.error("Error fetching cattle IDs:", error);
      }
    };

      fetchExistingCattleIds();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    setDob(formattedDate);
    hideDatePicker();
  };

  const handleNext = () => {
    if (!name || !cattleid || !type || !dob || !healthStatus || !housingType) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    } 
    if (existingCattleIds.includes(cattleid)) {
      Alert.alert("Error", "Cattle with this ID already exists. Please enter a unique ID.");
      return;
    }else {
      navigation.navigate("AddCattle2", {
        name,
        cattleid,
        type,
        herd_lifecycle,
        breed,
        dob,
        healthStatus,
        housingType,
        milkingCapacity,
      });
    }
  };

  const handleSelectType = (selectedType) => {
    setType(selectedType);
    setShowTypeModal(false);
  };

  const handleSelectBreed = (selectedBreed) => {
    setBreed(selectedBreed);
    setShowBreedModal(false);
  };

  const handleSelectHousingType = (selectedHousingType) => {
    setHousingType(selectedHousingType);
    setShowHousingModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Add Cattle</Text>
      <TextInput
        style={styles.input}
        placeholder="Cattle Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Cattle No.(Govt ID)"
        value={cattleid}
        onChangeText={setCattleid}
      />
      {/* Type Picker Modal */}
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowTypeModal(true)}
      >
        <Text style={styles.modalButtonText}>
          {type ? `Type: ${type}` : "Select Cattle Type*"}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>
      <Modal
        visible={showTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTypeModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectType("Cow")}
              >
                <Text style={styles.modalOptionText}>Cow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectType("Bull")}
              >
                <Text style={styles.modalOptionText}>Bull</Text>
              </TouchableOpacity>
              {/* Add more types as needed */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Breed Picker Modal */}
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowBreedModal(true)}
      >
        <Text style={styles.modalButtonText}>
          {breed ? `Breed: ${breed}` : "Select Cattle Breed"}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>
      <Modal
        visible={showBreedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBreedModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBreedModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectBreed("gir")}
              >
                <Text style={styles.modalOptionText}>Gir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectBreed("hfC")}
              >
                <Text style={styles.modalOptionText}>HF Cross</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectBreed("jerseyC")}
              >
                <Text style={styles.modalOptionText}>Jersey Cross</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <TextInput
        style={styles.input}
        placeholder="Milking Capacity (in litres)"
        value={milkingCapacity}
        onChangeText={setMilkingCapacity}
        keyboardType="numeric"
      />

      
      {/* Housing Type Picker Modal */}
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowHousingModal(true)}
      >
        <Text style={styles.modalButtonText}>
          {housingType ? `Housing Type: ${housingType}` : "Select Housing Type"}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>
      <Modal
        visible={showHousingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHousingModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowHousingModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectHousingType("loose housing")}
              >
                <Text style={styles.modalOptionText}>Loose Housing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectHousingType("semi tied-up")}
              >
                <Text style={styles.modalOptionText}>Semi Tied-up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleSelectHousingType("tied-up")}
              >
                <Text style={styles.modalOptionText}>Tied-up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date of Birth Picker */}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={showDatePicker}
      >
        <Text style={styles.datePickerText}>
        {dob ? `DOB: ${dob}`: "Select Date of Birth"}
        </Text>
        <MaterialIcons name="calendar-today" size={24} color="black" />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()} // Set the maximum date to the current date
      />

      {/* Health Status Input */}
      <TextInput
        style={styles.input}
        placeholder="Health Status"
        value={healthStatus}
        onChangeText={setHealthStatus}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#fff",
    fontSize: 16, // Ensure consistent font size
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#B592FF", // Pink shade similar to the previous one
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "60%",
  },
  modalButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalButtonText: {
    fontSize: 16,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalOptionText: {
    fontSize: 18,
  },
});

export default AddCattle;