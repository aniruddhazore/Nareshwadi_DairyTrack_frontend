import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
  Foundation,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import axios from "axios";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { jwtDecode } from "jwt-decode";
import NetInfo from '@react-native-community/netinfo';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#041E42",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    backgroundColor: "#B592FF",
    borderRadius: 10,
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // modalEditContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   padding: 20,
  //   height: "100%",
  // },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "60%",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#B592FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  modalButton: {
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
  modalButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  chartContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  modalEditContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalEditContent: {
    width: "90%", // Keeps the width at 90% of the screen width
    maxWidth: 400, // Sets a maximum width
    height: 300, // Sets a fixed height for the modal
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: "center", // Centers content vertically
  },
  modalEditText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputEdit: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  submitEditButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B592FF", // Match the button color you mentioned
    paddingVertical: 12, // Increased padding for better touch target
    borderRadius: 5,
    marginTop: 10, // Adds margin to separate from inputs
  },
  submitEditButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },

  editButton: {
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
});

const Button = ({ onPress, iconName, iconLib, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
    <View style={styles.icon}>
      {iconLib === "AntDesign" && (
        <AntDesign name={iconName} size={24} color="black" />
      )}
      {iconLib === "MaterialIcons" && (
        <MaterialIcons name={iconName} size={24} color="black" />
      )}
      {iconLib === "Feather" && (
        <Feather name={iconName} size={26} color="black" />
      )}
      {iconLib === "MaterialCommunityIcons" && (
        <MaterialCommunityIcons name={iconName} size={30} color="black" />
      )}
      {iconLib === "FontAwesome" && (
        <FontAwesome name={iconName} size={24} color="black" />
      )}
      {iconLib === "Foundation" && (
        <Foundation name={iconName} size={24} color="black" />
      )}
    </View>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const Index = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showCattleOptions, setShowCattleOptions] = useState(false);
  const [selectedHerdLifecycle, setSelectedHerdLifecycle] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  // const [newName, setNewName] = useState(""); // New state for new name
  // const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // New state for new password
  const router = useRouter();

  const [lifecycleCounts, setLifecycleCounts] = useState([]);
  const [milkYieldData, setMilkYieldData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isConnected, setIsConnected] = useState("");
  const [isSyncing, setIsSyncing] = useState(false); // Track syncing status

  const screenWidth = Dimensions.get("window").width;


  useEffect(() => {


    // Initial check for connection state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        syncOfflineData(); // Sync immediately if connected
      }
    });

    // Subscribe to connection state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        syncOfflineData(); // Sync when reconnected

      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);




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

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        console.log("Fetching token from AsyncStorage...");
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token from AsyncStorage:", token);
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log("Decoded token:", decodedToken);
          setUserRole(decodedToken.userType);
          setUsername(decodedToken.name);
          setUserId(decodedToken.userId);
          console.log("Fetched UserRole", userRole);
          console.log("Fetched Username", username);
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      }
    };

    fetchUsername();

    fetchLifecycleCounts();
    fetchMilkYieldData();
  }, []);

  const handleAddGroup = async () => {
    try {
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/addGroup", {
        name: newGroupName,
      });
      setGroups([...groups, response.data.group]);
      setNewGroupName("");
      setShowModal(false);
      Alert.alert("Success", "Group created successfully!");
    } catch (error) {
      console.error("Error adding group:", error);
      Alert.alert("Error", "Failed to add group. Please try again.");
    }
  };

  const handleAddHerdLifecycle = async (herd_lifecycle) => {
    try {
      // Set selected lifecycle
      setSelectedHerdLifecycle(herd_lifecycle);

      // Navigate to the next screen with herd_lifecycle as a parameter
      navigation.navigate("AddCattle", { herd_lifecycle });

      setShowCattleOptions(false);
    } catch (error) {
      console.error("Error adding cattle:", error);
      Alert.alert("Error", "Failed to add cattle. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/(Auth)/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const fetchLifecycleCounts = async () => {
    // if (!isConnected) return; 
    try {
      const response = await axios.get(
        "http://nareshwadi-goshala.onrender.com/getLifecycleCounts"
      );
      setLifecycleCounts(response.data);
    } catch (error) {
      console.error("Error fetching lifecycle counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilkYieldData = async () => {
    // if (!isConnected) return; 
    try {
      const response = await axios.get(
        "http://nareshwadi-goshala.onrender.com/getMilkYieldData"
      );
      setMilkYieldData(response.data);
    } catch (error) {
      console.error("Error fetching milk yield data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserDetails = () => {
    // Logic to edit user details goes here
    setShowEditModal(true);
  };

  const handleSaveUserDetails = async () => {
    try {
      // Validate new password
      if (!newPassword.match(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/)) {
        Alert.alert(
          "Invalid Password",
          "Password must be at least 8 characters long and contain both letters and numbers."
        );
        return;
      }

      // Get auth token
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication token is missing.");
        return;
      }

  
    // Decode token to get user details
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId; // Assuming userId is stored in the token
    
      if (!userId) {
        Alert.alert("Error", "User ID is missing.");
        return;
      }

      console.log(`Making PUT request to: http://nareshwadi-goshala.onrender.com/users/${userId}/password`);

      // Make PUT request to update user details
      const response = await axios.put(
        `http://nareshwadi-goshala.onrender.com/users/${userId}/password`,
        {
          // Ensure userId is correctly defined
          password: newPassword, // Use newPassword instead of password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle response and update local state
      if (response.status === 200) {
        Alert.alert("Success", "Password updated successfully!");
        setShowEditModal(false);
        // Optionally, refresh user details
        // fetchUserDetails();
      } else {
        Alert.alert(
          "Error",
          "Failed to update user details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "An error occurred while updating user details.");
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#498",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#4985",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const predefinedColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
  ];

  const renderPieChart = () => {
    if (lifecycleCounts && lifecycleCounts.length > 0) {
      const pieChartData = lifecycleCounts.map((item, index) => ({
        name: item.lifecycleType,
        population: item.count,
        color: predefinedColors[index % predefinedColors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Cattle Distribution by Lifecycle
          </Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 16}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      );
    } else {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Cattle Distribution by Lifecycle
          </Text>
          <Text style={{ textAlign: "center" }}>No data available</Text>
        </View>
      );
    }
  };

  const renderLineChart = () => {
    if (milkYieldData && milkYieldData.length > 0) {
      const lineChartData = {
        labels: milkYieldData.map((item) => item.date),
        datasets: [
          {
            data: milkYieldData.map((item) => item.totalYield),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          },
        ],
      };

      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Milk Yield</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 16}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Milk Yield</Text>
          <Text style={{ textAlign: "center" }}>No data available</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      {isSyncing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      </View>
      <View style={styles.logoutButton}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dairy Track</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditUserDetails}
        >
          <Feather name="edit" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
          Hi, {userRole}
        </Text>
        {!isConnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>
            No internet, still you can do milk entry!
          </Text>
        </View>
      )}
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <ScrollView>
            <View style={styles.buttonRow}>
              <Button
                onPress={() => setShowModal(true)}
                iconName="pluscircle"
                iconLib="AntDesign"
              >
                Add Group
              </Button>
              <Button
                onPress={() => setShowCattleOptions(true)}
                iconName="cow"
                iconLib="MaterialCommunityIcons"
              >
                Add Cattle
              </Button>
            </View>
            <View style={styles.buttonRow}>
              <Button
                onPress={() => navigation.navigate("ViewData")}
                iconName="list"
                iconLib="Feather"
              >
                View/Edit Cattle
              </Button>
              <Button
                onPress={() => navigation.navigate("MilkEntry")}
                iconName="water-check"
                iconLib="MaterialCommunityIcons"
              >
                Milk Entry
              </Button>
              {/* <Button
              onPress={() => navigation.navigate("Update")}
              iconName="update"
              iconLib="MaterialIcons"
            >
              Update
            </Button> */}
            </View>
            <View style={styles.buttonRow}>
              <Button
                onPress={() => navigation.navigate("MilkAlertsScreen")}
                iconName="alert"
                iconLib="Foundation"
              >
                Alerts
              </Button>
              <Button
                onPress={() => navigation.navigate("batchEntry")}
                iconName="pencil-square-o"
                iconLib="FontAwesome"
              >
                Batch Entry
              </Button>
            </View>
            {userRole === "Admin" || userRole === "Superuser" ? (
              <View style={styles.buttonRow}>
                <Button
                  onPress={() => navigation.navigate("user")}
                  iconName="users"
                  iconLib="Feather"
                >
                  Users
                </Button>
              </View>
            ) : null}

            <View>
              {/* <Text  style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 , textAlign:"center"}}>Dashboard</Text> */}
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  {renderLineChart()}
                  {renderPieChart()}
                </>
              )}
            </View>
          </ScrollView>

          <Modal
            visible={showEditModal}
            transparent={true}
            animationType="slide"
          >
            <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
              <View style={styles.modalEditContainer}>
                <KeyboardAvoidingView
                  behavior="padding"
                  style={styles.modalEditContent}
                >
                  <Text style={styles.modalEditText}>Change password</Text>
                  <TextInput
                    style={styles.inputEdit}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    style={styles.submitEditButton}
                    onPress={handleSaveUserDetails}
                  >
                    <Text style={styles.submitEditButtonText}>
                      Save Changes
                    </Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </KeyboardAvoidingView>

        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Create New Group</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Group Name"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddGroup}
                >
                  <AntDesign name="checkcircle" size={24} color="white" />
                  <Text style={styles.submitButtonText}>Create Group</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={showCattleOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCattleOptions(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Select Herd Lifecycle</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleAddHerdLifecycle("Calf")}
                  >
                    <MaterialCommunityIcons
                      name="cow"
                      size={30}
                      color="black"
                    />
                    <Text style={styles.modalButtonText}>Calf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleAddHerdLifecycle("Heifer")}
                  >
                    <MaterialCommunityIcons
                      name="cow"
                      size={30}
                      color="black"
                    />
                    <Text style={styles.modalButtonText}>Heifer</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleAddHerdLifecycle("Adult")}
                  >
                    <MaterialCommunityIcons
                      name="cow"
                      size={30}
                      color="black"
                    />
                    <Text style={styles.modalButtonText}>Adult</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => handleAddHerdLifecycle("Retired")}
                  >
                    <MaterialCommunityIcons
                      name="cow"
                      size={30}
                      color="black"
                    />
                    <Text style={styles.modalButtonText}>Retired</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;