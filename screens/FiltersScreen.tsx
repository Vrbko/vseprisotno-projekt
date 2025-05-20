import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeScreen: undefined;
  FiltersScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'FiltersScreen'
>;

type Accident = {
  _id: string;
  category: string;
  description: string;
  datetime: string;
  latitude: number;
  longitude: number;
};

const FiltersScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [distance, setDistance] = useState(25);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cached = await AsyncStorage.getItem('cachedAccidents');
        if (cached) {
          const accidents: Accident[] = JSON.parse(cached);
          const unique = Array.from(new Set(accidents.map(a => a.category)));
          setAllCategories(unique);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  const applyFilters = async () => {
    const filters = {
      distance,
      selectedCategories,
      startDate,
      endDate,
    };

    await AsyncStorage.setItem('activeFilters', JSON.stringify(filters));
    navigation.goBack();
  };

  const clearFilters = async () => {
    await AsyncStorage.removeItem('activeFilters');
    Alert.alert('Filters Cleared');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
      </View>

      <Text style={styles.section}>Distance</Text>
      <Slider
        style={{width: '100%', height: 40}}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={distance}
        onValueChange={setDistance}
        minimumTrackTintColor="#2c3e86"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#2c3e86"
      />
      <Text style={styles.valueText}>{distance} km</Text>

      <Text style={styles.section}>Categories</Text>
      {allCategories.length === 0 ? (
        <Text style={{color: '#666'}}>No categories found.</Text>
      ) : (
        allCategories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => toggleCategory(cat)}
            style={styles.categoryItem}>
            <Text
              style={{
                color: selectedCategories.includes(cat) ? '#2c3e86' : '#000',
              }}>
              {selectedCategories.includes(cat) ? '✓ ' : ''}
              {cat}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <Text style={styles.section}>Date Range</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)}>
        <Text style={styles.datePicker}>
          Start Date: {startDate?.toDateString() || 'None'}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndPicker(true)}>
        <Text style={styles.datePicker}>
          End Date: {endDate?.toDateString() || 'None'}
        </Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <View style={{marginVertical: 10}}>
        <Button title="Apply Filters" onPress={applyFilters} />
      </View>

      <Button title="Clear Filters" color="#888" onPress={clearFilters} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryItem: {
    paddingVertical: 8,
  },
  datePicker: {
    fontSize: 16,
    color: '#2c3e86',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default FiltersScreen;
