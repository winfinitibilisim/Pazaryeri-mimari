import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import tr from '../i18n/tr.json';
import en from '../i18n/en.json';


// Use the type of tr.json directly for strong typing. This is robust.
// All other language files should conform to this structure.
type TranslationType = { [key: string]: any };

// Define the shape of the context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
    t: (key: string, options?: { [key: string]: string | number }) => string;
  translations: TranslationType;
}

// Create the context with a default value. This will be replaced by the provider.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to use the language context, ensures it's used within a provider.
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider component props
interface LanguageProviderProps {
  children: ReactNode;
}

// The provider component that wraps the app
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'tr');

  const [translations, setTranslations] = useState<TranslationType>(() => {
    const savedLanguage = localStorage.getItem('language') || 'tr';
    switch (savedLanguage) {
      case 'en': return en as TranslationType;
      default: return tr as TranslationType;
    }
  });

  // Effect to handle side-effects when language changes
  useEffect(() => {
    // Set document direction
    document.documentElement.dir = 'ltr';

    // Load new translations
    switch (language) {
      case 'en': setTranslations(en as TranslationType); break;
      default: setTranslations(tr as TranslationType);
    }
  }, [language]);

  // Function to change the application's language
  const setLanguage = useCallback((lang: string) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  }, []);

  // The translation function 't'
  const t = useCallback((key: string, options?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    if (typeof result === 'string' && options) {
      let translatedString = result;
      for (const [optKey, optValue] of Object.entries(options)) {
        translatedString = translatedString.replace(`{{${optKey}}}`, String(optValue));
      }
      return translatedString;
    }

    return typeof result === 'string' ? result : key;
  }, [translations]);

  const value = {
    language,
    setLanguage,
    isRTL: false,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
