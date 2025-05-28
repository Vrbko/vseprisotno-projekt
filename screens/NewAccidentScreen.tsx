import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getBaseUrl} from '../config';
import Geolocation from '@react-native-community/geolocation';
import {launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const NewAccidentScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState(new Date());
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    setDatetime(new Date());
    if (route.params?.analysisResult) {
      const {description, category, image_base64} = route.params.analysisResult;
      if (description) setDescription(description);
      if (category) setCategory(category);
      if (image_base64) setImageBase64(image_base64);
    }
  }, [route.params]);

  useEffect(() => {
    if (useCurrentLocation) {
      requestLocation();
    }
  }, [useCurrentLocation]);

  const requestLocation = async () => {
    try {
      const granted =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
          : 'granted';

      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        Geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude.toString());
            setLongitude(position.coords.longitude.toString());
          },
          error => {
            console.error('Geolocation error:', error);
            Alert.alert('Error', 'Failed to get current location.');
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        Alert.alert('Permission denied', 'Location permission not granted.');
      }
    } catch (err) {
      console.error('Location error:', err);
    }
  };

 
  const handlePost = async () => {
   const missingFields = [];

if (!category) missingFields.push('Category');
if (!description) missingFields.push('Description');
if (!latitude) missingFields.push('Latitude');
if (!longitude) missingFields.push('Longitude');

if (missingFields.length > 0) {
  Alert.alert('Validation', `Please fill in: ${missingFields.join(', ')}`);
  return;
}

    try {
      const token = await AsyncStorage.getItem('authToken');
      const baseUrl = await getBaseUrl();
      const storedUsername = await AsyncStorage.getItem('username');
      const payload = {
        _id: 'client-temp-id', // ⬅️ Dummy ID to satisfy backend Pydantic model
        category,
        description,
        datetime: datetime.toISOString(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        image_base64: imageBase64 || '',
        user: storedUsername,
      };

      const res = await axios.post(
        `${baseUrl}/accidents/?token=${token}`,
        payload,
      );

      if (res.status === 200) {
        Alert.alert('Success', 'Accident has been submitted.');
        await AsyncStorage.removeItem("cachedAccidents"); // or {} depending on your structure
        await AsyncStorage.removeItem("userAccidentsCache"); // or {} depending on your structure
        navigation.navigate("HomeScreen");
      }
    } catch (error: any) {
      console.error(
        'Error submitting accident:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Error',
        error.response?.data?.detail?.map?.((d: any) => d.msg).join('\n') ||
          error.response?.data?.message ||
          'Failed to submit accident.',
      );
    }
  };

  return (
    <View style={styles.container}>
     <View style={styles.navHeader}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
         <Icon name="arrow-back-outline" size={26} color="#2c3e86" />
       </TouchableOpacity>
       <Text style={styles.headerTitle}>New Accident</Text>
       <View style={{ width: 26 }} /> 
     </View>

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Use Current Location?</Text>
        <Switch
          value={useCurrentLocation}
          onValueChange={setUseCurrentLocation}
          thumbColor={useCurrentLocation ? '#fff' : '#ccc'}
          trackColor={{true: '#2c3e86', false: '#ccc'}}
        />
      </View>

      {!useCurrentLocation && (
        <>
          <TextInput
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      )}

      <View style={[styles.input, {justifyContent: 'center'}]}>
        <Text>Date/Time: {datetime.toLocaleString()}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('AnalysisScreen')}>
          <Text style={styles.scanText}>AI Scan</Text>
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
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  cameraButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  cameraText: {
    fontSize: 16,
    color: '#333',
  },
  preview: {
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scanButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
    navHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 30,
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2c3e86',
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
