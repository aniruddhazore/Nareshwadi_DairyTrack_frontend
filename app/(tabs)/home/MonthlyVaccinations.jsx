import React, { useEffect, useState } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { View, Text, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const MonthlyVaccinations = () => {
  const [cattleVaccinations, setCattleVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCattleVaccinations = async () => {
      try {
        const response = await axios.get('${apiUrl}/cattle-vaccinations/current-month');
        const formattedData = response.data.map(cattle => ({
          title: cattle.name,
          data: cattle.vaccinations.length > 0 ? cattle.vaccinations : [{ _id: 'no-vaccinations', vaccine: { name: 'No vaccinations this month' }, date: null }],
        }));
        setCattleVaccinations(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cattle vaccinations:", error);
        setLoading(false);
      }
    };

    fetchCattleVaccinations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cattle Vaccinations for the Current Month</Text>
      <SectionList
        sections={cattleVaccinations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          item._id === 'no-vaccinations' ? (
            <Text style={styles.noVaccinationsText}>{item.vaccine.name}</Text>
          ) : (
            <View style={styles.vaccinationItem}>
              <Text style={styles.vaccinationText}>Vaccine: {item.vaccine.name}</Text>
              <Text style={styles.vaccinationText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.cattleName}>{title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cattleName: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    padding: 8,
  },
  vaccinationItem: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  vaccinationText: {
    fontSize: 16,
  },
  noVaccinationsText: {
    fontSize: 16,
    fontStyle: 'italic',
    paddingLeft: 16,
    paddingVertical: 8,
  },
});

export default MonthlyVaccinations;
