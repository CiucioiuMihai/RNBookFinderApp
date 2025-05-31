import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { ThemeProvider } from './app/theme/ThemeProvider';
import RootNavigator from './app/navigation/RootNavigator';

// Ignore warnings that are causing issues
LogBox.ignoreLogs([
  'pointerEvents is deprecated',
  'shadow props are deprecated',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}