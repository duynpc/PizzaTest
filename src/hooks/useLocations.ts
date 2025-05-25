import {useState, useCallback, useEffect, useRef} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import useSettings from './useSettings';
import {Location} from '../types/Location';
import {MMKV} from 'react-native-mmkv';

const locationStorage = new MMKV({
  id: 'app-locations-storage', // Use a different ID for locations storage
});
const LOCATIONS_KEY = 'userLocations';

const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>(() => {
    try {
      const storedLocations = locationStorage.getString(LOCATIONS_KEY);
      if (storedLocations) {
        return JSON.parse(storedLocations);
      }
    } catch (e) {
      console.error(
        'Failed to parse stored locations from MMKV, starting with default.',
        e,
      );
    }
    return [];
  });
  const {settings} = useSettings();
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to track your position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Location Permission Denied',
            'Cannot track location without permission. Please enable it in your device settings.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return false;
  };

  const setupLocationTracking = async () => {
    // Clear any existing interval to prevent duplicates
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    if (
      settings.isLocationTrackingEnabled &&
      settings.locationSamplingRate > 0
    ) {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const fetchAndAddLocation = () => {
          Geolocation.getCurrentPosition(
            position => {
              const newLocation: Location = {
                id: `device-${Date.now()}`,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: Date.now(),
              };
              console.log('New device location tracked:', newLocation);
              setLocations(prevLocations => [...prevLocations, newLocation]);
            },
            error => {
              console.error('Failed to get current position:', error);
              if (error.code === 1) {
                // PERMISSION_DENIED
                Alert.alert(
                  'Location Error',
                  'Location permission denied. Please enable it in settings.',
                );
                // Optionally, you might want to disable tracking in settings here if permission is permanently denied
                // settings.setLocationTrackingEnabled(false); // This would require setLocationTrackingEnabled from useSettings
              } else if (error.code === 2) {
                // POSITION_UNAVAILABLE
                console.log('Location unavailable, retrying...');
              } else if (error.code === 3) {
                // TIMEOUT
                console.log('Location request timed out.');
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 1000,
            },
          );
        };

        fetchAndAddLocation();

        intervalId.current = setInterval(
          fetchAndAddLocation,
          settings.locationSamplingRate * 1000,
        );
        console.log(
          `Started location tracking with interval: ${settings.locationSamplingRate} seconds.`,
        );
      }
    } else {
      // Stop tracking if disabled or rate is 0
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        console.log('Location tracking stopped.');
      }
    }
  };

  useEffect(() => {
    setupLocationTracking();

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        console.log('Location interval cleared on cleanup.');
      }
    };
  }, [settings.isLocationTrackingEnabled, settings.locationSamplingRate]);

  useEffect(() => {
    try {
      locationStorage.set(LOCATIONS_KEY, JSON.stringify(locations));
    } catch (e) {
      console.error('Failed to save locations to MMKV.', e);
    }
  }, [locations]);

  const addLocation = useCallback((latitude: number, longitude: number) => {
    setLocations(prevLocations => [
      ...prevLocations,
      {id: Date.now().toString(), latitude, longitude, timestamp: Date.now()},
    ]);
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations(prevLocations => prevLocations.filter(loc => loc.id !== id));
  }, []);

  const editLocation = useCallback(
    (id: string, newLatitude: number, newLongitude: number) => {
      setLocations(prevLocations =>
        prevLocations.map(loc =>
          loc.id === id
            ? {...loc, latitude: newLatitude, longitude: newLongitude}
            : loc,
        ),
      );
    },
    [],
  );

  return {
    locations,
    addLocation,
    deleteLocation,
    editLocation,
  };
};

export default useLocations;
