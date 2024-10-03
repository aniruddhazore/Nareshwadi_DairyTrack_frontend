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
import { useNavigation } from "@react-navigation/native";
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
  },
  cattleText: {
    fontSize: 20,
    marginLeft: 10,
  },
  groupText: {
    fontSize: 14, // Adjust the font size as needed
    marginLeft: 10,
    color: "#666", // Adjust the color as needed
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

const EditGroup = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [cattle, setCattle] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedCattle, setSelectedCattle] = useState([]);
  const [isGroupModalVisible, setGroupModalVisibility] = useState(false);
  const [selectAllCattle, setSelectAllCattle] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchCattle();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        "http://nareshwadi-goshala.onrender.com/groups"
      );
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const addNewGroup = async () => {
    try {
      const response = await axios.post(
        "http://nareshwadi-goshala.onrender.com/addGroup",
        {
          name: newGroupName,
        }
      );
      setGroups([...groups, response.data.group]);
      setNewGroupName("");
    } catch (error) {
      console.error("Error adding new group:", error);
    }
  };

  const fetchCattle = async () => {
    try {
      const response = await axios.get(
        "http://nareshwadi-goshala.onrender.com/getCattle"
      );
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

  const saveGroupChanges = async () => {
    try {
      if (!selectedGroup || selectedCattle.length === 0) {
        Alert.alert("Error", "Please select a group and cattle.");
        return;
      }

      const response = await axios.put(
        "http://nareshwadi-goshala.onrender.com/cattle/group",
        {
          cattleIds: selectedCattle,
          groupId: selectedGroup,
        }
      );

      console.log("Group changes saved successfully:", response.data);
      setSelectedCattle([]);
      setSelectedGroup(null);
      Alert.alert("Success", "Group changes saved successfully!");
    } catch (error) {
      console.error("Error saving group changes:", error);
      Alert.alert("Error", "Failed to save group changes. Please try again.");
    }
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

  // const renderCattleItem = (cow) => (
  //   <View key={item._id} style={styles.checkboxContainer}>
  //     <TouchableOpacity onPress={() => toggleCattleSelection(item._id)}>
  //       <CheckBox
  //         checked={selectedCattle.includes(item._id)}
  //         onPress={() => toggleCattleSelection(item._id)}
  //         containerStyle={styles.checkbox}
  //       />
  //     </TouchableOpacity>
  //     <FontAwesome6 name="cow" size={24} color="black" />
  //     <Text style={styles.cattleText}>{item.name} - ({item.group ? item.group.name : "No Group"})</Text>
  //   </View>
  // );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Edit Group</Text>

      <Text style={styles.label}>Select a Group:</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setGroupModalVisibility(true)}
      >
        <Text>
          {selectedGroup
            ? groups.find((g) => g._id === selectedGroup).name
            : "Select a Group"}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isGroupModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={groups}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedGroup(item._id);
                    setGroupModalVisibility(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
            <Button
              title="Close"
              onPress={() => setGroupModalVisibility(false)}
              style={styles.button}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Add a New Group:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new group name"
        value={newGroupName}
        onChangeText={setNewGroupName}
      />
      <Button title="Add Group" onPress={addNewGroup} style={styles.button} />

      <Text style={styles.label}>Select Cattle:</Text>
      <TouchableOpacity
        onPress={toggleSelectAllCattle}
        style={styles.selectAllButton}
      >
        <Text style={styles.selectAllButtonText}>
          {selectAllCattle ? "Deselect All" : "Select All"}
        </Text>
      </TouchableOpacity>
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
          <View>
            <Text style={styles.cattleText}>{cow.name}</Text>
            <Text style={styles.groupText}>
              Current group: {cow.group ? cow.group.name : "No Group"}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={saveGroupChanges}>
        <Text style={styles.buttonText}>Save Group Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditGroup;