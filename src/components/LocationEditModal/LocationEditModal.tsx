import React, {useState, useEffect} from 'react';
import {Modal, Portal, Card, TextInput, Button, Text} from 'react-native-paper';
import {View} from 'react-native';
import {Location} from '../../types/Location';
import {styles} from './styles';

export interface LocationEditModalProps {
  visible: boolean;
  onDismiss: () => void;
  location?: Location;
  onSave: (id: string, newLatitude: number, newLongitude: number) => void;
}

const LocationEditModal: React.FC<LocationEditModalProps> = ({
  visible,
  onDismiss,
  location,
  onSave,
}) => {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  useEffect(() => {
    if (location) {
      setLatitude(location.latitude.toString());
      setLongitude(location.longitude.toString());
    }
  }, [location]);

  const handleSave = () => {
    const newLat = parseFloat(latitude);
    const newLon = parseFloat(longitude);
    if (location && !isNaN(newLat) && !isNaN(newLon)) {
      onSave(location.id, newLat, newLon);
      onDismiss();
    } else {
      console.log('Please enter valid numbers for latitude and longitude.');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Edit Location</Text>
            <TextInput
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={onDismiss} style={styles.button}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}>
                Save
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

export default LocationEditModal;
