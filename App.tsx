import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
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
import FiltersScreen from './screens/FiltersScreen';
import ReportScreen from './screens/ReportScreen';
import NewAccidentScreen from './screens/NewAccidentScreen';
import EditAccidentScreen from './screens/EditAccidentScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import FullImageScreen from './screens/FullImageScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{headerShown: false}} // ✅ Hides all headers globally
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="HomeScreen" component={HomeTabs} />
            <Stack.Screen name="AccidentScreen" component={AccidentScreen} />
            <Stack.Screen name="NewAccidentScreen" component={NewAccidentScreen} />
            <Stack.Screen name="EditAccidentScreen" component={EditAccidentScreen} />
            <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="FiltersScreen" component={FiltersScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="FullImageScreen" component={FullImageScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
};

// Helper function for tab bar icons
const getTabBarIcon = (
  route: string,
  focused: boolean,
  color: string,
  size: number,
) => {
  let iconName;

  if (route === 'HomeTab') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route === 'Map') {
    iconName = focused ? 'globe' : 'globe-outline';
  } else if (route === 'MyAccidents') {
    iconName = focused ? 'list' : 'list-outline';
  } else if (route === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Icon name={iconName as string} size={size} color={color} />;
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({route}) => ({
        headerShown: false, // ✅ Hides tab screen headers
        tabBarIcon: ({focused, color, size}) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
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
    backgroundColor: '#000000',
  },
});

export default App;
