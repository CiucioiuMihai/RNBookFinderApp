import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import BookList from '../../components/Books/BookList';
import { Book } from '../../models/Book';
import { getFavoriteBookIds, removeFromFavorites } from '../../services/firebase-utils';
import { getBookById } from '../../services/books-api';
import { auth } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FavoritesScreenProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = auth.currentUser;

  const loadFavorites = async () => {
    if (!currentUser) {
      setFavoriteBooks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const favoriteIds = await getFavoriteBookIds(currentUser.uid);
      
      // Fetch details for each book ID
      const bookDetailsPromises = favoriteIds.map(id => getBookById(id));
      const booksWithDetails = await Promise.all(bookDetailsPromises);
      
      // Filter out any null results
      setFavoriteBooks(booksWithDetails.filter((book): book is Book => book !== null));
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite books');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    
    return unsubscribe;
  }, [currentUser, navigation]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleToggleFavorite = async (book: Book) => {
    if (!currentUser) return;

    try {
      await removeFromFavorites(currentUser.uid, book.id);
      setFavoriteBooks(favoriteBooks.filter(b => b.id !== book.id));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Error', 'Failed to remove book from favorites');
    }
  };
  
  const renderEmptyState = () => {
    if (!currentUser) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="account-lock" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sign in to see your favorites
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Your favorite books will appear here
          </Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No favorites yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Books you favorite will appear here
        </Text>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreButtonText}>Explore Books</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
      </View>

      {favoriteBooks.length > 0 ? (
        <BookList
          books={favoriteBooks.map(book => ({
            ...book,
            reviewCount: book.reviewCount,
            averageReviewRating: book.averageReviewRating,
          }))}
          onBookPress={handleBookPress}
          isLoading={isLoading && !refreshing}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          favoriteBookIds={favoriteBooks.map(book => book.id)}
          onToggleFavorite={handleToggleFavorite}
          ListEmptyComponent={renderEmptyState()}
        />
      ) : renderEmptyState()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exploreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesScreen;