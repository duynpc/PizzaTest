import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider, MD3LightTheme} from 'react-native-paper';
import {RootTabParamList} from './types/RootTabParamsLists';
import LocationsScreen from './screens/Locations/LocationsScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import TabBarIcon from './components/TabBarIcon/TabBarIcon';
import {SettingsProvider} from './hooks/useSettings';
import useNotification from './hooks/useNotifications';

const Tab = createBottomTabNavigator<RootTabParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    accent: '#03DAC6',
  },
};

const Content = () => {
  useNotification();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => (
            <TabBarIcon route={route} color={color} size={size} />
          ),
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Locations" component={LocationsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SettingsProvider>
        <Content />
      </SettingsProvider>
    </PaperProvider>
  );
}
