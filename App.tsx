import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon component
import {View, StyleSheet} from 'react-native';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import MyAccidentsScreen from './screens/MyAccidentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import FirstLoginScreen from './screens/FirstLoginScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MapScreen from './screens/MapScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AccidentScreen from './screens/AccidentScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            {/* Your existing stack screens remain the same */}
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FirstLogin"
              component={FirstLoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{title: 'Register', headerShown: true}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen name="AccidentScreen" component={AccidentScreen} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{title: 'Edit Profile'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

// Updated HomeTabs with icons
const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'MyAccidents') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', // Color when tab is active
        tabBarInactiveTintColor: 'gray', // Color when tab is inactive
        tabBarStyle: {
          paddingBottom: 5, // Adjust padding if needed
        },
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{title: 'Map View'}}
      />
      <Tab.Screen
        name="MyAccidents"
        component={MyAccidentsScreen}
        options={{title: 'My Accidents'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#000000', // Set the background color for the entire app
  },
});

export default App;
