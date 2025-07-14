// Ortak tipler ve yardımcı fonksiyonlar
export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  address: string;
  email?: string;
  phone?: string;
  contactPerson?: string; // Tedarikçiye özel bir alan
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // Bu, alış fiyatı olacak
  taxRate: number;
}

export interface PurchaseInvoiceItem {
  id?: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string; // Birim (örn: Adet, Kg, Metre)
  unitPrice: number; // Alış birim fiyatı
  taxRate: number;
  discount: number; // Alınan indirim
}

export interface PurchaseInvoiceData {
  id?: string;
  invoiceNumber: string; // Alış Fatura Numarası
  supplierId: string;    // Tedarikçi ID'si
  invoiceDate: string | Date; // Fatura Tarihi
  dueDate?: string | Date;   // Vade Tarihi (Alış faturalarında opsiyonel olabilir)
  receivedDate?: string | Date; // Mal/Hizmet Alım Tarihi
  status: string;          // Örn: 'received', 'pending_payment', 'paid', 'cancelled'
  paymentMethod?: string;
  paymentTerms?: string; // Ödeme Koşulları
  shippingAddress?: string; // Teslimat Adresi (Eğer varsa)
  notes?: string;
  attachments?: File[]; // Fatura ekleri
  items: PurchaseInvoiceItem[];
  currency?: string; // Para birimi
}

export interface LocalPurchaseInvoiceData extends Omit<PurchaseInvoiceData, 'id'> {
  id: string;
  supplierName: string;
  totalAmount: number;
}

export interface PurchaseInvoiceFormValues {
  invoiceNumber: string;
  supplierId: string;
  invoiceDate: Date | null;
  dueDate?: Date | null;
  receivedDate?: Date | null;
  status: string;
  paymentMethod?: string;
  paymentTerms?: string;
  shippingAddress?: string;
  notes?: string;
  items: PurchaseInvoiceItem[];
  currency?: string;
}

export interface PurchaseTotalsData {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

// Yardımcı fonksiyonlar
export const formatCurrency = (amount: number, currency: string = 'TRY'): string => {
  const localeMap: Record<string, string> = {
    'TRY': 'tr-TR',
    'USD': 'en-US',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'CNY': 'zh-CN',
    'RUB': 'ru-RU',
    'SAR': 'ar-SA',
    'AED': 'ar-AE'
  };
  
  const locale = localeMap[currency] || 'tr-TR';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const calculateItemTotal = (item: PurchaseInvoiceItem): number => {
  const subtotal = item.quantity * item.unitPrice;
  const discountAmount = subtotal * (item.discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (item.taxRate / 100);
  return afterDiscount + taxAmount;
};

export const calculateTotals = (items: PurchaseInvoiceItem[] | undefined): PurchaseTotalsData => {
  if (!items || items.length === 0) {
    return {
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0
    };
  }

  let subtotal = 0;
  let taxAmount = 0;
  let discountAmount = 0;

  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unitPrice;
    subtotal += itemSubtotal;
    
    const itemDiscountAmount = itemSubtotal * (item.discount / 100);
    discountAmount += itemDiscountAmount;
    
    const afterDiscount = itemSubtotal - itemDiscountAmount;
    const itemTaxAmount = afterDiscount * (item.taxRate / 100);
    taxAmount += itemTaxAmount;
  });

  const total = subtotal - discountAmount + taxAmount;

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total
  };
};

// Mock veri
export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'ABC Tedarik Ltd.', taxId: '1234567890', address: 'İstanbul, Türkiye', contactPerson: 'Ahmet Yılmaz' },
  { id: '2', name: 'XYZ Toptan A.Ş.', taxId: '0987654321', address: 'Ankara, Türkiye', contactPerson: 'Mehmet Kaya' },
  { id: '3', name: 'Global İthalat Ltd.', taxId: '5678901234', address: 'İzmir, Türkiye', contactPerson: 'Ayşe Demir' }
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Laptop', sku: 'LPT-001', category: 'Elektronik', price: 8000, taxRate: 18 },
  { id: '2', name: 'Ofis Kağıdı', sku: 'STN-001', category: 'Kırtasiye', price: 120, taxRate: 8 },
  { id: '3', name: 'Yazıcı', sku: 'PRN-001', category: 'Elektronik', price: 1500, taxRate: 18 }
];
