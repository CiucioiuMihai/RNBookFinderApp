import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ReviewFormProps {
  bookTitle: string;
  initialRating?: number;
  initialReview?: string;
  onSubmit: (rating: number, review: string) => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  bookTitle,
  initialRating = 0,
  initialReview = '',
  onSubmit,
  isSubmitting = false,
  isEdit = false,
  onCancel
}) => {
  const { colors } = useTheme();
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  
  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
      return;
    }
    
    onSubmit(rating, review);
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {isEdit ? 'Edit Review' : 'Write a Review'}
      </Text>
      
      <Text style={[styles.bookTitle, { color: colors.textSecondary }]}>
        for "{bookTitle}"
      </Text>
      
      <View style={styles.ratingContainer}>
        <Text style={[styles.ratingLabel, { color: colors.text }]}>Your Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Icon 
                name={rating >= star ? 'star' : 'star-outline'} 
                size={36} 
                color={rating >= star ? '#FFC107' : colors.textSecondary} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <Text style={[styles.reviewLabel, { color: colors.text }]}>Your Review (optional):</Text>
      <TextInput
        style={[
          styles.reviewInput, 
          { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            color: colors.text
          }
        ]}
        placeholder="Share your thoughts about the book..."
        placeholderTextColor={colors.textSecondary}
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        editable={!isSubmitting}
        selectTextOnFocus={true}
        blurOnSubmit={true}
      />
      
      <View style={styles.buttonsContainer}>
        {onCancel && (
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.cancelButton,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.submitButton, 
            { backgroundColor: colors.primary },
            (rating === 0 || isSubmitting) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Update Review' : 'Submit Review'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    marginLeft: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewForm;