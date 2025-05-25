import {useEffect, useRef} from 'react';
import {AppState, Platform, Alert} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import useSettings from './useSettings';
import useLocations from './useLocations';

const INACTIVITY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

const useNotification = () => {
  const {settings, setLocationTrackingEnabled} = useSettings();
  const {locations} = useLocations();
  const locationUnchangedDuration = useRef<number>(0);

  useEffect(() => {
    if (
      settings.isLocationTrackingEnabled &&
      settings.isPushNotificationsEnabled
    ) {
      if (locations && locations.length > 1) {
        const latestLocation = locations[locations.length - 1];
        const secondLastLocation = locations[locations.length - 2];
        if (latestLocation.timestamp && secondLastLocation.timestamp) {
          locationUnchangedDuration.current =
            locationUnchangedDuration.current +
            (latestLocation.timestamp - secondLastLocation.timestamp);
          console.log(
            'Updated location unchanged duration:',
            locationUnchangedDuration,
          );
        }

        if (locationUnchangedDuration.current > INACTIVITY_THRESHOLD_MS) {
          locationUnchangedDuration.current = 0;
          PushNotification.localNotification({
            channelId: 'location-inactivity',
            title: 'Location Inactivity Alert',
            message:
              'Your location has not changed for 10 minutes. Tap to disable tracking.',
            vibrate: true,
            playSound: true,
            soundName: 'default',
          });
        }
      }
    } else {
      locationUnchangedDuration.current = 0;
    }
  }, [locations, settings]);

  useEffect(() => {
    PushNotification.configure({
      onRegister: function (token: string) {
        console.log('NOTIFICATION TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION Received:', notification);

        if (notification.userInteraction) {
          console.log('Notification clicked: Disabling location tracking.');
          setLocationTrackingEnabled(false);

          if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          }
        }
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
        // process the action
      },
      onRegistrationError: function (err) {
        console.error('PushNotification registration error:', err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios', // Request permissions only for iOS on initial config
    });

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'location-inactivity',
          channelName: 'Location Inactivity Alerts',
          channelDescription:
            'Alerts when location tracking has been inactive for a while.',
          soundName: 'default',
          importance: PushNotification.Importance.HIGH,
          vibrate: true,
        },
        created =>
          console.log(
            `createChannel 'location-inactivity' returned '${created}'`,
          ),
      );
    }
  }, [setLocationTrackingEnabled]);

  return null;
};

export default useNotification;
