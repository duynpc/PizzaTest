import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootTabParamList} from '../../types/RootTabParamsLists';
import Icon from '@react-native-vector-icons/material-icons';

interface TabBarIconProps {
  route: RouteProp<RootTabParamList, keyof RootTabParamList>;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({route, color, size}) => {
  let iconName: 'location-pin' | 'settings' | 'help';

  if (route.name === 'Locations') {
    iconName = 'location-pin';
  } else if (route.name === 'Settings') {
    iconName = 'settings';
  } else {
    iconName = 'help';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon;
