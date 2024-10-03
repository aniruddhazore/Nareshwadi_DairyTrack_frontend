import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import React, { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import moment from "moment";

const login = () => {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [data, setData] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(null);

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
    } else {
      await loadLocalCattleData();
      await loadLocalUsers();
      await loadLocalMilkData();
    }
    setLoading(false);
  };

  const fetchCattleData = async () => {
    try {
      console.log("Fetching Cattle data");
      const response = await axios.get('https://nareshwadi-goshala.onrender.com/getCattle');
      console.log("Fetched cattle data ")
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
      console.log("Fetching users data");
      const response = await axios.get('https://nareshwadi-goshala.onrender.com/users');
      setUsers(response.data);
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
      console.log("Fetching Existing Milk data");
      const response = await axios.get("https://nareshwadi-goshala.onrender.com/milk/${date}");
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

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("Fetching token in login.jsx");
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Retrieved token", token);
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log("Error getting auth token", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post("http://nareshwadi-goshala.onrender.com/login", user);
      console.log(response.data); // Log the entire response

      const { token, verified } = response.data;

      if (verified == "false") {
        Alert.alert("Login Failed", "Your account is not verified. Please verify your account to log in.");
        return;
      }

      await AsyncStorage.setItem("authToken", token);
      console.log("Stored token in AsyncStorage:", token);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Login error", error);
      Alert.alert("Login Failed", "Wrong username or password / Account not verified");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          source={require("../../assets/logo-new-dairy.png")}
          style={{
            width: 300,
            height: 94,
            marginTop: 70,
            resizeMode: "contain",
          }}
        />
      </View>

      <KeyboardAvoidingView style={{ alignItems: "center" }}>
        <View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Login to your Account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Fontisto
              name="email"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your Email-ID"
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 18 : 18,
              }}
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Feather
              name="lock"
              size={24}
              color="gray"
              style={{ marginLeft: 8 }}
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!passwordVisible}
              placeholder="Enter your Password"
              style={{
                color: "gray",
                marginVertical: 10,
                width: 250,
                fontSize: password ? 18 : 18,
              }}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Feather
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#B592FF",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 12,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});