import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dil dosyası - sadece Türkçe
import tr from './tr.json';

i18n
  // react-i18next modülünü başlat
  .use(initReactI18next)
  // i18next'i yapılandır
  .init({
    resources: {
      tr: { translation: tr }
    },
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false // React zaten XSS'e karşı güvenli
    }
  });

export default i18n;
