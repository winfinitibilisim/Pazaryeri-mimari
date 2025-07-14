/**
 * Tema Sağlayıcı Bileşeni
 * 
 * Bu bileşen, uygulamadaki tüm bileşenlerin kullanacağı temayı sağlar.
 * Açık/koyu tema değiştirme özelliği ve tema tercihi saklama özelliği içerir.
 */

import React, { ReactNode, createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import colors from './colors';

// Tema tercihi için localStorage anahtarı
const THEME_MODE_KEY = 'theme-mode';

// Tema bağlamı tipi
interface ThemeContextType {
  mode: PaletteMode;
  toggleThemeMode: () => void;
}

// Tema bağlamı oluştur
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleThemeMode: () => {},
});

// Tema bağlamını kullanmak için hook
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Tema Sağlayıcı Bileşeni
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Tema modu durumu (açık/koyu)
  const [mode, setMode] = useState<PaletteMode>(() => {
    // localStorage'dan tema tercihini al
    const savedMode = localStorage.getItem(THEME_MODE_KEY) as PaletteMode | null;
    return savedMode || 'light';
  });

  // Tema modunu değiştirme fonksiyonu
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Tema modu değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode]);

  // Mevcut temayı seçilen moda göre özelleştir
  const currentTheme = useMemo(() => {
    // Koyu tema için özel ayarlar
    if (mode === 'dark') {
      return createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: 'dark',
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
        },
      });
    }
    
    // Varsayılan tema (açık)
    return theme;
  }, [mode]);

  // Tema bağlam değerleri
  const themeContextValue = useMemo(() => {
    return { mode, toggleThemeMode };
  }, [mode]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 