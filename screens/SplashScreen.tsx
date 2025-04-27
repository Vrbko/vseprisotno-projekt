import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // Navigate to the next screen after 2 seconds
    setTimeout(() => {
      navigation.replace('FirstLogin'); // Navigate to the FirstLogin screen (or another screen)
    }, 3000); // 2-second delay
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Display the logo image */}
      <Image 
        source={require('../assets/logo.png')} // Path to your logo image (adjust the path)
        style={styles.logo} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for splash screen
  },
  logo: {
    width: 300,  // Adjust width based on your logo size
    height: 300, // Adjust height based on your logo size
    resizeMode: 'contain', // Ensures the logo is scaled properly
    marginBottom: 20,  // Adds space below the logo
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Text color
  },
});

export default SplashScreen;