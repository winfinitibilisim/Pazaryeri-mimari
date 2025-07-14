export interface District {
  id: number;
  name: string;
  population: number;
  customerCount: number;
  countryId?: number; // İlçenin bağlı olduğu ülke ID'si
  cityId?: number; // İlçenin bağlı olduğu şehir ID'si
}

export interface City {
  id: number;
  name: string;
  population: number;
  customerCount: number;
  districts: District[];
  countryId?: number; // Şehrin bağlı olduğu ülke ID'si
}

export interface Country {
  id: number;
  name: string;
  code: string;
  capital: string;
  population: number;
  continent: string;
  isActive: boolean;
  isDefault: boolean;
  customerCount: number;
  vatAmount: number; // KDV Tutarı eklendi
  cities: City[];
}

export type ContinentType = 'europe' | 'asia' | 'africa' | 'north-america' | 'south-america' | 'australia' | 'antarctica' | 'all';

export interface ContinentOption {
  value: ContinentType;
  label: string;
}
