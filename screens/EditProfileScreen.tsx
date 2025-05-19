import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';

const EditProfileScreen = ({navigation}: {navigation: any}) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const image = await AsyncStorage.getItem('profileImage');
      const dark = await AsyncStorage.getItem('darkMode');
      if (image) {
        setProfileImage(image);
      }
      if (dark) {
        setDarkModeEnabled(dark === 'true');
      }
    };
    loadSettings();
  }, []);

  const handlePickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    if (!result.didCancel && result.assets?.[0]?.base64) {
      const base64Img = result.assets[0].base64;
      await AsyncStorage.setItem('profileImage', base64Img);
      setProfileImage(base64Img);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkModeEnabled(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={{width: 24}} />
      </View>

      <TouchableOpacity onPress={handlePickPhoto}>
        <Text style={styles.linkText}>Select Photo</Text>
      </TouchableOpacity>

      {profileImage && (
        <Image
          source={{uri: `data:image/png;base64,${profileImage}`}}
          style={styles.avatar}
        />
      )}

      <View style={styles.switchRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
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
  headerText: {fontSize: 24, fontWeight: 'bold', color: '#2c3e86'},
  linkText: {
    fontSize: 18,
    color: '#0056b3',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 20},
  optionText: {fontSize: 18, color: '#222'},
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default EditProfileScreen;
