import {PermissionsAndroid, Platform} from 'react-native';
import {useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import {getBaseUrl} from '../config';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => reject(error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

let lastNotifiedIds: string[] = [];

const checkForNearbyAccidents = async () => {
  console.log('📡 [Tracker] Running location check...');

  try {
    const token = await AsyncStorage.getItem('authToken');
    const baseUrl = await getBaseUrl();
    const location = await getCurrentLocation();

    console.log('📍 Current location:', location);

    const res = await fetch(`${baseUrl}/accidents/?token=${token}`);
    const accidents = await res.json();

    console.log(`📦 Fetched ${accidents.length} accident(s)`);

    const nearby = accidents.filter((accident: any) => {
      const dist = haversineDistance(
        location.latitude,
        location.longitude,
        accident.latitude,
        accident.longitude,
      );
      const isNew = !lastNotifiedIds.includes(accident._id);
      const isNearby = dist <= 10;
      console.log(
        `🧭 Accident ${accident._id} => ${dist.toFixed(2)} km away — ${
          isNearby && isNew ? '🚨 will notify' : '❌ skip'
        }`,
      );
      return isNearby && isNew;
    });

    if (nearby.length > 0) {
      await notifee.displayNotification({
        title: '🚨 Nearby Accident',
        body: `New accident within 10 km: ${nearby[0].category}`,
        android: {
          channelId: 'accidents',
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
        },
      });

      console.log(
        '🔔 Notified about accident(s):',
        nearby.map((a: any) => a._id),
      );
      lastNotifiedIds.push(...nearby.map((a: any) => a._id));
    } else {
      console.log('✅ No new nearby accidents found.');
    }
  } catch (err) {
    console.error('❌ Error checking for nearby accidents:', err);
  }
};

export default function useLocationTracker() {
  useEffect(() => {
    const init = async () => {
      console.log('🚀 Location tracker mounted. Starting interval...');
      const settings = await notifee.requestPermission();
      console.log(
        '🔐 Notification permission status:',
        settings.authorizationStatus,
      );
      if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
        console.warn('⚠️ Notifications not authorized. User must allow them.');
        return;
      }

      await notifee.createChannel({
        id: 'accidents',
        name: 'Nearby Accidents',
        importance: AndroidImportance.HIGH,
      });
    };

    init();

    const poll = setInterval(() => {
      checkForNearbyAccidents();
    }, 15000);

    return () => {
      clearInterval(poll);
      console.log('🛑 Location tracker unmounted. Interval cleared.');
    };
  }, []);
}
