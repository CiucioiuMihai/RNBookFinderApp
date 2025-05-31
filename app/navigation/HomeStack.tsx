import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/books/HomeScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import ReviewScreen from '../screens/books/ReviewScreen';
import { useTheme } from '../theme/useTheme';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Book Finder' }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: 'Book Details' }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={({ route }) => ({
          title: route.params.mode === 'edit' ? 'Edit Review' : 'Add Review'
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;