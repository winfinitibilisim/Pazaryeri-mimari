/**
 * UI işlemleri için yardımcı fonksiyonlar
 */
import { Theme } from '@mui/material/styles';

/**
 * Ekran boyutuna göre responsive değer döndürür
 * @param theme MUI tema
 * @param mobileValue Mobil için değer
 * @param tabletValue Tablet için değer
 * @param desktopValue Masaüstü için değer
 * @returns Ekran boyutuna göre değer
 */
export const responsiveValue = <T>(
  theme: Theme,
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T => {
  const isMobile = theme.breakpoints.down('sm');
  const isTablet = theme.breakpoints.between('sm', 'md');
  
  if (isMobile) return mobileValue;
  if (isTablet) return tabletValue;
  return desktopValue;
};

/**
 * Renk tonu oluşturur (açık/koyu)
 * @param color Ana renk (hex)
 * @param amount Açıklık/koyuluk miktarı (-1 ile 1 arasında)
 * @returns Yeni renk tonu
 */
export const createColorShade = (color: string, amount: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  // Açıklık/koyuluk ekle
  R = Math.min(255, Math.max(0, R + amount * 255));
  G = Math.min(255, Math.max(0, G + amount * 255));
  B = Math.min(255, Math.max(0, B + amount * 255));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
};

/**
 * Durum rengini döndürür
 * @param status Durum ('active', 'pending', 'inactive', 'error')
 * @returns Renk kodu
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: '#4caf50',    // Yeşil
    pending: '#ff9800',   // Turuncu
    inactive: '#9e9e9e',  // Gri
    error: '#f44336',     // Kırmızı
    success: '#4caf50',   // Yeşil
    warning: '#ff9800',   // Turuncu
    info: '#2196f3',      // Mavi
  };
  
  return statusColors[status.toLowerCase()] || '#9e9e9e';
};

/**
 * Truncate text to a specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Dosya boyutunu formatlar
 * @param bytes Bayt cinsinden boyut
 * @param decimals Ondalık basamak sayısı
 * @returns Formatlanmış dosya boyutu
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Para birimini formatlar
 * @param amount Miktar
 * @param currency Para birimi
 * @returns Formatlanmış para birimi
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'TRY'
): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
