import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyaları
import tr from './tr.json';
import en from './en.json';




// Kaydedilmiş dil tercihini al
const savedLanguage = localStorage.getItem('language') || 'tr';

i18n
  // Dil algılama modülünü kullan
  .use(LanguageDetector)
  // react-i18next modülünü başlat
  .use(initReactI18next)
  // i18next'i yapılandır
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false // React zaten XSS'e karşı güvenli
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
