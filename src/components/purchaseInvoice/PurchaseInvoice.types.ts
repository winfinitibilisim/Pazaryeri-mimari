export interface Supplier {
  id: string;
  name: string;
  taxId: string;
  address: string;
  email?: string;
  phone?: string;
  contactPerson?: string; // Tedarikçiye özel bir alan eklenebilir
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
  notes?: string;
  items: PurchaseInvoiceItem[];
  currency?: string;
  // Formda kullanılacak diğer alanlar eklenebilir
}

export interface PurchaseTotalsData {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}
