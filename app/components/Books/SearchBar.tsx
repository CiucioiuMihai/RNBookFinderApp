import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search for books...', 
  initialValue = '',
  isLoading = false,
  autoFocus = false
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Keyboard.dismiss();
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (!initialValue) {
      onSearch('');
    }
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colors.background }
    ]}>
      <View style={[
        styles.searchBar, 
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]}>
        <Icon name="magnify" size={24} color={colors.textSecondary} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          editable={true}
          selectTextOnFocus={true}
          blurOnSubmit={true}
          pointerEvents="auto"
          importantForAccessibility="yes"
          accessible={true}
          accessibilityLabel="Search input"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.searchButton, 
          { backgroundColor: colors.primary }
        ]}
        onPress={handleSearch}
        disabled={isLoading || searchQuery.trim() === ''}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Icon name="magnify" size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    pointerEvents: 'auto',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    pointerEvents: 'auto',
    zIndex: 1,
  },
  clearButton: {
    padding: 4,
    pointerEvents: 'auto',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
});

export default SearchBar;