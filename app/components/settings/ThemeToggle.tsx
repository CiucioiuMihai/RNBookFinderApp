import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface ThemeToggleProps {
  label?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  label = "Dark Mode" 
}) => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor="#f4f3f4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  }
});

export default ThemeToggle;