import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import FirstLoginScreen from './screens/FirstLoginScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const App = () => {
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
            options={{ headerShown: false }}
          />
          {/* Login Screen */}
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* Register Screen */}
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;