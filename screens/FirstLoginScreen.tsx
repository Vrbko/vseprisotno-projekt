import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', image: require('../assets/1.png'), text: 'Take Images' },
  { id: '2', image: require('../assets/2.png'), text: 'Share' },
  { id: '3', image: require('../assets/3.png'), text: 'Be Safe' },
];
const FirstLoginScreen = ({ navigation }: { navigation: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
 
      navigation.navigate('Login');
    
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
 
<View style={styles.header}>
  {/* Placeholder for left space */}
  <View style={{ width: 28 }} />

  {/* Centered Title */}
  <Text style={styles.title}>Welcome</Text>

  {/* Icon aligned right */}
  <TouchableOpacity onPress={handleNext}>
    <Icon name="arrow-forward" size={28} color="black" />
  </TouchableOpacity>
</View>
      {/* Swipable Image */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
renderItem={({ item }) => (
  <View style={styles.imageContainer}>
    <Image source={item.image} style={styles.image} resizeMode="cover" />
    <Text style={styles.caption}>{item.text}</Text>
  </View>
)}
      />

      {/* Pagination Dots (moved close to image) */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
  },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingTop: 80,
},
title: {
  flex: 1,
  textAlign: 'center',
  fontSize: 30,
  fontWeight: 'bold',
},
  imageContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,  // 🔹 Push image down for better vertical centering
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 25,  // 🔹 More gap between image & dots
    marginBottom: 280,  // 🔹 Less extreme bottom space (was 400)
  },
  caption: {
  marginTop: 20,
  fontSize: 22,
  fontWeight: '600',
  color: '#333',
  textAlign: 'center',
},
  dot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#C4C4C4',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#2563EB',
  },
});


export default FirstLoginScreen;