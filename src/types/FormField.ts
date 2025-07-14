// Form alanları için tip tanımları

// Doğrulama kuralları için arayüz
export interface ValidationRule {
  pattern: RegExp;
  message: string;
}

// Önceden tanımlanmış doğrulama kalıpları
export const ValidationPatterns = {
  // E-posta doğrulama - @ işareti içermeli
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Geçerli bir e-posta adresi giriniz'
  },
  // Telefon numarası doğrulama - sadece rakamlar, en az 10 karakter
  PHONE: {
    pattern: /^[0-9]{10,}$/,
    message: 'Geçerli bir telefon numarası giriniz (en az 10 rakam)'
  },
  // IBAN doğrulama - TR ile başlayan 26 karakter
  IBAN: {
    pattern: /^TR[0-9]{24}$/,
    message: 'Geçerli bir IBAN numarası giriniz (TR ile başlayan 26 karakter)'
  },
  // TC Kimlik No doğrulama - 11 rakam
  TC_ID: {
    pattern: /^[0-9]{11}$/,
    message: 'Geçerli bir TC Kimlik numarası giriniz (11 rakam)'
  },
  // Vergi No doğrulama - 10 rakam
  TAX_ID: {
    pattern: /^[0-9]{10}$/,
    message: 'Geçerli bir Vergi numarası giriniz (10 rakam)'
  }
};

export interface FormField {
  section?: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  helperText?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  defaultValue?: any;
  // Doğrulama kuralları
  validation?: ValidationRule;
  // Ülke kodu seçici için (telefon numaraları)
  useCountryCode?: boolean;
  // Grid özellikleri (Material UI Grid bileşeni için)
  gridProps?: {
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
  };
}
