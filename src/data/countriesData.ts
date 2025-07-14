import { Country, City, District, ContinentOption } from '../types/Country';

export const continentOptions: ContinentOption[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'europe', label: 'Avrupa' },
  { value: 'asia', label: 'Asya' },
  { value: 'africa', label: 'Afrika' },
  { value: 'north-america', label: 'Kuzey Amerika' },
  { value: 'south-america', label: 'Güney Amerika' },
  { value: 'australia', label: 'Avustralya' },
  { value: 'antarctica', label: 'Antarktika' }
];

export const countriesData: Country[] = [
  {
    id: 1,
    name: 'Türkiye',
    code: 'TR',
    capital: 'Ankara',
    population: 84339067,
    continent: 'asia',
    isActive: true,
    isDefault: true,
    customerCount: 5420,
    vatAmount: 1250.75,
    cities: [
      {
        id: 1,
        name: 'İstanbul',
        population: 15462452,
        customerCount: 2150,
        districts: [
          { id: 1, name: 'Kadıköy', population: 458638, customerCount: 580 },
          { id: 2, name: 'Beşiktaş', population: 181074, customerCount: 420 },
          { id: 3, name: 'Üsküdar', population: 529550, customerCount: 350 }
        ]
      },
      {
        id: 2,
        name: 'Ankara',
        population: 5663322,
        customerCount: 1250,
        districts: [
          { id: 4, name: 'Çankaya', population: 920890, customerCount: 480 },
          { id: 5, name: 'Keçiören', population: 909787, customerCount: 320 },
          { id: 6, name: 'Yenimahalle', population: 663580, customerCount: 250 }
        ]
      },
      {
        id: 3,
        name: 'İzmir',
        population: 4367251,
        customerCount: 980,
        districts: [
          { id: 7, name: 'Konak', population: 346103, customerCount: 280 },
          { id: 8, name: 'Karşıyaka', population: 342062, customerCount: 240 },
          { id: 9, name: 'Bornova', population: 445232, customerCount: 210 }
        ]
      },
      {
        id: 4,
        name: 'Bursa',
        population: 3101833,
        customerCount: 850,
        districts: [
          { id: 10, name: 'Nilüfer', population: 465956, customerCount: 320 },
          { id: 11, name: 'Osmangazi', population: 879790, customerCount: 530 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Almanya',
    code: 'DE',
    capital: 'Berlin',
    population: 83190556,
    continent: 'europe',
    isActive: true,
    isDefault: false,
    customerCount: 3250,
    vatAmount: 980.50,
    cities: [
      {
        id: 4,
        name: 'Berlin',
        population: 3664088,
        customerCount: 1450,
        districts: [
          { id: 10, name: 'Mitte', population: 385748, customerCount: 520 },
          { id: 11, name: 'Kreuzberg', population: 284678, customerCount: 430 },
          { id: 12, name: 'Charlottenburg', population: 342344, customerCount: 350 }
        ]
      },
      {
        id: 5,
        name: 'Münih',
        population: 1484226,
        customerCount: 980,
        districts: [
          { id: 13, name: 'Altstadt', population: 21892, customerCount: 280 },
          { id: 14, name: 'Schwabing', population: 78088, customerCount: 350 },
          { id: 15, name: 'Bogenhausen', population: 85058, customerCount: 210 }
        ]
      },
      {
        id: 6,
        name: 'Hamburg',
        population: 1841179,
        customerCount: 820,
        districts: [
          { id: 16, name: 'Altona', population: 270263, customerCount: 310 },
          { id: 17, name: 'St. Pauli', population: 22000, customerCount: 210 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Fransa',
    code: 'FR',
    capital: 'Paris',
    population: 67413000,
    continent: 'europe',
    isActive: true,
    isDefault: false,
    customerCount: 2840,
    vatAmount: 760.20,
    cities: [
      {
        id: 6,
        name: 'Paris',
        population: 2161000,
        customerCount: 1320,
        districts: [
          { id: 16, name: 'Montmartre', population: 186000, customerCount: 450 },
          { id: 17, name: 'Le Marais', population: 150000, customerCount: 380 },
          { id: 18, name: 'Quartier Latin', population: 170000, customerCount: 290 }
        ]
      },
      {
        id: 7,
        name: 'Lyon',
        population: 516092,
        customerCount: 850,
        districts: [
          { id: 19, name: 'Presqu\'île', population: 98000, customerCount: 320 },
          { id: 20, name: 'Croix-Rousse', population: 85000, customerCount: 280 },
          { id: 21, name: 'Vieux Lyon', population: 65000, customerCount: 150 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'İtalya',
    code: 'IT',
    capital: 'Roma',
    population: 60317116,
    continent: 'europe',
    isActive: true,
    isDefault: false,
    customerCount: 2150,
    vatAmount: 650.00,
    cities: [
      {
        id: 8,
        name: 'Roma',
        population: 2873000,
        customerCount: 980,
        districts: [
          { id: 22, name: 'Centro Storico', population: 185000, customerCount: 380 },
          { id: 23, name: 'Trastevere', population: 120000, customerCount: 320 },
          { id: 24, name: 'Testaccio', population: 75000, customerCount: 180 }
        ]
      },
      {
        id: 9,
        name: 'Milano',
        population: 1396059,
        customerCount: 780,
        districts: [
          { id: 25, name: 'Brera', population: 95000, customerCount: 280 },
          { id: 26, name: 'Navigli', population: 88000, customerCount: 240 },
          { id: 27, name: 'Isola', population: 72000, customerCount: 160 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'İspanya',
    code: 'ES',
    capital: 'Madrid',
    population: 47351567,
    continent: 'europe',
    isActive: false,
    isDefault: false,
    customerCount: 1980,
    vatAmount: 550.90,
    cities: [
      {
        id: 10,
        name: 'Madrid',
        population: 3223000,
        customerCount: 920,
        districts: [
          { id: 28, name: 'Sol', population: 125000, customerCount: 350 },
          { id: 29, name: 'Malasaña', population: 95000, customerCount: 280 },
          { id: 30, name: 'Salamanca', population: 145000, customerCount: 190 }
        ]
      },
      {
        id: 11,
        name: 'Barselona',
        population: 1620000,
        customerCount: 860,
        districts: [
          { id: 31, name: 'El Raval', population: 47000, customerCount: 320 },
          { id: 32, name: 'Gràcia', population: 120000, customerCount: 290 },
          { id: 33, name: 'Eixample', population: 267000, customerCount: 150 }
        ]
      },
      {
        id: 12,
        name: 'Valencia',
        population: 791413,
        customerCount: 650,
        districts: [
          { id: 34, name: 'Ciutat Vella', population: 26769, customerCount: 220 },
          { id: 35, name: 'L\'Eixample', population: 42180, customerCount: 180 },
          { id: 36, name: 'El Cabanyal', population: 20156, customerCount: 150 }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Birleşik Krallık',
    code: 'GB',
    capital: 'Londra',
    population: 67886011,
    continent: 'europe',
    isActive: true,
    isDefault: false,
    customerCount: 2750,
    vatAmount: 880.60,
    cities: [
      {
        id: 12,
        name: 'Londra',
        population: 8982000,
        customerCount: 1450,
        districts: [
          { id: 34, name: 'Westminster', population: 261000, customerCount: 520 },
          { id: 35, name: 'Camden', population: 270000, customerCount: 480 },
          { id: 36, name: 'Kensington', population: 156000, customerCount: 350 }
        ]
      },
      {
        id: 13,
        name: 'Manchester',
        population: 547627,
        customerCount: 780,
        districts: [
          { id: 37, name: 'Northern Quarter', population: 85000, customerCount: 320 },
          { id: 38, name: 'Ancoats', population: 65000, customerCount: 260 },
          { id: 39, name: 'Castlefield', population: 55000, customerCount: 140 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'ABD',
    code: 'US',
    capital: 'Washington D.C.',
    population: 331002651,
    continent: 'north-america',
    isActive: true,
    isDefault: false,
    customerCount: 4850,
    vatAmount: 1520.25,
    cities: [
      {
        id: 14,
        name: 'New York',
        population: 8336817,
        customerCount: 2150,
        districts: [
          { id: 40, name: 'Manhattan', population: 1628706, customerCount: 980 },
          { id: 41, name: 'Brooklyn', population: 2559903, customerCount: 750 },
          { id: 42, name: 'Queens', population: 2253858, customerCount: 420 }
        ]
      },
      {
        id: 15,
        name: 'Los Angeles',
        population: 3979576,
        customerCount: 1680,
        districts: [
          { id: 43, name: 'Hollywood', population: 85489, customerCount: 680 },
          { id: 44, name: 'Venice', population: 40885, customerCount: 520 },
          { id: 45, name: 'Downtown', population: 85000, customerCount: 380 }
        ]
      }
    ]
  },
  {
    id: 8,
    name: 'Kanada',
    code: 'CA',
    capital: 'Ottawa',
    population: 38005238,
    continent: 'north-america',
    isActive: false,
    isDefault: false,
    customerCount: 1850,
    vatAmount: 490.70,
    cities: [
      {
        id: 16,
        name: 'Toronto',
        population: 2930000,
        customerCount: 980,
        districts: [
          { id: 46, name: 'Downtown', population: 240000, customerCount: 420 },
          { id: 47, name: 'Yorkville', population: 85000, customerCount: 320 },
          { id: 48, name: 'Kensington Market', population: 65000, customerCount: 180 }
        ]
      },
      {
        id: 17,
        name: 'Vancouver',
        population: 675218,
        customerCount: 680,
        districts: [
          { id: 49, name: 'Gastown', population: 45000, customerCount: 280 },
          { id: 50, name: 'Yaletown', population: 38000, customerCount: 220 },
          { id: 51, name: 'Kitsilano', population: 42000, customerCount: 140 }
        ]
      }
    ]
  },
  {
    id: 9,
    name: 'Japonya',
    code: 'JP',
    capital: 'Tokyo',
    population: 126476461,
    continent: 'asia',
    isActive: true,
    isDefault: false,
    customerCount: 2350,
    vatAmount: 710.00,
    cities: [
      {
        id: 18,
        name: 'Tokyo',
        population: 13960000,
        customerCount: 1250,
        districts: [
          { id: 52, name: 'Shibuya', population: 221801, customerCount: 480 },
          { id: 53, name: 'Shinjuku', population: 346235, customerCount: 420 },
          { id: 54, name: 'Ginza', population: 150000, customerCount: 280 }
        ]
      },
      {
        id: 19,
        name: 'Osaka',
        population: 2691742,
        customerCount: 780,
        districts: [
          { id: 55, name: 'Umeda', population: 180000, customerCount: 320 },
          { id: 56, name: 'Namba', population: 165000, customerCount: 260 },
          { id: 57, name: 'Tennoji', population: 145000, customerCount: 180 }
        ]
      }
    ]
  },
  {
    id: 10,
    name: 'Çin',
    code: 'CN',
    capital: 'Pekin',
    population: 1444216107,
    continent: 'asia',
    isActive: true,
    isDefault: false,
    customerCount: 3150,
    vatAmount: 930.40,
    cities: [
      {
        id: 20,
        name: 'Şangay',
        population: 26320000,
        customerCount: 1450,
        districts: [
          { id: 58, name: 'Pudong', population: 5500000, customerCount: 580 },
          { id: 59, name: 'Jing\'an', population: 1050000, customerCount: 480 },
          { id: 60, name: 'Huangpu', population: 678670, customerCount: 320 }
        ]
      },
      {
        id: 21,
        name: 'Pekin',
        population: 21540000,
        customerCount: 1080,
        districts: [
          { id: 61, name: 'Chaoyang', population: 3545000, customerCount: 450 },
          { id: 62, name: 'Haidian', population: 3280000, customerCount: 380 },
          { id: 63, name: 'Dongcheng', population: 919000, customerCount: 250 }
        ]
      }
    ]
  }
];

// Ülke adına göre ülke bul
export const findCountryByName = (name: string): Country | undefined => {
  return countriesData.find(country => country.name === name);
};

// Ülke ID'sine göre ülke bul
export const findCountryById = (id: number): Country | undefined => {
  return countriesData.find(country => country.id === id);
};

// Şehir ID'sine göre şehir bul
export const findCityById = (cityId: number): { country: Country, city: City } | undefined => {
  for (const country of countriesData) {
    const city = country.cities.find(city => city.id === cityId);
    if (city) {
      return { country, city };
    }
  }
  return undefined;
};

// İlçe ID'sine göre ilçe bul
export const findDistrictById = (districtId: number): { country: Country, city: City, district: District } | undefined => {
  for (const country of countriesData) {
    for (const city of country.cities) {
      const district = city.districts.find(district => district.id === districtId);
      if (district) {
        return { country, city, district };
      }
    }
  }
  return undefined;
};

// Kıta adına göre kıta etiketi bul
export const getContinentLabel = (continentValue: string): string => {
  const continent = continentOptions.find(c => c.value === continentValue);
  return continent ? continent.label : continentValue;
};
