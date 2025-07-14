// data/mockData.ts

// ====================================
// INTERFACES
// ====================================

export interface InvoiceItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number;
  description?: string;
  discountRate?: number;
  discountIsPercentage?: boolean;
  sctRate?: number;
  sctIsPercentage?: boolean;
  sct2Rate?: number;
  sct2IsPercentage?: boolean;
  accommodationTaxRate?: number;
  vatExemption?: {
    reason: string;
  };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate: string;
  vat: number;
  amount: number;
  status: 'Ödendi' | 'Beklemede' | 'Gecikti' | 'İade Edildi';
  items: InvoiceItem[];
  notes?: string;
}

export interface Supplier {
  id: number;
  name: string;
  code: string;
  label: string;
  address: string;
  taxOffice: string;
  taxId: string;
  email: string;
}

export interface Transaction {
  id: string;
  customerCode: string;
  date: string;
  receiptNo: string;
  type: 'Giriş' | 'Çıkış';
  description: string;
  amount: number;
  balance: number;
  status: 'Borcu Var' | 'Alacağı Var';
  currency: 'TRY' | 'USD' | 'EUR';
  details?: any; // Consider defining a more specific type if the structure is consistent
  totals?: any; // Consider defining a more specific type if the structure is consistent
}

export interface Customer {
  id: number;
  name: string;
  code: string;
  label: string;
  address: string;
  taxOffice: string;
  taxId: string;
  email: string;
}

// ====================================
// MOCK DATA
// ====================================

export const mockCustomers: Customer[] = [
  { id: 1, name: 'Ahmet Yılmaz', code: 'C001', label: 'Ahmet Yılmaz', address: 'Örnek Mah. Test Cad. No:1 D:2, İstanbul', taxOffice: 'Maslak', taxId: '1234567890', email: 'ahmet.yilmaz@example.com' },
  { id: 2, name: 'Teknoloji A.Ş.', code: 'C002', label: 'Teknoloji A.Ş.', address: 'Bilim Sok. Tekno Park No: 5, Ankara', taxOffice: 'Çankaya', taxId: '0987654321', email: 'iletisim@teknoloji.as' },
  { id: 3, name: 'Ayşe Kaya', code: 'C003', label: 'Ayşe Kaya', address: 'Lale Sok. No: 15, İzmir', taxOffice: 'Konak', taxId: '1122334455', email: 'ayse.kaya@example.com' },
  { id: 4, name: 'Global Lojistik', code: 'C004', label: 'Global Lojistik', address: 'Sanayi Mah. Depo Cad. No: 8, Kocaeli', taxOffice: 'Gebze', taxId: '5566778899', email: 'info@globallojistik.com' },
  { id: 5, name: 'Mehmet Öztürk', code: 'C005', label: 'Mehmet Öztürk', address: 'Atatürk Blv. No: 100, Bursa', taxOffice: 'Osmangazi', taxId: '9988776655', email: 'mehmet.ozturk@example.com' },
];

export const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Ana Tedarikçi Ltd.', code: 'S001', label: 'Ana Tedarikçi Ltd.', address: 'Tedarik Mah. Depo Cad. No:1, İstanbul', taxOffice: 'Büyük Mükellefler', taxId: '1112223334', email: 'info@anatedarikci.com' },
  { id: 2, name: 'Hammadde A.Ş.', code: 'S002', label: 'Hammadde A.Ş.', address: 'Organize Sanayi Bölgesi No: 15, Bursa', taxOffice: 'Nilüfer', taxId: '4445556667', email: 'siparis@hammadde.as' },
  { id: 3, name: 'Lojistik Partneri', code: 'S003', label: 'Lojistik Partneri', address: 'Liman Yolu. No: 8, İzmir', taxOffice: 'Konak', taxId: '7778889990', email: 'operasyon@lojistikpartneri.com' },
];

