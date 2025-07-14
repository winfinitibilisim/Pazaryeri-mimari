// Müşteri tipi tanımı
export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  district?: string;
  status: string;
  bakiye?: number;
  balance?: number;
  cart?: number;
  orders?: number;
  sepet?: number;
  siparisler?: number;
  totalOrders?: number;
  workPhone?: string;
  lastOrder: string;
  lastLogin?: string;
  party?: string;
}
