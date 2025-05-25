# React Native Location Tracker App

This is a React Native application designed for tracking and managing user-defined locations as well as monitoring the device's real-time location. It features persistent storage, configurable settings, and local push notifications for location inactivity.

## Features

- **Persistent Location Storage**: Store and retrieve user-defined locations using `react-native-mmkv`.
- **Device Location Tracking**:
  - Utilizes `react-native-geolocation-service` for accurate device location.
  - Configurable **location sampling rate** (in seconds) via settings.
  - Toggleable **location tracking enabled/disabled** switch.
  - Cross-platform implementation: `setInterval` with `getCurrentPosition` for iOS, and `watchPosition` equivalent behavior for Android based on `interval` setting.
- **Settings Management**:
  - Persistent application settings powered by `react-native-mmkv`.
  - Configurable **Push Notifications** enable/disable.
  - Configurable **Location Tracking** enable/disable.
  - Configurable **Location Sampling Rate**.
- **Interactive Location List**:
  - Display a list of saved and tracked device locations.
  - View location details (Latitude, Longitude, Name, Timestamp).
  - Tap on a location to open it in a map application (Google Maps/Apple Maps).
- **Location Management**:
  - **Edit** existing locations (latitude, longitude).
  - **Delete** locations with a confirmation dialog.
- **Location Inactivity Alerts**:
  - Local push notifications powered by `react-native-push-notification`.
  - If both location tracking and push notifications are enabled, a notification is triggered when the device's location hasn't changed for **10 minutes**.
  - Tapping the inactivity notification will automatically **disable location tracking**.
- **Shared State Management**: Utilizes React Context API to ensure settings and location data are consistently accessed across the application.
- **Modern UI**: Built with `react-native-paper` for a Material Design look and feel.
- **Vector Icons**: Uses `react-native-vector-icons/MaterialIcons` for crisp, scalable icons.

## Setup and Installation

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### 1. Install Dependencies

npm install

### 2. Install Pods (iOS only)

cd ios && pod install && cd ..

### 3. Run the app

npm run ios
or
npm run android
