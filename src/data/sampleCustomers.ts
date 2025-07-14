import { Customer } from '../types/Customer';

// Sadece 3 ülke için örnek müşteri verileri
export const sampleCustomers: Customer[] = [
  {
    id: 'TR-1001',
    code: 'TR-1001',
    name: 'Şükrü Özdemir',
    email: 'sukru.ozdemir@example.com',
    phone: '+90 532 123 4567',
    country: 'tr',
    city: 'İstanbul',
    district: 'Beşiktaş',
    status: 'active',
    party: 'Kurumsal',
    totalOrders: 18,
    lastOrder: '2023-05-28',
    lastLogin: '2023-06-01',
    workPhone: '+90 212 456 7890'
  },
  {
    id: 'RU-2002',
    code: 'RU-2002',
    name: 'Elena Petrova',
    email: 'elena.petrova@example.com',
    phone: '+7 903 123 4567',
    country: 'ru',
    city: 'İstanbul',
    district: 'Beyoğlu',
    status: 'active',
    party: 'Bireysel',
    totalOrders: 5,
    lastOrder: '2023-06-01',
    lastLogin: '2023-06-02'
  },
  {
    id: 'US-3003',
    code: 'US-3003',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1 415 555 6789',
    country: 'us',
    city: 'San Francisco',
    district: 'Mission District',
    status: 'active',
    party: 'Kurumsal',
    totalOrders: 12,
    lastOrder: '2023-05-25',
    lastLogin: '2023-05-30'
  }
];

export default sampleCustomers;
