import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom theme with black background
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000', // Black background
    card: '#121212', // Slightly lighter black for headers/cards
    text: '#FFFFFF', // White text
    border: '#333333', // Dark gray borders
  },
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              contentStyle: styles.screenContent,
              headerStyle: styles.headerStyle,
              headerTitleStyle: styles.headerTitleStyle,
              headerTintColor: '#FFFFFF', // White back button and header items
            }}
          >
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="FirstLogin" 
              component={FirstLoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Register' }} 
            />
            <Stack.Screen 
              name="HomeScreen" 
              component={HomeTabs} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#121212', // Dark tab bar
          borderTopColor: '#333333', // Dark border
          paddingBottom: 5,
        },
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerTintColor: '#FFFFFF',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Home' }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Map View' }} 
      />
      <Tab.Screen 
        name="MyAccidents" 
        component={MyAccidentsScreen} 
        options={{ title: 'Accidents' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#E5E4E2', // Black background for the entire app
  },
  screenContent: {
    backgroundColor: '#E5E4E2', // Black background for all screens
  },
  headerStyle: {
    backgroundColor: '#121212', // Dark header
  },
  headerTitleStyle: {
    color: '#FFFFFF', // White header title
  },
});

export default App;