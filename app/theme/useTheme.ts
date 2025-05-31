import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { getColors, ThemeColors } from './colors';
import { createThemedStyles } from './styles';

export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const colors = getColors(theme);
  const styles = createThemedStyles(colors);
  
  return {
    theme,
    colors,
    styles,
    toggleTheme,
    isDark: theme === 'dark'
  };
};