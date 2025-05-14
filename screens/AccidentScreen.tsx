import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const AccidentScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const {accident} = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportScreen')}>
          <Icon name="alert-circle-outline" size={28} color="#2c3e86" />
        </TouchableOpacity>
      </View>

      {/* Map */}
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

      {/* Category + Image */}
      <View style={styles.row}>
        <Text style={styles.title}>{accident.category}</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`data:image/jpeg;base64,${accident.image_base64}`)
          }>
          <Text style={styles.link}>View Image</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.sectionHeader}>Details</Text>
      <Text style={styles.description}>{accident.description}</Text>

      {/* Reaction Buttons */}
      <View style={styles.reactions}>
        <TouchableOpacity>
          <Icon name="thumbs-up" size={36} color="#2c3e86" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="thumbs-down" size={36} color="#444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#eaeaea'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#2c3e86',
    fontWeight: 'bold',
  },
  link: {
    color: '#003399',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
});

export default AccidentScreen;
