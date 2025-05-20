import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

      <View style={styles.dateButtonsContainer}>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            Start: {startDate?.toDateString() || 'None'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            End: {endDate?.toDateString() || 'None'}
          </Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      </View>
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
  dateButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#e1eaff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#2c3e86',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#2c3e86',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FiltersScreen;
