import React, {useState} from 'react';
import {View, FlatList, Linking, Platform, Alert} from 'react-native';
import {Text, List, IconButton, MD3Colors} from 'react-native-paper';
import LocationEditModal from '../../components/LocationEditModal/LocationEditModal';
import {Location} from '../../types/Location';
import {styles} from './styles';
import Icon from '@react-native-vector-icons/material-icons';
import useLocations from '../../hooks/useLocations';

const LocationsScreen = () => {
  const {locations, deleteLocation, editLocation} = useLocations();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const openMap = (latitude: number, longitude: number) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${latitude},${longitude}`;
    const label = 'Selected Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('An error occurred', err),
      );
    }
  };

  const handleDeleteConfirmation = (locationId: string, timeStamp?: number) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete "${
        new Date(timeStamp).toLocaleString() || 'this location'
      }"?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteLocation(locationId), // Only delete if confirmed
          style: 'destructive', // Red button for destructive action
        },
      ],
      {cancelable: true}, // Allow dismissing by tapping outside
    );
  };

  const handleEditPress = (location: Location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const handleSaveEdit = (
    id: string,
    newLatitude: number,
    newLongitude: number,
  ) => {
    editLocation(id, newLatitude, newLongitude);
  };

  const renderLocationItem = ({item}: {item: Location}) => (
    <List.Item
      style={styles.listItem}
      contentStyle={styles.listItemContent}
      descriptionStyle={styles.listItemDescription}
      title={`Time: ${new Date(item.timestamp).toLocaleString()}`}
      description={`Latitude: ${item.latitude}\nLongitude: ${item.longitude}`}
      right={() => (
        <View style={styles.rowButtons}>
          <IconButton
            icon={({size, color}) => (
              <Icon name="edit" size={size} color={color} />
            )}
            iconColor={MD3Colors.primary50}
            size={20}
            onPress={() => handleEditPress(item)}
          />
          <IconButton
            icon={({size, color}) => (
              <Icon name="delete" size={size} color={color} />
            )}
            iconColor={MD3Colors.error50}
            size={20}
            onPress={() => handleDeleteConfirmation(item.id, item.timestamp)}
          />
        </View>
      )}
      onPress={() => openMap(item.latitude, item.longitude)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        renderItem={renderLocationItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No locations added yet.</Text>
          </View>
        )}
      />
      <LocationEditModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        location={selectedLocation}
        onSave={handleSaveEdit}
      />
    </View>
  );
};

export default LocationsScreen;
