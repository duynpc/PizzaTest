import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';
import {MMKV} from 'react-native-mmkv';
import {AppSettings, UseSettingsHook} from '../types/Settings';

// Initialize MMKV storage
const storage = new MMKV({
  id: 'app-settings-storage',
});

// Default settings
const defaultSettings: AppSettings = {
  isPushNotificationsEnabled: true,
  locationSamplingRate: 8, // seconds
  isLocationTrackingEnabled: true,
};

const SETTINGS_KEY = 'appSettings';

const SettingsContext = createContext<UseSettingsHook | undefined>(undefined);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = storage.getString(SETTINGS_KEY);
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (e) {
      console.error(
        'Failed to parse stored settings from MMKV, using default.',
        e,
      );
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      storage.set(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to MMKV.', e);
    }
  }, [settings]);

  const setPushNotificationsEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({...prev, isPushNotificationsEnabled: enabled}));
  }, []);

  const setLocationSamplingRate = useCallback((rate: number) => {
    const safeRate = isNaN(rate) || rate < 0 ? 0 : rate;
    setSettings(prev => ({...prev, locationSamplingRate: safeRate}));
  }, []);

  const setLocationTrackingEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({...prev, isLocationTrackingEnabled: enabled}));
  }, []);

  const contextValue: UseSettingsHook = {
    settings,
    setPushNotificationsEnabled,
    setLocationSamplingRate,
    setLocationTrackingEnabled,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = (): UseSettingsHook => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default useSettings;
