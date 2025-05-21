import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBaseUrl} from '../config';

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState('');
  const [accidentCount, setAccidentCount] = useState(0);
  const [reports, setReportCount] = useState(0);
  const [upvotes, setUpvoteCount] = useState(0);
  const [downvotes, setDownvoteCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const storedUsername = await AsyncStorage.getItem('username');
      const image = await AsyncStorage.getItem('profileImage');
      const dark = await AsyncStorage.getItem('darkMode');

      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (image) {
        setProfileImage(image);
      }
      if (dark) {
        setDarkMode(dark === 'true');
      }

      try {
        const baseUrl = await getBaseUrl();
        const res = await fetch(`${baseUrl}/user/stats?token=${token}`);
        const data = await res.json();
        setAccidentCount(data.total_accidents || 0);
        setUpvoteCount(data.total_upvotes || 0);
        setDownvoteCount(data.total_downvotes || 0);
        setReportCount(data.total_reports || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, darkMode && {backgroundColor: '#111'}]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, darkMode && {color: '#fff'}]}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Icon
            name="settings-outline"
            size={24}
            color={darkMode ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri: profileImage
            ? `data:image/png;base64,${profileImage}`
            : 'https://i.pravatar.cc/150?img=12',
        }}
        style={styles.avatar}
      />
      <Text style={[styles.name, darkMode && {color: '#fff'}]}>
        {username || 'User'}
      </Text>
      <Text style={[styles.stat, darkMode && {color: '#ccc'}]}>
        My Reported Accidents: {accidentCount}
      </Text>
      <Text style={[styles.stat, darkMode && {color: '#ccc'}]}>
        My Reports: {reports}
      </Text>
      <Text style={[styles.stat, darkMode && {color: '#ccc'}]}>
        My Accident downvotes: {downvotes}
      </Text>
      <Text style={[styles.stat, darkMode && {color: '#ccc'}]}>
        My Accident upvotes: {upvotes}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: '#f9f9f9',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {fontSize: 24, fontWeight: 'bold', color: '#2d3e50'},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 40,
    marginBottom: 20,
  },
  name: {fontSize: 20, fontWeight: '600', color: '#2d3e50', marginBottom: 10},
  stat: {fontSize: 16, color: '#444'},
});

export default ProfileScreen;
