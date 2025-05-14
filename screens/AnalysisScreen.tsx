import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const AnalysisScreen = ({navigation}: {navigation: any}) => {
  const handleAnalyze = () => {
    // Simulate AI output
    const result = {
      description: 'Rear-end collision at red light',
      category: 'Rear-end',
      datetime: new Date().toISOString(),
    };

    Alert.alert('Analysis Complete', 'Details extracted from image.');
    navigation.navigate('NewAccidentScreen', {analysisResult: result});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Analysis</Text>

      {/* Replace this with camera view if needed */}
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Traffic_accident_example.jpg',
        }}
        style={styles.image}
      />

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
  image: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    marginBottom: 30,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#2c3e86',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
});

export default AnalysisScreen;
