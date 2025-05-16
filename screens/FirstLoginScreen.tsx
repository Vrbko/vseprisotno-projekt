import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FirstLoginScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      {/* Header with arrow icon */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="arrow-forward" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome</Text>

      {/* Center Image */}
      <Image
        source={require('../assets/logo.png')}  // Update this path to your image file
        style={styles.image}
        resizeMode="cover"
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
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
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#2563EB',
  },
});

export default FirstLoginScreen;
