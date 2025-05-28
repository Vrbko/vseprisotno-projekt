import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getBaseUrl} from '../config'; // assuming this exists
import {useEffect, useState} from 'react';
import { Region } from 'react-native-maps';


const screenHeight = Dimensions.get('window').height;

const AccidentScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const {accident} = route.params;
  const [username, setUsername] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);


  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
    };

    fetchUsername();
  }, []);
      useEffect(() => {
      if (accident?.latitude && accident?.longitude) {
        setRegion({
          latitude: accident.latitude,
          longitude: accident.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }, [accident]);
  const handleVote = async (type: 'upvote' | 'downvote') => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const baseUrl = await getBaseUrl();
      const url = `${baseUrl}/score/${accident._id}/${type}/?token=${token}`;

      await axios.post(url);
      Alert.alert('Success', `You have ${type}d this accident.`);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.response?.data?.detail || 'Failed to submit vote.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const baseUrl = await getBaseUrl();

      await axios.delete(`${baseUrl}/accidents/${accident._id}/?token=${token}`);
 
      Alert.alert('Deleted', 'Accident deleted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert('Error', 'Failed to delete the accident.');
    }
  };

  const confirmDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this accident?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: handleDelete},
    ]);
  };
    const editAccident = () => {
    navigation.navigate("EditAccidentScreen", {accident:accident})
  };


return (
  <View style={styles.container}>
    {/* Header */}
  <View style={styles.navHeader}>
  <TouchableOpacity style={styles.sideIcon} onPress={() => navigation.goBack()}>
    <Icon name="arrow-back-outline" size={26} color="#2c3e86" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Accident</Text>

  <TouchableOpacity style={styles.sideIcon} onPress={() => navigation.navigate('ReportScreen', { accident_id: accident._id })}>
    <Icon name="alert-circle-outline" size={26} color="#2c3e86" />
  </TouchableOpacity>
</View>

 <View style={styles.mapWrapper}>
  {region && (
    <MapView
      style={styles.map}
      region={region}
      onRegionChangeComplete={setRegion} // Optional: lets user pan/zoom
    >
      <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        title={accident.category}
      />
    </MapView>
  )}
</View>

    {/* Title & Link */}
    <View style={styles.row}>
      <Text style={styles.accidentTitle}>Accident 1</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('FullImageScreen', {
            imageUri: `data:image/jpeg;base64,${accident.image_base64}`,
          })
        }>
        <Text style={styles.link}>View Image</Text>
      </TouchableOpacity>
    </View>

    {/* Description */}
    <Text style={styles.sectionHeader}>Details</Text>
    <Text style={styles.description}>
      {accident.description || 'No details provided.'}
    </Text>



   {/* Reactions */}
<View style={styles.reactions}>
  <TouchableOpacity style={styles.reactionButton} onPress={() => handleVote('upvote')}>
    <Icon name="thumbs-up" size={28} color="#2c3e86" />
    <Text style={styles.reactionCount}>{accident.upvotes}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.reactionButton} onPress={() => handleVote('downvote')}>
    <Icon name="thumbs-down" size={28} color="#444" />
    <Text style={styles.reactionCount}>{accident.downvotes}</Text>
  </TouchableOpacity>
</View>


    {/* Edit Button */}
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => navigation.navigate('EditAccidentScreen', { accident: accident })}
    >
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e86',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
  }, 
  reactionButton: {
    padding: 8,
  },
  deleteButton: {
  backgroundColor: '#e74c3c',
  padding: 12,
  borderRadius: 10,
  marginTop: 20,
  alignItems: 'center',
  width: 130,
  height:50,
},
reactionCount: {
  marginTop: 6,
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},
deleteButtonText: {
  color: '#fff',
  fontWeight: '600',
},
  postButton: {
    flex: 1,
    backgroundColor: '#2c3e86',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
},
headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2c3e86',
},
mapWrapper: {
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 16,
},
map: {
  width: '100%',
  height: 400,
},
accidentTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2c3e86',
},
link: {
  fontSize: 14,
  color: '#003399',
  textDecorationLine: 'underline',
},
editButton: {
  backgroundColor: '#2c3e86',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 10,
  alignItems: 'center',
  alignSelf: 'center',
  marginTop: 24,
},
editButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},

sideIcon: {
  width: 40,
  alignItems: 'center',
},
});

export default AccidentScreen;
