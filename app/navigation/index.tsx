import React from 'react';
import { enableScreens } from 'react-native-screens';
import { LogBox } from 'react-native';

// Enable screens for better navigation performance
enableScreens();

// Ignore specific warnings
LogBox.ignoreLogs([
  'pointerEvents is deprecated',
  'shadow props are deprecated',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'The action \'NAVIGATE\' with payload',
  'Non-serializable values were found in the navigation state'
]);

// Export all navigation components
export { default as AppNavigator } from './AppNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export { default as TabNavigator } from './TabNavigator';
export { default as HomeStack } from './HomeStack';
export { default as SearchStack } from './SearchStack';
export { default as LibraryStack } from './LibraryStack';
export { default as SettingsStack } from './SettingsStack';
