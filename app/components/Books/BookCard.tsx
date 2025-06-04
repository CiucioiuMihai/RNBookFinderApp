import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Book } from '../../models/Book';
import { useTheme } from '../../theme/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onPress, 
  isFavorite = false,
  onToggleFavorite
}) => {
  const { colors, theme } = useTheme();
  const placeholderImage = 'https://via.placeholder.com/128x192/e0e0e0/a0a0a0?text=No+Cover';

  const handleFavoritePress = (event: any) => {
    event.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(book);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={() => onPress(book)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: book.thumbnail || book.smallThumbnail || placeholderImage }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={2}
        >
          {book.title}
        </Text>
        
        {book.authors && book.authors.length > 0 && (
          <Text 
            style={[styles.author, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {book.authors.join(', ')}
          </Text>
        )}

        {onToggleFavorite && (
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleFavoritePress}
          >
            <Icon 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth > 500 ? 220 : windowWidth * 0.44;

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookCard;