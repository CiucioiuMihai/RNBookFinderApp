import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Linking
} from 'react-native';
import { Book } from '../../models/book';
import { useTheme } from '../../theme/useTheme';
import { BookReview } from '../../models/BookReview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BookDetailsProps {
  book: Book;
  reviews?: BookReview[];
  isFavorite: boolean;
  isInReadingList?: boolean;
  onToggleFavorite: () => void;
  onToggleReadingList?: () => void;
  onAddReview: () => void;
  onViewAllReviews?: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  reviews = [],
  isFavorite,
  isInReadingList = false,
  onToggleFavorite,
  onToggleReadingList,
  onAddReview,
  onViewAllReviews
}) => {
  const { colors } = useTheme();
  const [expandDescription, setExpandDescription] = useState(false);
  
  const placeholderImage = 'https://via.placeholder.com/360x540/e0e0e0/a0a0a0?text=No+Cover';
  
  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon 
            key={star}
            name={rating >= star ? 'star' : 'star-outline'} 
            size={18} 
            color={rating >= star ? '#FFC107' : colors.textSecondary} 
          />
        ))}
      </View>
    );
  };

  const openPreview = () => {
    if (book.previewLink) {
      Linking.openURL(book.previewLink).catch(err => 
        console.error('Failed to open preview link:', err)
      );
    }
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: book.thumbnail || book.smallThumbnail || placeholderImage }}
          style={styles.bookCover}
          resizeMode="cover"
        />
        
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.text }]}>{book.title}</Text>
          
          {book.subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {book.subtitle}
            </Text>
          )}
          
          {book.authors && book.authors.length > 0 && (
            <Text style={[styles.authors, { color: colors.text }]}>
              by {book.authors.join(', ')}
            </Text>
          )}
          
          {book.averageRating && (
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {book.averageRating.toFixed(1)}
              </Text>
              {renderRatingStars(book.averageRating)}
              {book.ratingsCount && (
                <Text style={[styles.ratingsCount, { color: colors.textSecondary }]}>
                  ({book.ratingsCount} ratings)
                </Text>
              )}
            </View>
          )}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: colors.surface }
              ]} 
              onPress={onToggleFavorite}
            >
              <Icon 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={24} 
                color={isFavorite ? colors.primary : colors.text} 
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Text>
            </TouchableOpacity>
            
            {onToggleReadingList && (
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { backgroundColor: colors.surface }
                ]} 
                onPress={onToggleReadingList}
              >
                <Icon 
                  name={isInReadingList ? 'bookmark' : 'bookmark-outline'} 
                  size={24} 
                  color={isInReadingList ? colors.primary : colors.text} 
                />
                <Text style={[styles.actionText, { color: colors.text }]}>
                  {isInReadingList ? 'In List' : 'Read Later'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {(book.publisher || book.publishedDate || book.pageCount) && (
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          {book.publisher && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Publisher:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{book.publisher}</Text>
            </View>
          )}
          
          {book.publishedDate && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Published:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{book.publishedDate}</Text>
            </View>
          )}
          
          {book.pageCount && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Pages:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{book.pageCount}</Text>
            </View>
          )}
          
          {book.categories && book.categories.length > 0 && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Categories:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{book.categories.join(', ')}</Text>
            </View>
          )}
        </View>
      )}
      
      {book.description && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text 
            style={[
              styles.description, 
              { color: colors.text },
              !expandDescription && styles.descriptionTruncated
            ]}
            numberOfLines={expandDescription ? undefined : 5}
          >
            {book.description}
          </Text>
          {book.description.length > 200 && (
            <TouchableOpacity onPress={() => setExpandDescription(!expandDescription)}>
              <Text style={[styles.readMore, { color: colors.primary }]}>
                {expandDescription ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {book.previewLink && (
        <TouchableOpacity 
          style={[styles.previewButton, { backgroundColor: colors.primary }]} 
          onPress={openPreview}
        >
          <Icon name="book-open-variant" size={20} color="#ffffff" />
          <Text style={styles.previewButtonText}>Preview Book</Text>
        </TouchableOpacity>
      )}
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.reviewsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
          {reviews.length > 0 && onViewAllReviews && (
            <TouchableOpacity onPress={onViewAllReviews}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View all ({reviews.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {reviews.length > 0 ? (
          reviews.slice(0, 2).map((review) => (
            <View 
              key={review.id} 
              style={[styles.reviewItem, { borderBottomColor: colors.border }]}
            >
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewUser, { color: colors.text }]}>
                  {review.userName || 'Anonymous'}
                </Text>
                <View style={styles.reviewRating}>
                  {renderRatingStars(review.rating)}
                </View>
              </View>
              {review.review && (
                <Text style={[styles.reviewText, { color: colors.text }]}>
                  {review.review}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.noReviews, { color: colors.textSecondary }]}>
            No reviews yet
          </Text>
        )}
        
        <TouchableOpacity 
          style={[styles.addReviewButton, { backgroundColor: colors.surface }]} 
          onPress={onAddReview}
        >
          <Icon name="pencil" size={20} color={colors.primary} />
          <Text style={[styles.addReviewText, { color: colors.primary }]}>
            {reviews.length > 0 ? 'Write a Review' : 'Be the first to review'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const coverWidth = Math.min(width * 0.35, 150);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  bookCover: {
    width: coverWidth,
    height: coverWidth * 1.5,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    paddingLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  authors: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingsCount: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  descriptionTruncated: {
    maxHeight: 110,
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
  },
  reviewItem: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noReviews: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  addReviewText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BookDetails;