import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const VaccineDewormingTable = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [dewormings, setDewormings] = useState([]);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vaccinations');
        setVaccinations(response.data);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      }
    };

    const fetchDewormings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dewormings');
        setDewormings(response.data);
      } catch (error) {
        console.error('Error fetching dewormings:', error);
      }
    };

    fetchVaccinations();
    fetchDewormings();
  }, []);

  const renderTable = (data, type) => (
    <View style={styles.tableContainer}>
      <Text style={styles.header}>{type}</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Vaccine/Dewormer</Text>
        <Text style={styles.tableHeaderText}>Cattle</Text>
        <Text style={styles.tableHeaderText}>Date</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>
              {item.vaccine?.name || item.dewormer?.name || 'N/A'}
            </Text>
            <Text style={styles.tableText}>
              {item.cattle && Array.isArray(item.cattle)
                ? item.cattle.map((cattle) => cattle.name).join(', ')
                : 'N/A'}
            </Text>
            <Text style={styles.tableText}>
              {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderTable(vaccinations, 'Vaccinations')}
      {renderTable(dewormings, 'Dewormings')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  tableContainer: {
    marginBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableText: {
    flex: 1,
  },
});

export default VaccineDewormingTable;
