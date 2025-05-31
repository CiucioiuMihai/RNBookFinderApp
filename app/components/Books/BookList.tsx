import React from 'react';
import { 
  FlatList, 
  ActivityIndicator, 
  Text, 
  View, 
  StyleSheet,
  RefreshControl,
  ListRenderItemInfo
} from 'react-native';
import { Book } from '../../models/book';
import BookCard from './BookCard';
import { useTheme } from '../../theme/useTheme';

interface BookListProps {
  books: Book[];
  onBookPress: (book: Book) => void;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  favoriteBookIds?: string[];
  onToggleFavorite?: (book: Book) => void;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  horizontal?: boolean;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onBookPress,
  isLoading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  favoriteBookIds = [],
  onToggleFavorite,
  ListEmptyComponent,
  ListHeaderComponent,
  horizontal = false
}) => {
  const { colors } = useTheme();

  const renderItem = ({ item }: ListRenderItemInfo<Book>) => (
    <BookCard
      book={item}
      onPress={onBookPress}
      isFavorite={favoriteBookIds.includes(item.id)}
      onToggleFavorite={onToggleFavorite}
    />
  );

  if (isLoading && books.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={horizontal ? 1 : 2}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No books found
            </Text>
          </View>
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoading && books.length > 0 ? (
          <ActivityIndicator 
            size="small" 
            color={colors.primary} 
            style={styles.footerLoader} 
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    alignItems: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    width: '100%',
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerLoader: {
    marginVertical: 16,
  },
});

export default BookList;