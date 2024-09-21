import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

const MilkAlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noAlertsMessage, setNoAlertsMessage] = useState('');

  useEffect(() => {
    fetchMilkAlerts();
  }, []);

  const fetchMilkAlerts = async () => {
    try {
      const response = await axios.get('http://nareshwadi-goshala.onrender.com/milk-alerts');
      console.log('Milk alerts response:', response.data); // Log the response data
      if (Array.isArray(response.data)) {
        setAlerts(response.data);
      } else {
        setNoAlertsMessage(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching milk alerts:', error);
      Alert.alert('Error', 'Failed to fetch milk alerts. Please try again later.');
      setLoading(false);
    }
  };

  const renderAlertItem = (item) => (
    <TableWrapper key={item.cattleName + item.date} style={styles.tableRow}>
      <Cell data={item.cattleName} textStyle={styles.tableText} style={styles.cellFlex2} />
      <Cell data={item.milkingCapacity} textStyle={styles.tableText} style={styles.cellFlex2} />
      <Cell data={item.session1} textStyle={styles.tableText} style={styles.cellFlex1} />
      <Cell data={item.session2} textStyle={styles.tableText} style={styles.cellFlex1} />
      <Cell data={new Date(item.date).toLocaleDateString()} textStyle={styles.tableText} style={styles.cellFlex2} />
    </TableWrapper>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cattle with yield less than threshold</Text>
      {alerts.length === 0 ? (
        <Text style={styles.noAlertsText}>{noAlertsMessage || 'No unusual behavior observed'}</Text>
      ) : (
        <View>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={['Cattle Name', 'Capacity/Session', 'S-1', 'S-2', 'Date']}
              style={styles.tableHeader}
              textStyle={styles.tableHeaderText}
              flexArr={[2, 2, 1, 1, 2]} // Adjust column widths if necessary
            />
            {alerts.map((item) => renderAlertItem(item))}
          </Table>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAlertsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#c8e1ff',
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  tableHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 40,
    alignItems: 'center',
  },
  tableText: {
    textAlign: 'center',
    padding: 10,
  },
  cellFlex1: {
    flex: 1,
  },
  cellFlex2: {
    flex: 2,
  },
});

export default MilkAlertsScreen;