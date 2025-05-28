import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {getBaseUrl} from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const ReportScreen = ({ navigation, route }: any) => {

  const [cause, setCause] = useState('');
  const [details, setDetails] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleReport = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const baseUrl = await getBaseUrl();
      const accident_id = route.params?.accident_id;

      if (!accident_id ) {
        Alert.alert('Error', 'Accident ID  required.' + accident_id);
        return;
      }
        if ( !cause) {
        Alert.alert('Error', 'Cause are required.');
        return;
      }

      const reportPayload = {
        accident_id,
        report_cause: cause,
        extra_details: details,
        active: isActive,
      };

      await axios.post(`${baseUrl}/report/?token=${token}`, reportPayload);

      Alert.alert('Report Sent', 'Your report has been submitted.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit the report.');
    }
  };

  return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Report</Text>
            <View style={{width: 24}} />
          </View>

      <TextInput
        placeholder="Report Cause"
        value={cause}
        onChangeText={setCause}
        style={styles.input}
      />
      <TextInput
        placeholder="Extra Details"
        value={details}
        onChangeText={setDetails}
        style={styles.input}
      />

      <Text style={styles.label}>Active Accident?</Text>
      <Switch
        value={isActive}
        onValueChange={setIsActive}
        thumbColor={isActive ? '#fff' : '#ccc'}
        trackColor={{ true: '#2c3e86', false: '#ccc' }}
      />

      <TouchableOpacity style={styles.button} onPress={handleReport}>
        <Text style={styles.buttonText}>Report</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2c3e86',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
});

export default ReportScreen;