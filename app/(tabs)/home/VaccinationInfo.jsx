import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "axios";

const VaccinationInfo = () => {
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vaccines");
      setVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const renderVaccineInfo = ({ item }) => (
    <View style={styles.vaccineItem}>
      <Text style={styles.vaccineName}>{item.name}</Text>
      {item.cattle ? (
        <Text>Cattle: {item.cattle.join(", ")}</Text>
      ) : (
        <Text>No cattle found for this vaccine</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Vaccination Information</Text>
      <FlatList
        data={vaccines}
        renderItem={renderVaccineInfo}
        keyExtractor={(item) => item._id}
      />
    </ScrollView>
  );
};

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
  vaccineItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  vaccineName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default VaccinationInfo;
