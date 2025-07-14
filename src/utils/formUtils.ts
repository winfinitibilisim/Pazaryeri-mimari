/**
 * Form işlemleri için yardımcı fonksiyonlar
 */

/**
 * Form alanlarını doğrular
 * @param values Form değerleri
 * @param validationRules Doğrulama kuralları
 * @returns Hata mesajları
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationRules: Record<keyof T, ValidationRule[]>
): Record<keyof T, string> => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.entries(validationRules).forEach(([field, rules]) => {
    const fieldKey = field as keyof T;
    const value = values[fieldKey];

    for (const rule of rules) {
      if (rule.type === 'required' && !value) {
        errors[fieldKey] = rule.message || 'Bu alan zorunludur';
        break;
      }

      if (rule.type === 'email' && value && !isValidEmail(value as string)) {
        errors[fieldKey] = rule.message || 'Geçerli bir e-posta adresi giriniz';
        break;
      }

      if (rule.type === 'minLength' && value && (value as string).length < rule.value) {
        errors[fieldKey] = rule.message || `En az ${rule.value} karakter giriniz`;
        break;
      }

      if (rule.type === 'maxLength' && value && (value as string).length > rule.value) {
        errors[fieldKey] = rule.message || `En fazla ${rule.value} karakter giriniz`;
        break;
      }

      if (rule.type === 'pattern' && value && !new RegExp(rule.pattern).test(value as string)) {
        errors[fieldKey] = rule.message || 'Geçersiz format';
        break;
      }

      if (rule.type === 'custom' && rule.validator && !rule.validator(value)) {
        errors[fieldKey] = rule.message || 'Geçersiz değer';
        break;
      }
    }
  });

  return errors as Record<keyof T, string>;
};

/**
 * E-posta adresinin geçerli olup olmadığını kontrol eder
 * @param email E-posta adresi
 * @returns Geçerli mi?
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Telefon numarasının geçerli olup olmadığını kontrol eder
 * @param phone Telefon numarası
 * @returns Geçerli mi?
 */
export const isValidPhone = (phone: string): boolean => {
  // Boş değer kontrolü
  if (!phone) return false;
  
  // react-phone-input-2 kütüphanesi telefon numaralarını +90535... formatında döndürür
  // Telefon numarası en az bir ülke kodu (+) ve en az 8 rakam içermeli
  return phone.length >= 8;
};

/**
 * Vergi numarasının geçerli olup olmadığını kontrol eder
 * @param taxNumber Vergi numarası
 * @returns Geçerli mi?
 */
export const isValidTaxNumber = (taxNumber: string): boolean => {
  // Türkiye vergi numarası formatı: 10 haneli rakam
  const taxNumberRegex = /^[0-9]{10}$/;
  return taxNumberRegex.test(taxNumber);
};

/**
 * Form değerlerini temizler ve birleştirir
 * @param fields Form alanları tanımları
 * @param values Form değerleri
 * @returns Temizlenmiş ve birleştirilmiş değerler
 */
export const mergeFormValues = (fields: any[], values: Record<string, any>): Record<string, any> => {
  const cleanedValues: Record<string, any> = {};
  
  // Her alan için değeri temizle ve ekle
  fields.forEach(field => {
    const { name, type } = field;
    let value = values[name];
    
    // Değeri alan türüne göre dönüştür
    if (value !== undefined && value !== null) {
      switch (type) {
        case 'number':
          cleanedValues[name] = Number(value);
          break;
        case 'checkbox':
          cleanedValues[name] = Boolean(value);
          break;
        default:
          cleanedValues[name] = value;
      }
    }
  });
  
  return cleanedValues;
};

/**
 * Eski mergeFormValues fonksiyonu (geriye dönük uyumluluk için)
 */
export const mergeFormValuesOld = <T extends Record<string, any>>(
  values: Partial<T>,
  defaultValues: T
): T => {
  return { ...defaultValues, ...values };
};

/**
 * Form alanlarını sıfırlar
 * @param fields Form alanları tanımları
 * @param initialValues Başlangıç değerleri
 * @returns Sıfırlanmış form değerleri
 */
export const resetFormValues = (fields: any[], initialValues: Record<string, any> = {}): Record<string, any> => {
  const resetValues: Record<string, any> = {};
  
  // Her alan için varsayılan değeri veya başlangıç değerini kullan
  fields.forEach(field => {
    if (initialValues.hasOwnProperty(field.name)) {
      resetValues[field.name] = initialValues[field.name];
    } else if (field.defaultValue !== undefined) {
      resetValues[field.name] = field.defaultValue;
    } else {
      // Alan türüne göre boş değer ata
      switch (field.type) {
        case 'checkbox':
          resetValues[field.name] = false;
          break;
        case 'number':
          resetValues[field.name] = 0;
          break;
        default:
          resetValues[field.name] = '';
      }
    }
  });
  
  return resetValues;
};

/**
 * Eski resetForm fonksiyonu (geriye dönük uyumluluk için)
 */
export const resetForm = <T extends Record<string, any>>(
  defaultValues: T
): T => {
  return { ...defaultValues };
};

// Doğrulama kuralları tipleri
export type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; pattern: string; message?: string }
  | { type: 'custom'; validator: (value: any) => boolean; message?: string };

/**
 * Form alanını doğrular
 * @param field Form alanı tanımı
 * @param value Alan değeri
 * @returns Hata mesajı (hata yoksa boş string)
 */
export const validateField = (field: any, value: any): string => {
  const { required, validation, label } = field;
  
  // Boş değer kontrolü
  if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return `${label} alanı zorunludur`;
  }
  
  // Değer yoksa ve zorunlu değilse doğrulama yapma
  if (!value && !required) {
    return '';
  }
  
  // Regex pattern doğrulaması
  if (validation?.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
    return validation.message || `Geçersiz ${label} formatı`;
  }
  
  // Minimum değer/uzunluk doğrulaması
  if (validation?.min !== undefined) {
    if (typeof value === 'number' && value < validation.min) {
      return `${label} en az ${validation.min} olmalıdır`;
    }
    if (typeof value === 'string' && value.length < validation.min) {
      return `${label} en az ${validation.min} karakter olmalıdır`;
    }
  }
  
  // Maksimum değer/uzunluk doğrulaması
  if (validation?.max !== undefined) {
    if (typeof value === 'number' && value > validation.max) {
      return `${label} en fazla ${validation.max} olabilir`;
    }
    if (typeof value === 'string' && value.length > validation.max) {
      return `${label} en fazla ${validation.max} karakter olabilir`;
    }
  }
  
  // E-posta doğrulaması
  if (field.type === 'email' && value && !isValidEmail(value)) {
    return `Geçerli bir e-posta adresi giriniz`;
  }
  
  // Telefon doğrulaması
  if (field.type === 'tel' && value && !isValidPhone(value)) {
    return `Geçerli bir telefon numarası giriniz`;
  }
  
  return '';
};
