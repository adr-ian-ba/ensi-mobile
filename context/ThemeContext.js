import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const themes = {
    light: {
      background: 'white',
      text: 'black',
      primary: '#a688c2',
      shadow: 'rgba(0, 0, 0, 0.2)',
      gray:"gray"
    },
    dark: {
      background: '#1B1A1A',
      text: 'white',
      primary: '#faca38',
      shadow: 'rgba(255, 255, 255, 0.2)',
      gray:"#D1D0D0"
    },
  };

  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const currentThemeStyles = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme: currentThemeStyles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
