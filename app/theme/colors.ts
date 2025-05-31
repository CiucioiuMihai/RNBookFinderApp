import { ThemeType } from './ThemeContext';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryDark: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  divider: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  primary: "#fc5c65",
  primaryDark: '#d44955',
  accent: '#4ECDC4',
  text: '#000000',
  textSecondary: '#757575',
  border: '#E0E0E0',
  card: '#FFFFFF',
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  divider: '#EEEEEE',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: "#fc5c65",
  primaryDark: '#d44955',
  accent: '#4ECDC4',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2C2C2C',
  card: '#1E1E1E',
  error: '#CF6679',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  divider: '#2C2C2C',
};

export const getColors = (theme: ThemeType): ThemeColors => {
  return theme === 'light' ? lightColors : darkColors;
};