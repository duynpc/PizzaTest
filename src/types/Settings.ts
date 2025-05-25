export interface AppSettings {
  isPushNotificationsEnabled: boolean;
  locationSamplingRate: number; // in seconds
  isLocationTrackingEnabled: boolean; // New setting
}

export interface UseSettingsHook {
  settings: AppSettings;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  setLocationSamplingRate: (rate: number) => void;
  setLocationTrackingEnabled: (enabled: boolean) => void;
}
