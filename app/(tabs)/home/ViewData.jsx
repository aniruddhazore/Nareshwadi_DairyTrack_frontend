import React, { useState, useEffect } from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {
  View,
  Switch,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import axios from "axios";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Ionicons,
  Feather,
  FontAwesome6,
  FontAwesome,
} from "@expo/vector-icons";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  LifeCycleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  iconContainer: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    right: 50,
    backgroundColor: "#B592FF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerContainer: {
    backgroundColor: "#B592FF",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  LifecycleButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#B592FF",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  LifecycleButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  LcButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  LifeCycleContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "60%",
  },
  LcText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterPicker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#5C82D4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  editIconContainer: {
    position: "absolute",
    right: 25,
    top: 25,
  },
  editInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  filterIconContainer: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  discardButton: {
    backgroundColor: "#FF4C4C",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  discardButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteIconContainer: {
    position: "absolute",
    right: 23,
    top: 85,
  },
});

const ViewData = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [cattle, setCattle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    breed: "",
    housingType: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showBreedPicker, setShowBreedPicker] = useState(false);
  const [showHousingTypePicker, setShowHousingTypePicker] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCattle, setCurrentCattle] = useState(null);
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  const [selectedHerdLifecycle, setSelectedHerdLifecycle] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    dob: "",
    health_status: "",
    housingType: "",
    milkCapacity: "",
    weight: "",
    vaccinated: false,  // Include vaccination-related fields
    vaccinationDetails: "",
    vaccinationDate: "",
    dewormed: false,     // Include deworming-related fields
    dewormingDetails: "",
    dewormingDate: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchCattle(selectedGroup, filters);
    }
  }, [selectedGroup, filters]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://nareshwadi-goshala.onrender.com/groups");
      setGroups(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setLoading(false);
    }
  };

  const fetchCattle = async (groupId, filters) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://nareshwadi-goshala.onrender.com/groups/${groupId}/getcattle`,
        {
          params: {
            ...filters,
            groupId,
          },
        }
      );
      setCattle(response.data.map(item => ({
        ...item,
        vaccination: item.vaccination || [], // Default to an empty array if not present
        deworming: item.deworming || [],     // Default to an empty array if not present
      })));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cattle:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setIsModalVisible(false);
    if (selectedGroup) {
      fetchCattle(selectedGroup, filters);
    }
  };

  const handlePickerToggle = (picker) => {
    setShowTypePicker(picker === "type" ? !showTypePicker : false);
    setShowBreedPicker(picker === "breed" ? !showBreedPicker : false);
    setShowHousingTypePicker(
      picker === "housingType" ? !showHousingTypePicker : false
    );
  };

  const openEditModal = (cattle) => {

    // Check if the cattle has vaccination and deworming data
    const hasVaccinationData = cattle.vaccinationDetails || cattle.vaccinationDate;
    const hasDewormingData = cattle.dewormingDetails || cattle.dewormingDate;

    setCurrentCattle(cattle);

    setEditForm({
      name: cattle.name,
      type: cattle.type,
      dob: moment(cattle.dob).format("YYYY-MM-DD"),
      health_status: cattle.health_status,
      housingType: cattle.housingType,
      milkCapacity: cattle.milkCapacity,
      weight: cattle.weight,
      vaccinated: cattle.vaccinated || hasVaccinationData, // Check both vaccinated flag and data presence
      vaccinationDetails: cattle.vaccinationDetails || '', // Initialize vaccination details if available
      vaccinationDate: cattle.vaccinationDate ? moment(cattle.vaccinationDate).format("YYYY-MM-DD") : '', // Format vaccination date
      dewormed: cattle.dewormed || hasDewormingData, // Check both dewormed flag and data presence
      dewormingDetails: cattle.dewormingDetails || '', // Initialize deworming details if available
      dewormingDate: cattle.dewormingDate ? moment(cattle.dewormingDate).format("YYYY-MM-DD") : '', // Format deworming date
    });

    setEditModalVisible(true);
};


  const handleAddHerdLifecycle = async (herd_lifecycle) => {
    try {
      // Set selected lifecycle
      setSelectedHerdLifecycle(herd_lifecycle);

      // Navigate to the next screen with herd_lifecycle as a parameter
      navigation.navigate("AddCattle", { herd_lifecycle });

      setShowLifecycleModal(false);
    } catch (error) {
      console.error("Error adding cattle:", error);
      Alert.alert("Error", "Failed to add cattle. Please try again.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const saveCattleChanges = async () => {
    try {
      await axios.put(
        `http://nareshwadi-goshala.onrender.com/updateCattle/${currentCattle._id}`,
        editForm
      );
      fetchCattle(selectedGroup, filters);
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating cattle:", error);
    }
  };

  const discardCattleChanges = () => {
    setEditModalVisible(false);
  };

  const deleteCattle = async (cattleId) => {
    try {
      await axios.delete(`http://nareshwadi-goshala.onrender.com/deleteCattle/${cattleId}`);
      fetchCattle(selectedGroup, filters);
    } catch (error) {
      console.error("Error deleting cattle:", error);
    }
  };

  const confirmDeleteCattle = (cattleId) => {
    Alert.alert(
      "Delete Cattle",
      "Are you sure you want to delete this cattle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteCattle(cattleId),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cattle List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4c669f" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.pickerContainer}
            onPress={() => setShowGroupPicker(!showGroupPicker)}
          >
            <Text style={styles.pickerText}>
              {selectedGroup
                ? groups.find((g) => g._id === selectedGroup)?.name
                : "Choose Group"}
            </Text>
            <Ionicons
              name={showGroupPicker ? "chevron-up" : "chevron-down"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {showGroupPicker && (
            <Picker
              style={{
                ...styles.picker,
                backgroundColor: "#fff",
                borderRadius: 5,
                marginBottom: 10,
              }}
              selectedValue={selectedGroup}
              onValueChange={(itemValue) => {
                setSelectedGroup(itemValue);
                setShowGroupPicker(false);
              }}
            >
              {groups.map((group) => (
                <Picker.Item
                  key={group._id}
                  label={group.name}
                  value={group._id}
                />
              ))}
            </Picker>
          )}

          <TouchableOpacity
            style={styles.filterIconContainer}
            onPress={() => setIsModalVisible(true)}
          >
            <Feather name="filter" size={30} color="#B592FF" />
          </TouchableOpacity>

          <FlatList
            data={cattle}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="cow" size={58} color="black" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemNameText}>
                    {`${item.name || "N/A"} - ${item.type || "N/A"}`}
                  </Text>
                  <Text style={styles.itemText}>
                    DOB: {moment(item.dob).format("DD/MM/YYYY") || "N/A"}
                  </Text>
                  <Text style={styles.itemText}>
                    Health Status: {item.health_status || "N/A"}
                  </Text>
                  <Text style={styles.itemText}>
                    Housing Type: {item.housingType || "N/A"}
                  </Text>
                  <Text style={styles.itemText}>
                    Milking Threshold: {item.milkCapacity || "N/A"} Litres
                  </Text>
                  <Text style={styles.itemText}>
                    Weight: {item.weight || "N/A"}
                  </Text>
                  <TouchableOpacity
                    style={styles.editIconContainer}
                    onPress={() => openEditModal(item)}
                  >
                    <FontAwesome name="pencil" size={30} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={() => confirmDeleteCattle(item._id)}
                  >
                    <EvilIcons name="trash" size={45} color="#333" />
                    {/* <MaterialIcons name="delete" size={45} color="grey" /> */}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowLifecycleModal(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.headerText}>Filter Options</Text>
              <View style={styles.filterContainer}>
                <Text>Type</Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() => handlePickerToggle("type")}
                >
                  <Text style={styles.pickerText}>
                    {filters.type || "Select Type"}
                  </Text>
                  <Ionicons
                    name={showTypePicker ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>

                {showTypePicker && (
                  <Picker
                    selectedValue={filters.type}
                    style={styles.filterPicker}
                    onValueChange={(itemValue) =>
                      setFilters({ ...filters, type: itemValue })
                    }
                  >
                    <Picker.Item label="All Types" value="" />
                    <Picker.Item label="Cow" value="Cow" />
                    <Picker.Item label="Bull" value="Bull" />
                  </Picker>
                )}

                <Text>Breed</Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() => handlePickerToggle("breed")}
                >
                  <Text style={styles.pickerText}>
                    {filters.breed || "Select Breed"}
                  </Text>
                  <Ionicons
                    name={showBreedPicker ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>

                {showBreedPicker && (
                  <Picker
                    selectedValue={filters.breed}
                    style={styles.filterPicker}
                    onValueChange={(itemValue) =>
                      setFilters({ ...filters, breed: itemValue })
                    }
                  >
                    <Picker.Item label="All Breeds" value="" />
                    <Picker.Item label="Gir" value="gir" />
                    <Picker.Item label="HF Cross" value="hfC" />
                    <Picker.Item label="Jersey" value="jerseyC" />
                  </Picker>
                )}

                <Text>Housing Type</Text>
                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={() => handlePickerToggle("housingType")}
                >
                  <Text style={styles.pickerText}>
                    {filters.housingType || "Select Housing Type"}
                  </Text>
                  <Ionicons
                    name={showHousingTypePicker ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>

                {showHousingTypePicker && (
                  <Picker
                    selectedValue={filters.housingType}
                    style={styles.filterPicker}
                    onValueChange={(itemValue) =>
                      setFilters({ ...filters, housingType: itemValue })
                    }
                  >
                    <Picker.Item label="All Housing Types" value="" />
                    <Picker.Item label="Loose Housing" value="loose housing" />
                    <Picker.Item label="Semi Tied-up" value="semi tied-up" />
                    <Picker.Item label="Tied-up" value="tied-up" />
                  </Picker>
                )}
              </View>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={applyFilters}
              >
                <Text style={styles.filterButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Edit Cattle</Text>
            <ScrollView>
              <TextInput
                style={styles.editInput}
                placeholder="Name"
                value={editForm.name}
                onChangeText={(value) => handleEditChange("name", value)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Type"
                value={editForm.type}
                onChangeText={(value) => handleEditChange("type", value)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="DOB"
                value={editForm.dob}
                onChangeText={(value) => handleEditChange("dob", value)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Health Status"
                value={editForm.health_status}
                onChangeText={(value) =>
                  handleEditChange("health_status", value)
                }
              />
              <TextInput
                style={styles.editInput}
                placeholder="Housing Type"
                value={editForm.housingType}
                onChangeText={(value) => handleEditChange("housingType", value)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Milk Capacity"
                value={editForm.milkCapacity}
                onChangeText={(value) =>
                  handleEditChange("milkCapacity", value)
                }
              />
              <TextInput
                style={styles.editInput}
                placeholder="Weight"
                value={editForm.weight}
                onChangeText={(value) => handleEditChange("weight", value)}
              />
              {/* Vaccinated Switch */}
             <View style={styles.switchContainer}>
               <Text>Vaccinated:</Text>
               <Switch
                 value={editForm.vaccinated}
                 onValueChange={(value) =>
                   handleEditChange("vaccinated", value)
                 }
               />
             </View>
           
             {/* Vaccination Fields */}
             <TextInput
               style={styles.editInput}
               placeholder="Vaccination Details"
               value={editForm.vaccinationDetails}
               editable={editForm.vaccinated} // Disable if vaccinated is false
               onChangeText={(value) =>
                 handleEditChange("vaccinationDetails", value)
               }
             />
           
             <TextInput
               style={styles.editInput}
               placeholder="Vaccination Date"
               value={editForm.vaccinationDate}
               editable={editForm.vaccinated} // Disable if vaccinated is false
               onChangeText={(value) =>
                 handleEditChange("vaccinationDate", value)
               }
             />
           
             {/* Dewormed Switch */}
             <View style={styles.switchContainer}>
               <Text>Dewormed:</Text>
               <Switch
                 value={editForm.dewormed}
                 onValueChange={(value) =>
                   handleEditChange("dewormed", value)
                 }
               />
             </View>
           
             {/* Deworming Fields */}
             <TextInput
               style={styles.editInput}
               placeholder="Deworming Details"
               value={editForm.dewormingDetails}
               editable={editForm.dewormed} // Disable if dewormed is false
               onChangeText={(value) =>
                 handleEditChange("dewormingDetails", value)
               }
             />
           
             <TextInput
               style={styles.editInput}
               placeholder="Deworming Date"
               value={editForm.dewormingDate}
               editable={editForm.dewormed} // Disable if dewormed is false
               onChangeText={(value) =>
                 handleEditChange("dewormingDate", value)
               }
             />
            </ScrollView>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveCattleChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.discardButton}
              onPress={discardCattleChanges}
            >
              <Text style={styles.discardButtonText}>Discard Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showLifecycleModal}
        // transparent={true}
        animationType="fade"
        // style={backgroundColor = "white"}
        onRequestClose={() => setShowLifecycleModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.LifeCycleContainer}>
            <View style={styles.LifecycleContent}>
              <Text style={styles.LcText}>Select Herd Lifecycle</Text>
              <View style={styles.LifecycleButtonContainer}>
                <TouchableOpacity
                  style={styles.LifecycleButton}
                  onPress={() => handleAddHerdLifecycle("Calf")}
                >
                  <MaterialCommunityIcons name="cow" size={30} color="black" />
                  <Text style={styles.LcButtonText}>Calf</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.LifecycleButton}
                  onPress={() => handleAddHerdLifecycle("Heifer")}
                >
                  <MaterialCommunityIcons name="cow" size={30} color="black" />
                  <Text style={styles.LcButtonText}>Heifer</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.LifecycleButtonContainer}>
                <TouchableOpacity
                  style={styles.LifecycleButton}
                  onPress={() => handleAddHerdLifecycle("Adult")}
                >
                  <MaterialCommunityIcons name="cow" size={30} color="black" />
                  <Text style={styles.LcButtonText}>Adult</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.LifecycleButton}
                  onPress={() => handleAddHerdLifecycle("Retired")}
                >
                  <MaterialCommunityIcons name="cow" size={30} color="black" />
                  <Text style={styles.LcButtonText}>Retired</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ViewData;
