import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import ReviewForm from '../../components/Books/ReviewForm';
import { addBookReview, getReviewById } from '../../services/firebase-utils';
import { auth } from '../../../firebaseConfig';

interface ReviewScreenProps {
  navigation: any;
  route: {
    params: {
      bookId: string;
      bookTitle: string;
      mode: 'add' | 'edit';
      reviewId?: string;
    };
  };
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ navigation, route }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialRating, setInitialRating] = useState(0);
  const [initialReview, setInitialReview] = useState('');
  const [isLoading, setIsLoading] = useState(route.params.mode === 'edit');
  
  const { bookId, bookTitle, mode, reviewId } = route.params;
  const currentUser = auth.currentUser;

  useEffect(() => {
    // If in edit mode, fetch the existing review
    if (mode === 'edit' && reviewId) {
      setIsLoading(true);
      getReviewById(reviewId)
        .then(review => {
          if (review) {
            setInitialRating(review.rating);
            setInitialReview(review.review || '');
          }
        })
        .catch(error => {
          console.error('Error fetching review:', error);
          Alert.alert('Error', 'Failed to load review');
        })
        .finally(() => setIsLoading(false));
    }
  }, [mode, reviewId]);

  const handleSubmit = async (rating: number, review: string) => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        await addBookReview(currentUser.uid, bookId, rating, review);
        Alert.alert('Success', 'Your review has been submitted');
      } else if (mode === 'edit' && reviewId) {
        // TODO: Implement edit review functionality
        Alert.alert('Feature Coming Soon', 'Editing reviews will be available soon');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ReviewForm 
        bookTitle={bookTitle}
        initialRating={initialRating}
        initialReview={initialReview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || isLoading}
        isEdit={mode === 'edit'}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReviewScreen;