import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { getBookById } from '../../services/books-api';
import BookDetails from '../../components/Books/BookDetails';
import { Book } from '../../models/Book';
import { BookReview } from '../../models/BookReview';
import { 
  getBookReviews, 
  addToFavorites, 
  removeFromFavorites, 
  isBookFavorited,
  addToReadingList,
  removeFromReadingList,
  isInReadingList as checkIsInReadingList,
} from '../../services/firebase-utils';
import { auth } from '../../../firebaseConfig';
import { BookDetailScreenNavigationProp, BookDetailScreenRouteProp } from '../../navigation/types';
import NetInfo from '@react-native-community/netinfo';
import { saveToStorage, getFromStorage } from '../../services/storage-utils';

interface BookDetailScreenProps {
  navigation: BookDetailScreenNavigationProp;
  route: BookDetailScreenRouteProp;
}

const BookDetailScreen: React.FC<BookDetailScreenProps> = ({ navigation, route }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  
  const { bookId } = route.params;
  const currentUser = auth.currentUser;

  useEffect(() => {
    const loadBookData = async () => {
      setLoading(true);
      try {
        // Fetch book details
        const bookData = await getBookById(bookId);
        setBook(bookData);
        // Add error handling for saving book details
        await saveToStorage(`book_${bookId}`, bookData);

        // Fetch reviews
        const reviewsData = await getBookReviews(bookId);
        setReviews(reviewsData);
        // Add error handling for saving reviews
        await saveToStorage(`reviews_${bookId}`, reviewsData);

        // Add logs for debugging
        console.log('Saving book details to storage-utils:', bookData);
        console.log('Saving reviews to storage-utils:', reviewsData);

        // Check if book is favorited and in reading list (if user is logged in)
        if (currentUser) {
          const favoriteStatus = await isBookFavorited(currentUser.uid, bookId);
          setIsFavorite(favoriteStatus);
          
          // Check reading list status
          const readingListStatus = await checkIsInReadingList(currentUser.uid, bookId);
          setIsInReadingList(readingListStatus);
        }
      } catch (err) {
        console.error('Error loading book details:', err);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };    NetInfo.fetch().then(async state => {
      console.log('Network state:', state.isConnected ? 'Online' : 'Offline');
      
      // Try to load cached data first regardless of network state
      try {
        const cachedBookData = await getFromStorage(`book_${bookId}`);
        console.log('Retrieved book details from storage-utils:', cachedBookData);
        if (cachedBookData) {
          setBook(cachedBookData);
          setLoading(false); // Set loading to false if we have cached data
        }

        const cachedReviewsData = await getFromStorage(`reviews_${bookId}`);
        console.log('Retrieved reviews from storage-utils:', cachedReviewsData);
        if (cachedReviewsData) {
          setReviews(cachedReviewsData);
        }
      } catch (err) {
        console.error('Error loading cached data:', err);
      }
      
      // If online, load fresh data
      if (state.isConnected) {
        loadBookData();
      } else {
        // If we're offline and didn't load cached data above, show message
        if (!await getFromStorage(`book_${bookId}`)) {
          console.warn('No cached book details found for book:', bookId);
          setLoading(false);
          setError('No cached data available offline. Please reconnect to the internet.');
        }
      }
    });
  }, [bookId, currentUser]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        // Only refresh reviews if online
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
          const reviewsData = await getBookReviews(bookId);
          setReviews(reviewsData);
          // Save the latest reviews to storage
          await saveToStorage(`reviews_${bookId}`, reviewsData);
        } else {
          // If offline, try to load from cache
          const cachedReviews = await getFromStorage(`reviews_${bookId}`);
          if (cachedReviews) {
            setReviews(cachedReviews);
          }
        }
      } catch (error) {
        console.error('Error refreshing reviews:', error);
      }
    });

    return unsubscribe;
  }, [navigation, bookId]);

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      // Fix navigation to Login screen
      navigation.navigate('Login' as any);
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentUser.uid, bookId);
        setIsFavorite(false);
      } else {
        await addToFavorites(currentUser.uid, bookId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleToggleReadingList = async () => {
    if (!currentUser) {
      // Fix navigation to Login screen
      navigation.navigate('Login' as any);
      return;
    }

    try {
      if (isInReadingList) {
        await removeFromReadingList(currentUser.uid, bookId);
        setIsInReadingList(false);
      } else {
        await addToReadingList(currentUser.uid, bookId);
        setIsInReadingList(true);
      }
    } catch (error) {
      console.error('Error toggling reading list:', error);
      Alert.alert('Error', 'Failed to update reading list');
    }
  };

  const handleAddReview = () => {
    if (!currentUser) {
      // Fix navigation to Login screen
      navigation.navigate('Login' as any);
      return;
    }
    
    if (!book) return;
    
    navigation.navigate('Review', { 
      bookId: book.id,
      bookTitle: book.title,
      mode: 'add'
    });
  };

  const handleViewAllReviews = () => {
    if (!book) return;
    
    // TODO: Create a ReviewsScreen to show all reviews for a book
    Alert.alert('Reviews', 'All reviews view will be implemented soon');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginHorizontal: 20 }}>
          No book details available offline. Please check your internet connection and try again.
        </Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No reviews available offline.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <BookDetails
        book={book}
        reviews={reviews}
        isFavorite={isFavorite}
        isInReadingList={isInReadingList}
        onToggleFavorite={handleToggleFavorite}
        onToggleReadingList={handleToggleReadingList}
        onAddReview={handleAddReview}
        onViewAllReviews={reviews.length > 2 ? handleViewAllReviews : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookDetailScreen;