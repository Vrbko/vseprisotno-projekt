import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBaseUrl} from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const ACCIDENTS_STORAGE_KEY = 'cachedAccidents';

type Accident = {
  _id: string;
  category: string;
  description: string;
  datetime: string;
  image_base64: string;
  latitude: number;
  longitude: number;
};

const HomeScreen = ({navigation}: {navigation: any}) => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadAccidents = async () => {
      try {
        // Check if data already exists in AsyncStorage
        const cached = await AsyncStorage.getItem(ACCIDENTS_STORAGE_KEY);

        if (cached) {
          // Load from cache
          setAccidents(JSON.parse(cached));
        } else {
          // Fetch from API
          const token = await AsyncStorage.getItem('authToken');
          const baseUrl = await getBaseUrl();
          const res = await axios.get(`${baseUrl}/accidents/?token=${token}`);
          const data = res.data;

          // Save to state and cache
          setAccidents(data);
          await AsyncStorage.setItem(
            ACCIDENTS_STORAGE_KEY,
            JSON.stringify(data),
          );
        }
      } catch (err) {
        console.error('Error loading accidents:', err);
      }
    };

    loadAccidents();
  }, []);

  const filteredAccidents = accidents.filter(acc =>
    acc.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}: {item: Accident}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AccidentScreen', {accident: item})}>
      <View style={styles.card}>
        <Image
          source={{uri: `data:image/jpeg;base64,${item.image_base64}`}}
          style={styles.image}
        />
        <Text style={styles.date}>
          {format(new Date(item.datetime), 'PPpp')}
        </Text>
        <Text style={styles.category}>Accident: {item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.location}>
          Lat: {item.latitude}, Lon: {item.longitude}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FiltersScreen')}>
          <Icon name="menu-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredAccidents}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewAccidentScreen')}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2c3e86',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomeScreen;
