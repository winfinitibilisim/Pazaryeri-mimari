/**
 * Merkezi Tema Konfigürasyonu
 * 
 * Bu dosya, uygulamadaki tüm bileşenlerin kullanacağı tema ayarlarını içerir.
 * Renk paleti, tipografi, bileşen stilleri ve diğer tema ayarları burada merkezi olarak yönetilir.
 */

import { createTheme, Theme, responsiveFontSizes } from '@mui/material/styles';
import { PaletteOptions } from '@mui/material/styles/createPalette';
import colors from './colors';
import { orange, red } from '@mui/material/colors';

/**
 * Renk paleti konfigürasyonu
 */
const palette: PaletteOptions = {
  primary: {
    main: colors.primary,
    light: colors.primaryLight,
    dark: colors.primaryDark,
    contrastText: colors.white,
  },
  secondary: {
    main: colors.secondary,
    light: colors.secondaryLight,
    dark: colors.secondaryDark,
    contrastText: colors.white,
  },
  error: {
    main: colors.error,
    contrastText: colors.white,
  },
  warning: {
    main: colors.warning,
    contrastText: colors.white,
  },
  info: {
    main: colors.info,
    contrastText: colors.white,
  },
  success: {
    main: colors.success,
    contrastText: colors.white,
  },
  background: colors.background,
  text: colors.text,
  grey: {
    100: colors.grey100,
    200: colors.grey200,
    300: colors.grey300,
    400: colors.grey400,
    500: colors.grey500,
    700: colors.grey700,
    900: colors.grey900,
  },
};

/**
 * Tipografi konfigürasyonu
 */
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0.00735em',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none' as 'none',
  },
};

/**
 * Tema oluştur
 */
let theme: Theme = createTheme({
  palette,
  typography,
  /**
   * Bileşen stil özelleştirmeleri
   */
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.secondary,
            color: colors.white,
          },
        },
      },
    },
    // Buton özelleştirmeleri
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: colors.primary,
          color: colors.white,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: colors.primaryDark,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: colors.primary,
          color: colors.primary,
          '&:hover': {
            borderWidth: 1.5,
            borderColor: colors.primaryDark,
            backgroundColor: 'rgba(37, 99, 143, 0.04)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '0.9375rem',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    
    // Kâğıt (Paper) özelleştirmeleri
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
        outlined: {
          borderColor: colors.grey300,
        },
      },
    },
    
    // Radio buton özelleştirmeleri
    MuiRadio: {
      styleOverrides: {
        root: {
          color: red[400], // Pasif durumda kırmızı
          '&.Mui-checked': {
            color: orange[500], // Aktif durumda turuncu
          },
        },
      },
    },
    
    // Kart özelleştirmeleri
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      },
    },
    
    // Form alanı özelleştirmeleri
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: colors.grey300,
            },
            '&:hover fieldset': {
              borderColor: colors.grey500,
            },
          },
        },
      },
    },
    
    // Diyalog özelleştirmeleri
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    
    // Tablo özelleştirmeleri
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderColor: colors.grey200,
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.grey100,
        },
      },
    },
    
    // Sekme özelleştirmeleri
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 'auto',
          padding: '12px 16px',
        },
      },
    },
  },
  
  /**
   * Genel tema özellikleri
   */
  shape: {
    borderRadius: 8,
  },
  
  /**
   * Gölge stilleri
   * Material-UI tam olarak 25 gölge seviyesi bekliyor
   */
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 6px 12px rgba(0, 0, 0, 0.12)',
    '0px 8px 16px rgba(0, 0, 0, 0.14)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
    '0px 10px 20px rgba(0, 0, 0, 0.16)',
  ],
});

// Responsive font size ayarlarını uygula
theme = responsiveFontSizes(theme);

export type AppTheme = Theme;
export default theme;