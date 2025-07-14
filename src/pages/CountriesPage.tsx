import React from 'react';
import ModularCountriesPage from './ModularCountriesPage';

/**
 * Ülkeler Sayfası Bileşeni
 * 
 * Bu bileşen, ModularCountriesPage bileşenini kullanarak ülke yönetimi işlevselliğini sağlar.
 * Modüler yapı sayesinde kod daha temiz, bakımı daha kolay ve componentler yeniden kullanılabilir hale gelmiştir.
 * 
 * Özellikler:
 * - Ülkelerin listelenmesi, filtrelenmesi ve sayfalanması
 * - Ülke ekleme, düzenleme ve silme işlemleri
 * - Ülke detaylarını görüntüleme (şehirler, ilçeler ve müşteri istatistikleri)
 * - Ülkelerin aktiflik durumunu değiştirme
 * - Varsayılan ülke ayarlama
 */
const CountriesPage: React.FC = () => {
  // ModularCountriesPage bileşenini döndür

  return <ModularCountriesPage />;
};

export default CountriesPage;