export const mockProducts = [
  { label: 'Elbise', price: 200, unit: 'Adet' },
  { label: 'Gömlek', price: 75, unit: 'Adet' },
  { label: 'Danışmanlık Hizmeti', price: 1000, unit: 'Saat' },
  { label: 'Laptop', price: 15000, unit: 'Adet' },
  { label: 'Klavye', price: 450, unit: 'Adet' },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: 'Ahmet Yılmaz',
    customerEmail: 'ahmet.yilmaz@example.com',
    invoiceDate: '2024-06-15',
    dueDate: '2024-07-15',
    vat: 650.0,
    amount: 3250.0,
    status: 'Ödendi',
    items: [
      { id: 1, productName: 'Laptop', quantity: 1, unit: 'Adet', unitPrice: 2500, vatRate: 20 },
      { id: 2, productName: 'Klavye', quantity: 1, unit: 'Adet', unitPrice: 500, vatRate: 20 },
    ],
    notes: 'Bu bir test faturasıdır.',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: 'Teknoloji A.Ş.',
    customerEmail: 'iletisim@teknoloji.as',
    invoiceDate: '2024-05-20',
    dueDate: '2024-06-20',
    vat: 3560.1,
    amount: 17800.5,
    status: 'Beklemede',
    items: [
      { id: 1, productName: 'Danışmanlık Hizmeti', quantity: 15, unit: 'Saat', unitPrice: 1000, vatRate: 20 },
    ],
    notes: 'Danışmanlık hizmeti bedeli.',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: 'Ayşe Kaya',
    customerEmail: 'ayse.kaya@example.com',
    invoiceDate: '2024-04-10',
    dueDate: '2024-05-10',
    vat: 240.0,
    amount: 1200.0,
    status: 'Gecikti',
    items: [
        { id: 1, productName: 'Elbise', quantity: 5, unit: 'Adet', unitPrice: 200, vatRate: 10 },
    ],
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customer: 'Global Lojistik',
    customerEmail: 'info@globallojistik.com',
    invoiceDate: '2024-07-01',
    dueDate: '2024-07-01',
    vat: 150.0,
    amount: 750.0,
    status: 'İade Edildi',
    items: [
        { id: 1, productName: 'Gömlek', quantity: 10, unit: 'Adet', unitPrice: 75, vatRate: 20 },
    ],
    notes: 'İade edilen ürünler.',
  },
];



export const transactions: Transaction[] = [
  {
    id: 'TR001',
    customerCode: 'C001',
    date: '01.01.2023',
    receiptNo: 'FN001',
    type: 'Çıkış',
    description: 'Mal Alımı (TL)',
    amount: 5000.00,
    balance: 5000.00,
    status: 'Borcu Var',
    currency: 'TRY',
  },
  {
    id: 'TR002',
    customerCode: 'C001',
    date: '02.01.2023',
    receiptNo: 'FN002',
    type: 'Çıkış',
    description: 'Lisans Alımı (USD)',
    amount: 4050.00,
    balance: 9050.00, // Note: Balance calculation in a multi-currency scenario is complex.
    status: 'Borcu Var',
    currency: 'USD',
  },
  {
    id: 'TR003',
    customerCode: 'C001',
    date: '05.01.2023',
    receiptNo: 'FN005',
    type: 'Giriş',
    description: 'Hizmet Satışı (EUR)',
    amount: -3300.00,
    balance: 5750.00, // This is based on the image, not currency conversion.
    status: 'Alacağı Var',
    currency: 'EUR',
  },
  {
    id: 'TR004',
    customerCode: 'C001',
    date: '28.06.2025',
    receiptNo: 'T-4',
    type: 'Giriş',
    description: 'tahsilat',
    amount: -100.00,
    balance: 5650.00,
    status: 'Alacağı Var',
    currency: 'TRY',
    details: {
        type: 'Nakit',
        no: '',
        vade_tarihi: '',
        aciklama: 'tahsilat',
        tutar: 100.00,
    },
    totals: {
        ara_toplam: 100.00,
        masraf_toplam: 10.00,
        vade_toplam: 0.00,
        genel_toplam: 90.00,
        cariye_islenen_tutar: 100.00,
        nakit_toplam: 100.00,
        kredi_karti_toplam: 0.00,
        cek_toplam: 0.00,
        senet_toplam: 0.00
    }
  }
];
