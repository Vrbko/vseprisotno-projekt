// FirstLoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FirstLoginScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      {/* Header with arrow icon */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.arrowContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Icon
            name="arrow-forward"
            size={48}
            color="black"
          />
        </TouchableOpacity>
      </View>
      
      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the App!</Text>
        <Text style={styles.subtitle}>This is your first time logging in.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    padding: 15,
  },
  arrowContainer: {
    paddingTop: 100, // Makes it easier to tap
    paddingRight: 40, // Makes it easier to tap
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default FirstLoginScreen;