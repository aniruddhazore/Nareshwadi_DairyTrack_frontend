// Import necessary components and libraries
import React, { useState, useEffect } from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
} from "react-native";
import axios from "axios";
import moment from "moment";

// Define your component
const VaccineInfo = () => {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const response = await axios.get("https://nareshwadi-goshala.onrender.com/vaccinations");
      setVaccinations(response.data);
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Vaccination Information</Text>
      <View style={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell><Text style={styles.columnHeader}>Cattle Name</Text></TableCell>
              <TableCell><Text style={styles.columnHeader}>Vaccinations</Text></TableCell>
              <TableCell><Text style={styles.columnHeader}>Date Administered</Text></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinations.map((item) => (
              <TableRow key={item._id}>
                <TableCell><Text>{item.cattle.name}</Text></TableCell>
                <TableCell>
                  {item.vaccine.name} - {moment(item.dateAdministered).format("YYYY-MM-DD")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    </ScrollView>
  );
};

// Define your styles
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
  tableContainer: {
    marginTop: 20,
    width: "100%",
  },
  columnHeader: {
    fontWeight: "bold",
  },
});

export default VaccineInfo;
