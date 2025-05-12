// NotificationsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { format } from 'date-fns';

const MyAccidentsScreen = () => {
  const [accidents, setAccidents] = useState([]);

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const res = await axios.get('http://192.168.1.80:8080/accidents/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5fZG9lMSJ9.3nxeVypiprnEuz4x6IhTHcRIZjBfBni84I3rawNj75Y');
        setAccidents(res.data);
      } catch (err) {
        console.error('Error fetching accidents:', err);
      }
    };

    fetchAccidents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
        style={styles.image}
      />
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.datetime}>
        {format(new Date(item.datetime), 'PPpp')}
      </Text>
      <Text style={styles.location}>
        Lat: {item.latitude}, Lon: {item.longitude}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={accidents}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cc0000',
  },
  description: {
    fontSize: 14,
    marginVertical: 4,
  },
  datetime: {
    fontSize: 12,
    color: '#555',
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default MyAccidentsScreen;