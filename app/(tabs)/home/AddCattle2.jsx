import React, { useState } from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddCattle2 = () => {
  const route = useRoute();
  const {
    name,
    cattleid,
    type,
    herd_lifecycle,
    breed,
    dob,
    healthStatus,
    housingType,
    milkingCapacity,
  } = route.params;

  const [weight, setWeight] = useState("");
  const [identificationMark, setIdentificationMark] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");

  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate("AddCattle3", {
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
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Identification Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Weight (in kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Identification Mark (default: null)"
        value={identificationMark}
        onChangeText={setIdentificationMark}
      />

      <TextInput
        style={styles.input}
        placeholder="Mother Name (Dame)"
        value={motherName}
        onChangeText={setMotherName}
      />
      <TextInput
        style={styles.input}
        placeholder="Father Name (Sire)"
        value={fatherName}
        onChangeText={setFatherName}
      />

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
});

export default AddCattle2;