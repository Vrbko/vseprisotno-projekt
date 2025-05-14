import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = ({navigation}: {navigation: any}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={{width: 24}} />
      </View>

      {/* Options */}
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('#'); // Replace with image picker logic
        }}>
        <Text style={styles.linkText}>Select Photo</Text>
      </TouchableOpacity>

      <Text style={styles.optionText}>Default filters</Text>

      <View style={styles.switchRow}>
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? '#fff' : '#ccc'}
          trackColor={{true: '#2c3e86', false: '#ccc'}}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
          thumbColor={darkModeEnabled ? '#fff' : '#ccc'}
          trackColor={{true: '#2c3e86', false: '#ccc'}}
        />
      </View>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  linkText: {
    fontSize: 18,
    color: '#0056b3',
    marginBottom: 24,
    textDecorationLine: 'underline',
  },
  optionText: {
    fontSize: 18,
    color: '#222',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default EditProfileScreen;
