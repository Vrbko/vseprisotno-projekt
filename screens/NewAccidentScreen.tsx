import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const NewAccidentScreen = ({navigation}: {navigation: any}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [datetime, setDatetime] = useState('');

  const handlePost = () => {
    if (!description || !category || !datetime) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }

    // Logic to send data to API goes here
    Alert.alert('Posted', 'Accident has been submitted.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Accident</Text>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Datetime"
        value={datetime}
        onChangeText={setDatetime}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0', padding: 24},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  scanText: {
    fontSize: 16,
    color: '#333',
  },
  postButton: {
    flex: 1,
    backgroundColor: '#2c3e86',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default NewAccidentScreen;
