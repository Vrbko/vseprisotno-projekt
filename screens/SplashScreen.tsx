// SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // Navigate to the First Login Screen after 3 seconds
    setTimeout(() => {
      navigation.replace('FirstLogin');
    }, 3000); // 3 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;