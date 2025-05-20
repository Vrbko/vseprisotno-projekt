import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import axios from 'axios';
import {getBaseUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

interface Location {
  _id: string;
  latitude: number;
  longitude: number;
  description: string;
  category: string;
  datetime:string;
  user: string;
}

const MapScreen = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const baseUrl = await getBaseUrl();
        const res = await axios.get(`${baseUrl}/accidents/?token=${token}`);
        setLocations(res.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2c3e86" />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 46.558942,
            longitude: 15.638063,
            latitudeDelta: 0.042,
            longitudeDelta: 0.042,
          }}>
          {locations.map(loc => (
            <Marker
              key={loc._id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}>
              <Callout
                tooltip
                onPress={() =>
                  navigation.navigate('AccidentScreen', {
                    accident: {
                      _id: loc._id,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      category: loc.category,
                      description: loc.description,
                      datetime: loc.datetime,
                      image_base64: loc.image_base64,
                      user: loc.user
                    },
                  })
                }>
                <TouchableOpacity style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>Accident Location</Text>

                 
                  <Text>Category: {loc.category}</Text>
                  <Text>description: {loc.description}</Text>
                  <Text>Datetime: {loc.datetime}</Text>
                  <Text>Lat: {loc.latitude.toFixed(4)}</Text>
                  <Text>Lon: {loc.longitude.toFixed(4)}</Text>
                  <Text style={styles.moreInfo}>Click for more info</Text>
                </TouchableOpacity>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    minWidth: 160,
    elevation: 4,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e86',
  },
  moreInfo: {
    marginTop: 6,
    color: '#007BFF',
    fontWeight: '600',
  },
});

export default MapScreen;