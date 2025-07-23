import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import tr from '../i18n/tr.json';

// Türkçe çeviri tipi
type TranslationType = { [key: string]: any };

// Context tipi - sadece Türkçe için
interface LanguageContextType {
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

// Sadece Türkçe dil desteği sağlayan provider
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const translations: TranslationType = tr;

  // Çeviri fonksiyonu
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
