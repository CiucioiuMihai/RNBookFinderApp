import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { searchBooks } from '../../services/books-api';
import { Book } from '../../models/Book';
import BookList from '../../components/Books/BookList';
import SearchBar from '../../components/Books/SearchBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFavoriteBookIds, isBookFavorited, addToFavorites, removeFromFavorites, logout } from '../../services/firebase-utils';
import { auth } from '../../../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeScreenProps {
  navigation: any;
}

const CATEGORIES = [
  { name: 'Fiction', query: 'subject:fiction' },
  { name: 'Sci-Fi', query: 'subject:science+fiction' },
  { name: 'Fantasy', query: 'subject:fantasy' },
  { name: 'Mystery', query: 'subject:mystery' },
  { name: 'Biography', query: 'subject:biography' },
  { name: 'History', query: 'subject:history' },
  { name: 'Self-Help', query: 'subject:self+help' },
  { name: 'Business', query: 'subject:business' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, styles: themeStyles } = useTheme();
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Fetch new releases
    searchBooks('&orderBy=newest&maxResults=10')
      .then(books => setNewReleases(books))
      .catch(err => console.error('Failed to fetch new releases:', err))
      .finally(() => setLoading(false));

    // Fetch popular books
    searchBooks('&orderBy=relevance&maxResults=10')
      .then(books => setPopularBooks(books))
      .catch(err => console.error('Failed to fetch popular books:', err));

    // Fetch user favorites if logged in
    if (currentUser) {
      getFavoriteBookIds(currentUser.uid)
        .then(ids => setFavoriteIds(ids))
        .catch(err => console.error('Failed to fetch favorite books:', err));
    }
  }, [currentUser]);

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

  const goToSearch = (query?: string) => {
    navigation.navigate('SearchTab', {
      screen: 'Search',
      params: { query },
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await logout();
      // RootNavigator will handle navigation
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderCategoryButtons = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
            onPress={() => goToSearch(category.query)}
          >
            <Text style={[styles.categoryText, { color: colors.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSectionHeader = (title: string, onSeeAll: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
        <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        <Icon name="chevron-right" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            {currentUser ? 'Welcome back!' : 'Explore Books'}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Book Finder</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: colors.surface }]}
            onPress={() => currentUser 
              ? navigation.navigate('Settings') 
              : navigation.navigate('Login')
            }
          >
            <Icon 
              name={currentUser ? 'account' : 'account-outline'} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          {currentUser && (
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: colors.error, marginLeft: 8 }]}
              onPress={handleLogout}
              accessibilityLabel="Logout"
            >
              <Icon name="logout" size={22} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SearchBar
        onSearch={goToSearch}
        placeholder="Search for books, authors, or topics..."
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {renderCategoryButtons()}

        <View style={styles.section}>
          {renderSectionHeader('New Releases', () => goToSearch('&orderBy=newest'))}
          <BookList
            books={newReleases}
            onBookPress={handleBookPress}
            isLoading={loading}
            horizontal={true}
            favoriteBookIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
        
        <View style={styles.section}>
          {renderSectionHeader('Popular Now', () => goToSearch('&orderBy=relevance'))}
          <BookList
            books={popularBooks}
            onBookPress={handleBookPress}
            isLoading={loading}
            horizontal={true}
            favoriteBookIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    marginRight: 4,
  },
});

export default HomeScreen;