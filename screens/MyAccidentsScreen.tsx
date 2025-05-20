import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBaseUrl} from '../config';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

interface Accident {
  _id?: string;
  category: string;
  description: string;
  datetime: string;
  image_base64: string;
  latitude: number;
  longitude: number;
  user: string;
}

const USER_ACCIDENTS_KEY = 'userAccidentsCache';

const MyAccidentsScreen = ({navigation}: {navigation: any}) => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    const loadUserAccidents = async () => {
      try {
        // Try loading cached data first
        const cached = await AsyncStorage.getItem(USER_ACCIDENTS_KEY);
        if (cached) {
          setAccidents(JSON.parse(cached));
          return;
        }

        // If no cache, fetch from API
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.warn('Missing token');
          return;
        }

        const baseUrl = await getBaseUrl();
        const res = await axios.get(`${baseUrl}/accidents/user`, {
          params: {token},
        });

        const data = res.data;
        setAccidents(data);
        await AsyncStorage.setItem(USER_ACCIDENTS_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Error fetching user accidents:', err);
      }
    };

    loadUserAccidents();
  }, []);

  const filteredAccidents = accidents.filter(acc =>
    acc.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}: {item: Accident}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AccidentScreen', {accident: item})}
      style={styles.card}>
      <Image
        source={{uri: `data:image/jpeg;base64,${item.image_base64}`}}
        style={styles.image}
      />
      <Text style={styles.date}>{format(new Date(item.datetime), 'PPpp')}</Text>
      <Text style={styles.category}>Accident: {item.category}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.location}>
        Lat: {item.latitude}, Lon: {item.longitude}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Accidents</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by category"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredAccidents.length === 0 ? (
        <Text style={styles.emptyText}>No accidents submitted by you.</Text>
      ) : (
        <FlatList
          data={filteredAccidents}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
    height: 44,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e86',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default MyAccidentsScreen;