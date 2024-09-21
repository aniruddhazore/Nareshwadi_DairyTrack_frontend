import React, { useState } from "react";
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
} from "react-native";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons"; // Added FontAwesome for the Update Vaccination button
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import CattleVaccinations from './MonthlyVaccinations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 20, // Reduced marginTop for closer spacing
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
    </View>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <View style={styles.buttonRow}>
            <Button
              onPress={() => navigation.navigate("DewormingUpdate")}
              iconName="list"
              iconLib="Feather"
            >
              Deworming
            </Button>

            <Button
              onPress={() => navigation.navigate("VaccineUpdate")}
              iconName="pencil-square-o"
              iconLib="FontAwesome"
            >
              Update Vaccination
            </Button>
          </View>
          <View style={styles.buttonRow}>
            <Button
              onPress={() => navigation.navigate("reGroup")}
              iconName="pencil-square-o"
              iconLib="FontAwesome"
            >
              Re-Grouping
            </Button>
          </View>
          {/* <Button
            onPress={() => navigation.navigate("MonthlyVaccinations")}
            iconName="pencil-square-o"
            iconLib="FontAwesome"
          >
            View Vaccination
          </Button>
          <CattleVaccinations /> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;