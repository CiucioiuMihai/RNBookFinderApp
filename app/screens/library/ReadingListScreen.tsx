import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import BookList from '../../components/Books/BookList';
import { Book } from '../../models/Book';
import { getUserByUid, removeFromReadingList, getFavoriteBookIds } from '../../services/firebase-utils';
import { getBookById } from '../../services/books-api';
import { auth } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReadingListScreenProps {
  navigation: any;
}

const ReadingListScreen: React.FC<ReadingListScreenProps> = ({ navigation }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [readingListBooks, setReadingListBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteBookIds, setFavoriteBookIds] = useState<string[]>([]);
  const currentUser = auth.currentUser;

  const loadReadingList = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        if (!currentUser) {
          setReadingListBooks([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          // Get user data
          const userData = await getUserByUid(currentUser.uid);
          
          if (!userData || !userData.readingList || userData.readingList.length === 0) {
            setReadingListBooks([]);
            return;
          }
          
          // Fetch details for each book ID in reading list
          const bookDetailsPromises = userData.readingList.map(id => getBookById(id));
          const booksWithDetails = await Promise.all(bookDetailsPromises);
          
          // Filter out any null results
          const enrichedBooks = booksWithDetails
            .filter((book): book is Book => book !== null)
            .map((book) => ({
              ...book,
              reviewCount: book.reviewCount || 0, // Default to 0 if not provided
              averageReviewRating: book.averageReviewRating || 0, // Default to 0 if not provided
            }));

          setReadingListBooks(enrichedBooks);

          // Refresh favoriteBookIds state
          const favoriteIds = await getFavoriteBookIds(currentUser.uid);
          setFavoriteBookIds(favoriteIds);

          // Cache reading list in AsyncStorage
          AsyncStorage.setItem('readingList', JSON.stringify(enrichedBooks));
        } catch (error) {
          console.error('Error loading reading list:', error);
          Alert.alert('Error', 'Failed to load reading list');
        } finally {
          setIsLoading(false);
          setRefreshing(false);
        }
      } else {
        // Retrieve cached reading list
        AsyncStorage.getItem('readingList')
          .then(data => {
            if (data) {
              setReadingListBooks(JSON.parse(data));
            }
          })
          .catch(err => console.error('Failed to load cached reading list:', err))
          .finally(() => {
            setIsLoading(false);
            setRefreshing(false);
          });
      }
    });
  };

  useEffect(() => {
    loadReadingList();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadReadingList();
    });
    
    return unsubscribe;
  }, [currentUser, navigation]);

  useEffect(() => {
    if (currentUser) {
      getFavoriteBookIds(currentUser.uid)
        .then((ids: string[]) => setFavoriteBookIds(ids))
        .catch((err: any) => console.error('Failed to fetch favorite books:', err));
    }
  }, [currentUser]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadReadingList();
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { bookId: book.id });
  };

  const handleRemoveFromReadingList = async (book: Book) => {
    if (!currentUser) return;

    try {
      await removeFromReadingList(currentUser.uid, book.id);
      setReadingListBooks(readingListBooks.filter(b => b.id !== book.id));

      // Update favoriteBookIds state dynamically
      setFavoriteBookIds(favoriteBookIds.filter(id => id !== book.id));
    } catch (error) {
      console.error('Error removing from reading list:', error);
      Alert.alert('Error', 'Failed to remove book from reading list');
    }
  };
  
  const renderEmptyState = () => {
    if (!currentUser) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="account-lock" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Sign in to see your reading list
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Books you want to read will appear here
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
        <Icon name="bookmark-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Your reading list is empty
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Books you save for later will appear here
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
        <Text style={[styles.title, { color: colors.text }]}>Reading List</Text>
      </View>

      {readingListBooks.length > 0 ? (
        <BookList
          books={readingListBooks}
          onBookPress={handleBookPress}
          isLoading={isLoading && !refreshing}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          favoriteBookIds={favoriteBookIds} // Pass favoriteBookIds to BookList
          onToggleFavorite={handleRemoveFromReadingList}
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

export default ReadingListScreen;