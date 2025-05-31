import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import ThemeToggle from '../../components/settings/ThemeToggle';
import { logout } from '../../services/firebase-utils';
import { auth } from '../../../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, styles: themeStyles, theme } = useTheme();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Welcome');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out');
            }
          },
        },
      ],
    );
  };

  const renderSettingItem = (
    icon: string, 
    title: string, 
    onPress: () => void, 
    description?: string,
    showArrow = true
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      {showArrow && <Icon name="chevron-right" size={24} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {currentUser && (
          <>
            {renderSectionHeader('Account')}
            {renderSettingItem(
              'account',
              'Profile',
              () => Alert.alert('Profile', 'Profile settings will be implemented soon'),
              currentUser.email || undefined
            )}
            {renderSettingItem(
              'security',
              'Security',
              () => Alert.alert('Security', 'Security settings will be implemented soon'),
              'Password & authentication'
            )}
          </>
        )}

        {renderSectionHeader('Preferences')}
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingIconContainer}>
            <Icon name={theme === 'dark' ? 'weather-night' : 'white-balance-sunny'} size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <ThemeToggle label="" />
        </View>

        {renderSettingItem(
          'bell-outline',
          'Notifications',
          () => Alert.alert('Notifications', 'Notification settings will be implemented soon'),
          'Manage app notifications',
        )}

        {renderSectionHeader('About')}
        {renderSettingItem(
          'information-outline',
          'About Book Finder',
          () => Alert.alert('About', 'Book Finder App v1.0'),
          'Version 1.0',
        )}

        {renderSettingItem(
          'help-circle-outline',
          'Help & Support',
          () => Alert.alert('Help', 'Help & support will be implemented soon'),
        )}

        {currentUser && (
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.error }]} 
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}

        {!currentUser && (
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.primary }]} 
            onPress={() => navigation.navigate('Login')}
          >
            <Icon name="login" size={20} color="white" />
            <Text style={styles.logoutText}>Log In</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;