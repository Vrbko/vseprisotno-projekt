/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';

async function setupNotifications() {
  await notifee.createChannel({
    id: 'accidents',
    name: 'Nearby Accidents',
    importance: notifee.AndroidImportance.HIGH,
  });
}

setupNotifications(); // Create channel on startup

AppRegistry.registerComponent(appName, () => App);
