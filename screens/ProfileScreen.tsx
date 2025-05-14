import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getBaseUrl} from '../config';

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const [userData, setUserData] = useState({
    username: '',
    score: 0,
    accident_count: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const baseUrl = await getBaseUrl();
        const res = await fetch(`${baseUrl}/user/stats?token=${token}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Avatar and Info */}
      <Image
        source={{uri: 'https://i.pravatar.cc/150?img=12'}}
        style={styles.avatar}
      />

      <Text style={styles.name}>{userData.username || 'User Name'}</Text>
      <Text style={styles.stat}>Score: {userData.score}</Text>
      <Text style={styles.stat}>My Accidents: {userData.accident_count}</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3e50',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 40,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3e50',
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
});

export default ProfileScreen;
