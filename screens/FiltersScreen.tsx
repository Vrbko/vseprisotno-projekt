import React, {useState} from 'react';
import {View, Text, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';

const FiltersScreen = () => {
  const navigation = useNavigation();

  const [distance, setDistance] = useState(25);
  const [activeOnly, setActiveOnly] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filter</Text>
      </View>

      {/* Distance label */}
      <TouchableOpacity>
        <Text style={styles.link}>Distance</Text>
      </TouchableOpacity>

      {/* Distance Slider */}
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

      {/* Categories */}
      <TouchableOpacity>
        <Text style={styles.option}>Categories</Text>
      </TouchableOpacity>

      {/* Sort */}
      <TouchableOpacity>
        <Text style={styles.option}>Sort</Text>
      </TouchableOpacity>

      {/* Active Accidents Toggle */}
      <Text style={styles.option}>Active Accidents</Text>
      <Switch
        value={activeOnly}
        onValueChange={setActiveOnly}
        trackColor={{false: '#ccc', true: '#2c3e86'}}
        thumbColor={activeOnly ? '#fff' : '#ccc'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
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
  link: {
    fontSize: 18,
    color: '#2c3e86',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  valueText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    fontSize: 18,
    marginBottom: 24,
    color: '#111',
  },
});

export default FiltersScreen;
