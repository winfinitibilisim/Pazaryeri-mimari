/**
 * Veri işleme ve manipülasyonu için yardımcı fonksiyonlar
 */

/**
 * Verilen bir diziyi belirtilen anahtar değerine göre filtreler
 * @param data Filtrelenecek veri dizisi
 * @param searchValue Aranacak değer
 * @param searchKeys Arama yapılacak anahtarlar (opsiyonel, belirtilmezse tüm string alanlarında arama yapar)
 * @returns Filtrelenmiş veri dizisi
 */
export const filterData = <T extends Record<string, any>>(
  data: T[],
  searchValue: string,
  searchKeys?: (keyof T)[] | string[]
): T[] => {
  if (!searchValue) return data;
  
  return data.filter(item => {
    // Eğer arama anahtarları belirtilmişse, sadece o alanlarda ara
    if (searchKeys && searchKeys.length > 0) {
      return searchKeys.some(key => {
        const value = item[key as keyof T];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchValue.toLowerCase());
        } else if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(searchValue.toLowerCase());
        }
        return false;
      });
    }
    
    // Arama anahtarları belirtilmemişse, tüm string alanlarında ara
    return Object.keys(item).some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchValue.toLowerCase());
      }
      return false;
    });
  });
};

/**
 * Verilen bir diziyi belirtilen anahtar değerine göre sıralar
 * @param data Sıralanacak veri dizisi
 * @param sortKey Sıralama yapılacak anahtar
 * @param sortDirection Sıralama yönü ('asc' veya 'desc')
 * @returns Sıralanmış veri dizisi
 */
export const sortData = <T extends Record<string, any>>(
  data: T[],
  sortKey: keyof T,
  sortDirection: 'asc' | 'desc'
): T[] => {
  return [...data].sort((a, b) => {
    const valueA = a[sortKey];
    const valueB = b[sortKey];
    
    // Null değerleri en sona yerleştir
    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;
    
    // String karşılaştırma
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Sayısal karşılaştırma
    return sortDirection === 'asc' 
      ? (valueA > valueB ? 1 : -1) 
      : (valueB > valueA ? 1 : -1);
  });
};

/**
 * Verilen bir diziyi sayfalara böler
 * @param data Sayfalanacak veri dizisi
 * @param page Sayfa numarası (0'dan başlar)
 * @param rowsPerPage Sayfa başına gösterilecek satır sayısı
 * @returns Sayfalanmış veri dizisi
 */
export const paginateData = <T>(
  data: T[],
  page: number,
  rowsPerPage: number
): T[] => {
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
};

/**
 * Verilen bir nesneyi belirtilen anahtarlarla birleştirir
 * @param obj Birleştirilecek nesne
 * @param keys Birleştirilecek anahtarlar
 * @returns Birleştirilmiş string
 */
export const combineFields = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): string => {
  return keys
    .map(key => obj[key])
    .filter(value => value !== null && value !== undefined)
    .join(' ');
};

/**
 * Tarih formatını düzenler
 * @param dateString Tarih string'i
 * @param format Format türü ('short', 'medium', 'long')
 * @returns Formatlanmış tarih string'i
 */
export const formatDate = (
  dateString: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      break;
    case 'medium':
      options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      break;
    case 'long':
      options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      break;
    default:
      options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  }
  
  return new Intl.DateTimeFormat('tr-TR', options).format(date);
};
