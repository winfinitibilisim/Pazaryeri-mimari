/**
 * Merkezi Filtre Yapılandırmaları
 * 
 * Bu dosya, tüm uygulama genelinde kullanılan filtre yapılandırmalarını içerir.
 * Yeni bir sayfada filtre kullanmak istediğinizde, bu dosyadan ilgili yapılandırmayı import edebilirsiniz.
 */

import { FilterField } from '../components/common/AccordionFilter';


/**
 * Şube filtreleri
 */
export const branchFilterConfig: FilterField[] = [
  {
    id: 'name',
    label: 'Şube Adı',
    type: 'text'
  },
  {
    id: 'city',
    label: 'Şehir',
    type: 'select',
    options: [
      { value: 'Ankara', label: 'Ankara' },
      { value: 'İstanbul', label: 'İstanbul' },
      { value: 'İzmir', label: 'İzmir' },
      { value: 'Bursa', label: 'Bursa' }
    ]
  },
  {
    id: 'country',
    label: 'Ülke',
    type: 'select',
    options: [
      { value: 'Türkiye', label: 'Türkiye' },
      { value: 'Almanya', label: 'Almanya' },
      { value: 'İngiltere', label: 'İngiltere' },
      { value: 'Fransa', label: 'Fransa' }
    ]
  },
  {
    id: 'createdAt',
    label: 'Oluşturma Tarihi',
    type: 'date'
  }
];

/**
 * Ürün filtreleri
 */
export const productFilterConfig: FilterField[] = [
  {
    id: 'name',
    label: 'Ürün Adı',
    type: 'text'
  },
  {
    id: 'category',
    label: 'Kategori',
    type: 'select',
    options: [
      { value: 'elektronik', label: 'Elektronik' },
      { value: 'giyim', label: 'Giyim' },
      { value: 'ev', label: 'Ev & Yaşam' },
      { value: 'kitap', label: 'Kitap & Kırtasiye' }
    ]
  },
  {
    id: 'price',
    label: 'Fiyat Aralığı',
    type: 'number'
  },
  {
    id: 'stock',
    label: 'Stok Durumu',
    type: 'select',
    options: [
      { value: 'inStock', label: 'Stokta Var' },
      { value: 'lowStock', label: 'Stok Az' },
      { value: 'outOfStock', label: 'Stokta Yok' }
    ]
  },
  {
    id: 'createdAt',
    label: 'Eklenme Tarihi',
    type: 'date'
  }
];

/**
 * Müşteri filtreleri
 */
export const customerFilterConfig: FilterField[] = [
  {
    id: 'name',
    label: 'Müşteri Adı',
    type: 'text'
  },
  {
    id: 'email',
    label: 'E-posta',
    type: 'text'
  },
  {
    id: 'phone',
    label: 'Telefon',
    type: 'text'
  },
  {
    id: 'city',
    label: 'Şehir',
    type: 'select',
    options: [
      { value: 'Ankara', label: 'Ankara' },
      { value: 'İstanbul', label: 'İstanbul' },
      { value: 'İzmir', label: 'İzmir' },
      { value: 'Bursa', label: 'Bursa' }
    ]
  },
  {
    id: 'registrationDate',
    label: 'Kayıt Tarihi',
    type: 'date'
  }
];

/**
 * Sipariş filtreleri
 */
export const orderFilterConfig: FilterField[] = [
  {
    id: 'orderNumber',
    label: 'Sipariş Numarası',
    type: 'text'
  },
  {
    id: 'status',
    label: 'Sipariş Durumu',
    type: 'select',
    options: [
      { value: 'pending', label: 'Beklemede' },
      { value: 'processing', label: 'İşleniyor' },
      { value: 'shipped', label: 'Kargoya Verildi' },
      { value: 'delivered', label: 'Teslim Edildi' },
      { value: 'cancelled', label: 'İptal Edildi' }
    ]
  },
  {
    id: 'paymentMethod',
    label: 'Ödeme Yöntemi',
    type: 'select',
    options: [
      { value: 'creditCard', label: 'Kredi Kartı' },
      { value: 'bankTransfer', label: 'Havale/EFT' },
      { value: 'payAtDoor', label: 'Kapıda Ödeme' }
    ]
  },
  {
    id: 'orderDate',
    label: 'Sipariş Tarihi',
    type: 'date'
  },
  {
    id: 'totalAmount',
    label: 'Toplam Tutar',
    type: 'number'
  }
];

/**
 * Filtre yapılandırmalarını bir araya toplayan nesne
 * Bu nesne, tüm filtre yapılandırmalarına tek bir yerden erişim sağlar
 */
export const filterConfigs = {
  branch: branchFilterConfig,
  product: productFilterConfig,
  customer: customerFilterConfig,
  order: orderFilterConfig
};

export default filterConfigs;
