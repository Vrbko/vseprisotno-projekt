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
  { id: '1', image: require('../assets/1.png') },
  { id: '2', image: require('../assets/2.png') },
  { id: '3', image: require('../assets/3.png') },
];
const FirstLoginScreen = ({ navigation }: { navigation: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      {/* Header Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNext}>
          <Icon name="arrow-forward" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome</Text>

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
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 20,
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
    marginBottom: 300,  // 🔹 Less extreme bottom space (was 400)
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