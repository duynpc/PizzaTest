import React, {useState} from 'react';
import {View} from 'react-native';
import {Switch, Text, TextInput, Card} from 'react-native-paper';
import {styles} from './styles';
import useSettings from '../../hooks/useSettings';

const SettingsScreen: React.FC = () => {
  const {
    settings,
    setPushNotificationsEnabled,
    setLocationSamplingRate,
    setLocationTrackingEnabled,
  } = useSettings();

  const handleSamplingRateChange = (text: string) => {
    const parsedValue = parseInt(text, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setLocationSamplingRate(parsedValue);
    } else if (text === '') {
      setLocationSamplingRate(8000);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Notification Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={settings.isPushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Location Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Enable Location Tracking</Text>
            <Switch
              value={settings.isLocationTrackingEnabled}
              onValueChange={setLocationTrackingEnabled}
            />
          </View>
          <Text style={styles.settingText}>
            Location Sampling Rate (seconds)
          </Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>
              Location Sampling Rate (seconds)
            </Text>
            <TextInput
              value={settings.locationSamplingRate.toString()}
              onChangeText={handleSamplingRateChange}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
          </View>
          <Text variant="bodyMedium" style={styles.helperText}>
            Enter a positive number to set how often the app samples your
            location.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default SettingsScreen;
