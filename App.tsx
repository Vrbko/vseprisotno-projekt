import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from 'react-native-vector-icons'; // Import icons

// Import Screens
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationsScreen from './screens/MyAccidentsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen'; // Splash screen
import FirstLoginScreen from './screens/FirstLoginScreen'; // First login screen
import LoginScreen from './screens/LoginScreen'; // Login screen
import RegisterScreen from './screens/RegisterScreen'; // Register screen

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true); // You can replace this with actual first-time logic

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          {/* Splash Screen */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          
          {/* First Login Screen */}
          <Stack.Screen
            name="FirstLogin"
            component={FirstLoginScreen}
            options={{ title: 'First Login', headerShown: false }} // Ensuring header is shown
          />
          
          {/* Login Screen */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login', headerShown: false }} // Custom title and back arrow
          />
          
          {/* Register Screen with Back Arrow */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Register', // Custom title for Register screen
              headerShown: true, // Ensures the header is shown
            }}
          />

          {/* Main Stack Navigator */}
          <Stack.Screen
            name="HomeScreen"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// Home Tabs with Bottom Navigation
const HomeTabs = () => {
  return (
    <Tab.Navigator initialRouteName="HomeTab">
      {/* Home tab now has a unique name */}
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default App;