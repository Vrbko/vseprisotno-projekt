import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get('window').height;

const AccidentScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const {accident} = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportScreen')}>
          <Icon name="alert-circle-outline" size={26} color="#2c3e86" />
        </TouchableOpacity>
      </View>

      {/* Edge-to-edge Map */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: accident.latitude,
            longitude: accident.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: accident.latitude,
              longitude: accident.longitude,
            }}
            title={accident.category}
          />
        </MapView>
      </View>

      {/* Category and View Image */}
      <View style={styles.row}>
        <Text style={styles.title}>{accident.category}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FullImageScreen', {
              imageUri: `data:image/jpeg;base64,${accident.image_base64}`,
            })
          }>
          <Text style={styles.link}>View Image</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.sectionHeader}>Details</Text>
      <Text style={styles.description}>{accident.description}</Text>

      {/* Reactions */}
      <View style={styles.reactions}>
        <TouchableOpacity style={styles.reactionButton}>
          <Icon name="thumbs-up" size={32} color="#2c3e86" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Icon name="thumbs-down" size={32} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  mapWrapper: {
    marginHorizontal: -16, // Cancel out container padding for edge-to-edge
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: screenHeight * 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  link: {
    fontSize: 14,
    color: '#003399',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  },
  reactionButton: {
    padding: 8,
  },
});

export default AccidentScreen;
