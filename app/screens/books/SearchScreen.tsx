import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { searchBooks } from '../../services/books-api';
import { Book } from '../../models/book';
import BookList from '../../components/Books/BookList';
import SearchBar from '../../components/Books/SearchBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFavoriteBookIds, isBookFavorited, addToFavorites, removeFromFavorites } from '../../services/firebase-utils';
import { auth } from '../../../firebaseConfig';

interface SearchScreenProps {
  navigation: any;
  route: {
    params?: {
      query?: string;
    };
  };
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Initialize with query from route params if available
    if (route.params?.query) {
      handleSearch(route.params.query);
    }
    
    // Fetch user favorites if logged in
    if (currentUser) {
      getFavoriteBookIds(currentUser.uid)
        .then(ids => setFavoriteIds(ids))
        .catch(err => console.error('Failed to fetch favorite books:', err));
    }
  }, [currentUser, route.params]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchBooks(query);
      setBooks(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleToggleFavorite = async (book: Book) => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    try {
      const isFavorited = await isBookFavorited(currentUser.uid, book.id);
      
      if (isFavorited) {
        await removeFromFavorites(currentUser.uid, book.id);
        setFavoriteIds(favoriteIds.filter(id => id !== book.id));
      } else {
        await addToFavorites(currentUser.uid, book.id);
        setFavoriteIds([...favoriteIds, book.id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Searching...
          </Text>
        </View>
      );
    }

    if (hasSearched && books.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="book-search-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Try adjusting your search terms
          </Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Search for books
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Find books by title, author, or topic
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <SearchBar
        onSearch={handleSearch}
        initialValue={searchQuery}
        isLoading={loading}
        autoFocus={!route.params?.query}
      />

      {books.length > 0 ? (
        <BookList
          books={books}
          onBookPress={handleBookPress}
          favoriteBookIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : renderEmptyState()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});

export default SearchScreen;