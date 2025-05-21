This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Figma Links

[Design system - wireframe](https://www.figma.com/design/EQdOQNJO8Rux4EDKG7PnwK/Design-System?node-id=46-4&p=f&t=jX411xveqEsODApQ-0)

[User Paths](https://www.figma.com/board/wD20vh5swIJy49FuCIc0r8/UserPaths?node-id=0-1&p=f&t=j5cmhzRxaRK5boT4-0)

[Wireframe](https://www.figma.com/board/3pQpSxsKGlHkchWTyvFPKg/Wireframe?t=ZYRmYgJYtoxhqbdM-0)


## TODO
Vizualno
```
Kartice - Večji Front🚫
Slika & Maps v sliderju ( v details ) če obstaja slika🚫
Label za input fielde🚫
Map pins (size, barva, images? - logos)🚫
Map kartice - mogoče🚫
Iskanje po mapi ? 🚫
Onlick odpre detajle ✅

Implementacija Screeni
    Splash ✅
    First Start ✅
    Login ✅
    Register ✅

    Maps✅
    Home/Accidents✅
    Accident Details✅
    Report ✅ / še api ✅
    Search✅
    Filter✅
    Points sistem 🚫

    My Accidents✅
    My Accident details✅
    Edit my Accidents🚫

    New Accident✅
    Analyze Accident (autocomplete z ml api)✅

    User ✅
    User Settings✅
    User slika✅

Design 🚫
Dark mode 🚫
```
 
API  - (python + mongo najboljse?) - publish na render? 🚫 lokalno - prevlki file, mogoče na koncu, 10.0.2.2 za predstavitev
```
Register ✅
Login ✅
User settings? Slika npr, al bo to lokalno✅

Accidents CRUD ✅
Points System

Accident Classificatoin API✅
```

Machine Learning✅
```
Iskanje(razvijanje?) modelov✅
Implementacija (python)✅
Testiranje✅
```


# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.
## Versions
```
ios: 18.4 (simulator)
react-native --version: 18.0.0
react-native-cli: 2.0.1
react-native: 0.79.1

Important:
    react-native-maps: ^1.20.1
    react-native-vector-icons: ^9.2.0
```
## Step 1: NPM/YARN

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm install
npm start

# OR using Yarn
yarn install
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:


### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:
```sh
cd ios
pod install 
cd ..
```


For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).



Running
```sh
# using npx
npx react-native run-ios

# OR using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.



