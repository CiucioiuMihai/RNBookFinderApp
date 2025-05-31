import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  BookDetail: { bookId: string };
  Review: { bookId: string; bookTitle: string; mode: 'add' | 'edit'; reviewId?: string };
};

// Search Stack
export type SearchStackParamList = {
  Search: { query?: string };
  BookDetail: { bookId: string };
  Review: { bookId: string; bookTitle: string; mode: 'add' | 'edit'; reviewId?: string };
};

// Library Stack
export type LibraryStackParamList = {
  Library: undefined;
  Favorites: undefined;
  ReadingList: undefined;
  BookDetail: { bookId: string };
  Review: { bookId: string; bookTitle: string; mode: 'add' | 'edit'; reviewId?: string };
};

// Settings Stack
export type SettingsStackParamList = {
  Settings: undefined;
};

// Main Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  LibraryTab: undefined;
  SettingsTab: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Navigation prop types
export type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;
export type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'Search'>;
export type BookDetailScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'BookDetail'>;
export type ReviewScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Review'>;

// Route prop types
export type BookDetailScreenRouteProp = RouteProp<HomeStackParamList, 'BookDetail'>;
export type ReviewScreenRouteProp = RouteProp<HomeStackParamList, 'Review'>;
export type SearchScreenRouteProp = RouteProp<SearchStackParamList, 'Search'>;