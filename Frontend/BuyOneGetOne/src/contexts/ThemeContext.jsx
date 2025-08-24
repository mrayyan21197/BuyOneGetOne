import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEME_OPTIONS } from '../constants';

// Theme context
const ThemeContext = createContext(null);

// Theme provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(THEME_OPTIONS.SYSTEM);

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || THEME_OPTIONS.SYSTEM;
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    if (newTheme === THEME_OPTIONS.SYSTEM) {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      // Use selected theme
      root.classList.add(newTheme);
    }
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === THEME_OPTIONS.LIGHT ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    setThemeMode(newTheme);
  };

  const value = {
    theme,
    setTheme: setThemeMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}