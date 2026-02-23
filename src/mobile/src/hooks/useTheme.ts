// src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme';

const THEME_KEY = '@biddt_theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored) {
          const isDarkMode = stored === 'dark';
          setIsDark(isDarkMode);
          setTheme(isDarkMode ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setTheme(newIsDark ? darkTheme : lightTheme);
    
    try {
      await AsyncStorage.setItem(THEME_KEY, newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [isDark]);

  const setDarkMode = useCallback(async (dark: boolean) => {
    setIsDark(dark);
    setTheme(dark ? darkTheme : lightTheme);
    
    try {
      await AsyncStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  return {
    theme,
    isDark,
    loading,
    toggleTheme,
    setDarkMode,
    colors: theme.colors,
  };
};
