import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Fontisto,
  MaterialIcons,
  Feather,
  EvilIcons,
  Entypo,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import axios from "axios";

const CustomPicker = ({ selectedValue, onValueChange, options }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.customPickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.customPickerText}>{selectedValue}</Text>
        <Entypo name="chevron-down" size={24} color="gray" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalOption}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("User");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/.test(password)) {
      Alert.alert("Invalid Password", "Password must be alphanumeric and at least 8 characters long.");
      return;
    }
  
    const user = {
      name,
      email,
      password,
      phone,
      userType,
      profileImage: image,
    };
  
    axios
      .post("https://nareshwadi-goshala.onrender.com/register", user)
      .then((response) => {
        console.log(response.data);
        Alert.alert(
          "User registered successfully",
          "You have been registered successfully."
        );
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setUserType("User");
        setImage("");
      })
      .catch((error) => {
        if (error.response) {
          console.log("Response data:", error.response.data);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        } else if (error.request) {
          console.log("Request data:", error.request);
        } else {
          console.log("Error message:", error.message);
        }
        console.log("Error config:", error.config);
        Alert.alert(
          "Registration failed",
          "An error occurred while registering user."
        );
      });
  };
  

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <Image
            source={require("../../assets/logo-new-dairy.png")}
            style={styles.logo}
          />
        </View>

        <KeyboardAvoidingView
          behavior="position"
          style={styles.keyboardAvoidingView}
        >
          <View>
            <Text style={styles.headerText}>Register new account</Text>
          </View>

          {/* NAME */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="drive-file-rename-outline"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your name"
              style={styles.input}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Fontisto name="email" size={24} color="gray" style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your Email-ID"
              style={styles.input}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={24} color="gray" style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="Enter your Password"
              style={styles.input}
            />
          </View>

          {/* PHONE */}
          <View style={styles.inputContainer}>
            <Feather
              name="phone-call"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              placeholder="Enter your Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          {/* USER TYPE */}
          <View style={styles.inputContainer}>
            <CustomPicker
              selectedValue={userType}
              onValueChange={(value) => setUserType(value)}
              options={[
                { label: "User", value: "User" },
                { label: "Admin", value: "Admin" },
                { label: "Superuser", value: "Superuser" },
              ]}
            />
          </View>

          {/* PROFILE IMAGE */}
          <View style={styles.inputContainer}>
            <EvilIcons
              name="image"
              size={24}
              color="gray"
              style={styles.icon}
            />
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              placeholder="Upload profile pic"
              style={styles.input}
            />
          </View>

          {/* <View style={styles.footerContainer}>
            <Text>Keep me logged in</Text>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
          </View> */}

          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 94,
    marginTop: 70,
    resizeMode: "contain",
  },
  keyboardAvoidingView: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    color: "#041E42",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
    paddingLeft: 8,
    width: 330,
    height: 50,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    color: "gray",
    width: 280,
    fontSize: 18,
  },
  customPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    paddingLeft: 8,
    width: 330,
    height: 50,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  customPickerText: {
    color: "gray",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalOptionText: {
    fontSize: 18,
    color: "gray",
  },
  footerContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  forgotPasswordText: {
    color: "#B592FF",
    fontWeight: "500",
  },
  registerButton: {
    width: 200,
    backgroundColor: "#B592FF",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 12,
    marginTop: 40,
  },
  registerButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 13,
  },
  loginLinkText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});