import { RouteObject } from 'react-router-dom';

// Konum yönetimi için rotalar
export const locationRoutes: RouteObject[] = [
    
  {
    path: "/countries",
    // React Router v6 ile element kullanılıyor, component değil
    // Bu rotalar App.tsx içinde kullanılıyor
  },
  {
    path: "/cities/:countryId",
  },
  {
    path: "/districts/:cityId",
  }
];

// Sayfa başlıkları için kullanılabilecek sabitler
export const locationTitles = {
  countries: "Ülkeler",
  cities: "Şehirler",
  districts: "İlçeler"
};
