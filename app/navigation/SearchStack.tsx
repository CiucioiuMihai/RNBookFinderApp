import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from '../screens/books/SearchScreen';
import BookDetailScreen from '../screens/books/BookDetailScreen';
import ReviewScreen from '../screens/books/ReviewScreen';
import { useTheme } from '../theme/useTheme';
import { SearchStackParamList } from './types';

const Stack = createStackNavigator<SearchStackParamList>();

const SearchStack = () => {
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
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search Books' }}
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

export default SearchStack;