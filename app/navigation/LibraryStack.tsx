import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import FavoritesScreen from '../screens/library/FavoritesScreen';
import ReadingListScreen from '../screens/library/ReadingListScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import ReviewScreen from '../screens/books/ReviewScreen';
import { useTheme } from '../theme/useTheme';
import { LibraryStackParamList } from './types';

const Stack = createStackNavigator<LibraryStackParamList>();
const Tab = createMaterialTopTabNavigator();

// Inner tab navigator for Favorites and Reading List
const LibraryTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
      }}
    >
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="ReadingList" component={ReadingListScreen} options={{ title: 'Reading List' }} />
    </Tab.Navigator>
  );
};

const LibraryStack = () => {
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
        name="Library"
        component={LibraryTabs}
        options={{ title: 'My Library' }}
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

export default LibraryStack;