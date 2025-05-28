import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getBaseUrl} from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

const AnalysisScreen = ({navigation}: {navigation: any}) => {
  const [imageBase64, setImageBase64] = useState<string>('');

const handleImagePick = async () => {
  try {
    const granted =
      Platform.OS === 'android'
        ? await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs access to your camera to take a photo.',
              buttonPositive: 'OK',
            },
          )
        : 'granted';

    if (
      granted !== PermissionsAndroid.RESULTS.GRANTED &&
      Platform.OS === 'android'
    ) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 800,         // ✅ Resize for memory efficiency
      maxHeight: 800,
      quality: 0.7,          // ✅ Compress to reduce base64 size
      saveToPhotos: false,
    });

    if (result.didCancel) {
      console.log('User cancelled camera');
      return;
    }

    if (result.errorCode) {
      console.error('Camera error:', result.errorMessage);
      Alert.alert('Camera Error', result.errorMessage || 'Unknown error');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset || !asset.base64) {
      Alert.alert('Error', 'Failed to capture or process image.');
      return;
    }

    setImageBase64(asset.base64);
  } catch (error) {
    console.error('Unexpected camera error:', error);
    Alert.alert('Error', 'Something went wrong while using the camera.');
  }
};

  const handleAnalyze = async () => {
    if (!imageBase64) {
      Alert.alert('No Image', 'Please take a photo before analyzing.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const baseUrl = await getBaseUrl();

      const res = await axios.post(
        `${baseUrl}/clasify/?token=${token}`,
        { image_base64: imageBase64 },
        { headers: { 'Content-Type': 'application/json' } }
      );

     const label = res.data.predicted_label;
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
      
      const result =  {
        description: capitalizedLabel,
        category: capitalizedLabel,
        datetime: new Date().toISOString(),
        image_base64: imageBase64
      };

      Alert.alert('Analysis Complete', 'Details extracted from image.');
      navigation.navigate('NewAccidentScreen', { analysisResult: result,  });

    } catch (err) {
      console.error('Error analyzing image:', err);
      Alert.alert('Error', 'Could not analyze the image. Try again.');
    }
  };

  return (
    <View style={styles.container}>
         <View style={styles.navHeader}>
             <TouchableOpacity onPress={() => navigation.goBack()}>
               <Icon name="arrow-back-outline" size={26} color="#2c3e86" />
             </TouchableOpacity>
             <Text style={styles.headerTitle}>Accident Analysis</Text>
             <View style={{ width: 26 }} /> 
           </View>

      {imageBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
          style={styles.preview}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.preview, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
        <Text style={styles.cameraText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAnalyze}>
        <Text style={styles.buttonText}>Analyze</Text>
      </TouchableOpacity>
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
  preview: {
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
  },
  placeholder: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  button: {
    backgroundColor: '#2c3e86',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
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
    navHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 60,
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2c3e86',
},
});

export default AnalysisScreen;