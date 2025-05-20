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

type Accident = {
  _id: string;
  category: string;
  description: string;
  datetime: string;
  image_base64?: string;
  latitude: number;
  longitude: number;
  user: string;
};

type Filters = {
  distance: number;
  selectedCategories: string[];
  startDate: string | null;
  endDate: string | null;
};

const HomeScreen = ({navigation}: any) => {
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [allAccidents, setAllAccidents] = useState<Accident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters | null>(null);

  useEffect(() => {
    const loadAccidents = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const baseUrl = await getBaseUrl();
        const res = await axios.get(`${baseUrl}/accidents/?token=${token}`);
        const data: Accident[] = res.data;

        setAllAccidents(data);
        setAccidents(data);

        const strippedData = data.map(({image_base64: _img, ...rest}) => rest);
        await AsyncStorage.setItem(
          'cachedAccidents',
          JSON.stringify(strippedData),
        );
      } catch (err) {
        console.error('Error loading accidents:', err);
      }
    };

    const focusHandler = navigation.addListener('focus', () => {
      loadAccidents();
    });

    return focusHandler;
  }, [navigation]);

  useEffect(() => {
    const applyStoredFilters = async () => {
      const filtersRaw = await AsyncStorage.getItem('activeFilters');
      if (!filtersRaw) {
        setAccidents(allAccidents);
        setActiveFilters(null);
        return;
      }

      const filters: Filters = JSON.parse(filtersRaw);
      setActiveFilters(filters);

      const {selectedCategories, startDate, endDate} = filters;

      const filtered = allAccidents.filter(item => {
        if (
          selectedCategories?.length &&
          !selectedCategories.includes(item.category)
        )
          return false;

        if (startDate && new Date(item.datetime) < new Date(startDate))
          return false;

        if (endDate && new Date(item.datetime) > new Date(endDate))
          return false;

        return true;
      });

      setAccidents(filtered);
    };

    if (allAccidents.length > 0) {
      applyStoredFilters();
    }
  }, [allAccidents]);

  const searchedAccidents = accidents.filter(acc =>
    acc.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({item}: {item: Accident}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AccidentScreen', {accident: item})}>
      <View style={styles.card}>
        {item.image_base64 ? (
          <Image
            source={{uri: `data:image/jpeg;base64,${item.image_base64}`}}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>No image</Text>
          </View>
        )}
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FiltersScreen')}>
          <Icon name="menu-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      {activeFilters && (
        <View style={styles.activeFilters}>
          {activeFilters.selectedCategories?.map(cat => (
            <Text key={cat} style={styles.filterTag}>
              {cat}
            </Text>
          ))}
          {activeFilters.startDate && (
            <Text style={styles.filterTag}>
              From: {new Date(activeFilters.startDate).toLocaleDateString()}
            </Text>
          )}
          {activeFilters.endDate && (
            <Text style={styles.filterTag}>
              To: {new Date(activeFilters.endDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      )}

      <View style={styles.searchBar}>
        <Icon name="search-outline" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={searchedAccidents}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

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
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 6,
  },
  filterTag: {
    backgroundColor: '#2c3e86',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    marginRight: 6,
    marginBottom: 6,
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
  imagePlaceholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#555',
    fontSize: 14,
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
