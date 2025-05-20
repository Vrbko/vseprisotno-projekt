import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../config';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const handleLogin = async () => {
    try {
      const baseUrl = await getBaseUrl();
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        //Alert.alert('Success', 'Logged in successfully');
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.removeItem("cachedAccidents"); // or {} depending on your structure
        await AsyncStorage.removeItem("userAccidentsCache"); // or {} depending on your structure
        navigation.replace('HomeScreen');
      } else {
        const errorData = await response.json();
        Alert.alert('Login Failed', errorData.message || 'Unknown error');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[
          styles.input,
          focusedInput === 'username' && styles.inputFocused,
        ]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocusedInput('username')}
        onBlur={() => setFocusedInput('')}
      />
      <TextInput
        style={[
          styles.input,
          focusedInput === 'password' && styles.inputFocused,
        ]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => setFocusedInput('password')}
        onBlur={() => setFocusedInput('')}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Register')}>
        <Text style={styles.registerLink}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderColor: '#DADADA',
    borderWidth: 1,
  },
  inputFocused: {
    borderColor: '#8A2BE2', // Purple border on focus
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#000000',
  },
});

export default LoginScreen;
