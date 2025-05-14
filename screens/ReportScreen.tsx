import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const ReportScreen = () => {
  const [cause, setCause] = useState('');
  const [details, setDetails] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleReport = () => {
    Alert.alert('Report Sent', 'Your report has been submitted.');
    // You can implement the actual submission logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report</Text>

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
        trackColor={{true: '#2c3e86', false: '#ccc'}}
      />

      <TouchableOpacity style={styles.button} onPress={handleReport}>
        <Text style={styles.buttonText}>Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24, backgroundColor: '#f0f0f0'},
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e86',
    textAlign: 'center',
    marginBottom: 30,
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
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default ReportScreen;
