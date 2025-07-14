# React Admin Panel - Merkezi Paylaşımlı Elementler
Bu dosya, projede merkezi olarak paylaşılan ve birden fazla bileşen tarafından kullanılan elementleri, bileşenleri ve yardımcı fonksiyonları belgelemektedir.

## İçindekiler

1. [Tema ve Renkler](#tema-ve-renkler)
2. [Paylaşımlı Bileşenler (Common Components)](#paylaşımlı-bileşenler)
3. [Yerleşim Bileşenleri (Layout Components)](#yerleşim-bileşenleri)

## Tema ve Renkler

React Admin Panel, tutarlı bir görünüm ve hissiyat sağlamak için merkezileştirilmiş bir tema ve renk paleti kullanır.

### Renkler (`src/theme/colors.ts`)

Projede kullanılan merkezi renk tanımları:

```typescript
// Temel renkler
primary: '#25638f'       // Ana marka rengi
secondary: '#ff5722'     // İkincil vurgu rengi
error: '#ff1744'         // Hata durumları için kullanılır
accent: '#120a8f'        // Vurgu rengi
white: '#FFFFFF'         // Beyaz

// Varyasyonlar 
primaryLight: '#3a7eaf'  // Ana rengin açık tonu, hover durumları vb. için
primaryDark: '#1a4b70'   // Ana rengin koyu tonu, aktif durumlar vb. için
secondaryLight: '#ff7a47'
secondaryDark: '#dd4b1a'

// Gri tonları
grey100: '#f5f5f5'       // En açık gri, arka plan için
...
grey900: '#212121'       // En koyu gri, metin için

// Durum renkleri
success: '#4caf50'       // Başarı durumları için yeşil
warning: '#ff9800'       // Uyarı durumları için turuncu
info: '#2196f3'          // Bilgi durumları için mavi
```

#### Kullanım Örnekleri:

```tsx
import { colors } from '../theme/colors';

// Doğrudan renk kullanımı
<Box sx={{ backgroundColor: colors.primary }}>...</Box>

// Durum renklerini kullanma
<Typography sx={{ color: colors.success }}>İşlem başarılı</Typography>

// Gri tonlarını kullanma
<Divider sx={{ borderColor: colors.grey300 }} />
```

### Renk Kodları Detaylı Açıklaması

Projede kullanılan ana renklerin detaylı açıklaması ve kullanım alanları:

| Renk Kodu | Değişken | Açıklama | Kullanım Alanları |
|-----------|----------|----------|-------------------|
| `#25638f` | `primary` | Koyu mavi/lacivert, ana marka rengi | Başlıklar, butonlar, vurgulanması gereken elementler |
| `#ff5722` | `secondary` | Turuncu, ikincil vurgu rengi | Aksiyon butonları, ikincil vurgular, uyarılar |
| `#ff1744` | `error` | Parlak kırmızı | Hata mesajları, silme butonları, kritik uyarılar |
| `#FFFFFF` | `white` | Beyaz | Arka planlar, metin rengi (koyu zeminde) |
| `#120a8f` | `accent` | Koyu mor-mavi | Özel vurgular, seçili öğeler, belirli etiketler |

#### Renk Psikolojisi ve Kullanım Rehberi:

- **#25638f (Koyu Mavi/Lacivert)**
  - *Psikolojik Etki*: Güven, profesyonellik, güvenilirlik hissi verir
  - *Kullanım Önerisi*: Kurumsal kimliği temsil eden ana renk olarak tutarlı şekilde kullanılmalı
  - *Kontrast*: Beyaz (#FFFFFF) ile yüksek kontrast sağlar, erişilebilirlik için ideal

- **#ff5722 (Turuncu)**
  - *Psikolojik Etki*: Enerji, heyecan ve çağrı-eylem hissi uyandırır
  - *Kullanım Önerisi*: "Kaydet", "Yeni Ekle" gibi ana CTA (Call-to-Action) butonlarında
  - *Dikkat*: Aşırı kullanımdan kaçınılmalı, vurgu rengi olarak kalmalı
  - *Özel Kullanım*: Sol açılır kapanır menüdeki (Sidebar) menü öğeleri bu renkte olmalıdır

- **#ff1744 (Parlak Kırmızı)**
  - *Psikolojik Etki*: Uyarı, tehlike, önem hissi uyandırır
  - *Kullanım Önerisi*: Yalnızca hata durumları, silme işlemleri ve kritik uyarılar için
  - *Erişilebilirlik*: Renk körlüğü olan kullanıcılar için her zaman ek simge/metin ile desteklenmeli

- **#FFFFFF (Beyaz)**
  - *Psikolojik Etki*: Temizlik, sadelik, açıklık hissi verir
  - *Kullanım Önerisi*: Ana arka plan veya koyu renkli elemanlarda metin olarak
  - *Performans*: Gece modu/koyu tema desteği için alternatifler düşünülmeli

- **#120a8f (Koyu Mor-Mavi)**
  - *Psikolojik Etki*: Yaratıcılık, lüks ve seçkinlik hissi verir
  - *Kullanım Önerisi*: Premium özellikler, özel statüler ve vurgulama için
  - *Kombinasyon*: Ana mavi (#25638f) ile uyumlu geçişler için uygun

### Tema (`src/theme/index.ts`)

Material UI tema konfigürasyonu:

- **Fontlar**: Roboto, Helvetica, Arial
- **Bileşen Stilleri**: Button, AppBar, Drawer, Card için özel stiller
- **Tipografi**: h1-h6 için özel ağırlık ayarları

#### Kullanım:

Tema, `App.tsx` üzerinden tüm uygulamaya sağlanır:

```tsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  {/* Uygulama içeriği */}
</ThemeProvider>
```

## Paylaşımlı Bileşenler

`src/components/common` altında bulunan bileşenler, uygulama genelinde tekrar kullanılan UI elementleridir.

### 1. DataTable (`src/components/common/DataTable.tsx`)

Tüm uygulama genelinde kullanılan standart veri tablosu bileşeni.

**Özellikler:**
- Sayfalama (pagination)
- Sıralama (sorting)
- Filtreleme
- Özelleştirilebilir sütunlar
- Düzenleme ve silme işlemleri için standart butonlar
- Duyarlı (responsive) tasarım
- Seçilebilir satırlar

**Props:**
```typescript
interface Column {
  id: string;                // Sütun kimliği (veri nesnesindeki alan adı)
  label: string;             // Sütun başlığı
  minWidth?: number;         // Minimum genişlik
  align?: 'left' | 'right' | 'center'; // Hizalama (varsayılan: 'left')
  format?: (value: any) => string; // Değer biçimlendirme fonksiyonu
}

interface DataTableProps {
  columns: Column[];         // Tablo sütunları
  rows: any[];              // Tablo verileri
  title?: string;           // Tablo başlığı
  onEdit?: (row: any) => void; // Düzenleme işlevi
  onDelete?: (row: any) => void; // Silme işlevi
  onRowClick?: (row: any) => void; // Satıra tıklama işlevi
  loading?: boolean;        // Yükleniyor durumu
  pagination?: boolean;     // Sayfalama (varsayılan: true)
  rowsPerPageOptions?: number[]; // Sayfa başına satır seçenekleri (varsayılan: [5, 10, 25])
  initialRowsPerPage?: number; // Başlangıç sayfa başına satır sayısı (varsayılan: 10)
  selectable?: boolean;     // Seçilebilir satırlar (varsayılan: false)
  onSelectionChange?: (selectedRows: any[]) => void; // Seçim değiştiğinde çağrılacak işlev
}
```

**Örnek Kullanım:**
```tsx
import DataTable from '../components/common/DataTable';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Adı', minWidth: 150 },
  { id: 'company', label: 'Şirket', minWidth: 150 },
  { id: 'phone', label: 'Telefon', minWidth: 120 },
];

const rows = [
  { id: 1, name: 'Ankara Şubesi', company: 'Winfiniti Bilişim', phone: '+905546924291' },
  { id: 2, name: 'İstanbul Şubesi', company: 'Winfiniti', phone: '+905546924299' },
];

const handleEdit = (row) => {
  console.log('Düzenle:', row);
  // Düzenleme işlemleri
};

const handleDelete = (row) => {
  console.log('Sil:', row);
  // Silme işlemleri
};

<DataTable 
  columns={columns} 
  rows={rows} 
  title="Şubeler" 
  onEdit={handleEdit} 
  onDelete={handleDelete} 
/>
```

### 2. ActionButtons (`src/components/common/ActionButtons.tsx`)

Düzenleme ve silme işlemleri için standart buton grubu.

**Özellikler:**
- Düzenleme ve silme butonları
- Onay diyaloğu ile silme işlemi
- Tema ile uyumlu ikonlar ve renkler
- Kompakt tasarım

**Props:**
```typescript
interface ActionButtonsProps {
  onEdit: () => void;        // Düzenleme işlevi
  onDelete: () => void;      // Silme işlevi
  disableEdit?: boolean;     // Düzenleme butonunu devre dışı bırakma (varsayılan: false)
  disableDelete?: boolean;   // Silme butonunu devre dışı bırakma (varsayılan: false)
  confirmDelete?: boolean;   // Silme işlemi için onay diyaloğu gösterme (varsayılan: true)
  confirmMessage?: string;   // Onay diyaloğu mesajı
  size?: 'small' | 'medium'; // Buton boyutu (varsayılan: 'small')
}
```

**Örnek Kullanım:**
```tsx
import ActionButtons from '../components/common/ActionButtons';

const handleEdit = () => {
  // Düzenleme işlemleri
};

const handleDelete = () => {
  // Silme işlemleri
};

<ActionButtons 
  onEdit={handleEdit} 
  onDelete={handleDelete} 
  confirmMessage="Bu öğeyi silmek istediğinizden emin misiniz?" 
/>
```

### 3. EditForm (`src/components/common/EditForm.tsx`)

Veri düzenleme/ekleme için standart form bileşeni.

**Özellikler:**
- Dinamik form alanları
- Doğrulama (validation)
- Otomatik form durumu yönetimi
- Tema ile uyumlu stil
- Duyarlı (responsive) tasarım

**Props:**
```typescript
interface FormField {
  name: string;              // Alan adı
  label: string;             // Alan etiketi
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'date' | 'checkbox'; // Alan tipi
  required?: boolean;        // Zorunlu alan (varsayılan: false)
  options?: {                // Select tipi için seçenekler
    value: string | number;
    label: string;
  }[];
  validation?: {             // Doğrulama kuralları
    pattern?: RegExp;        // Doğrulama deseni
    message?: string;        // Hata mesajı
    min?: number;            // Minimum değer/uzunluk
    max?: number;            // Maksimum değer/uzunluk
  };
  fullWidth?: boolean;       // Tam genişlik (varsayılan: true)
  defaultValue?: any;        // Varsayılan değer
}

interface EditFormProps {
  fields: FormField[];       // Form alanları
  onSubmit: (data: any) => void; // Form gönderme işlevi
  onCancel: () => void;      // İptal işlevi
  initialValues?: any;       // Başlangıç değerleri (düzenleme modu için)
  title?: string;            // Form başlığı
  submitButtonText?: string; // Gönder butonu metni (varsayılan: "Kaydet")
  loading?: boolean;         // Yükleniyor durumu
}
```

**Örnek Kullanım:**
```tsx
import EditForm from '../components/common/EditForm';

const fields = [
  { name: 'name', label: 'Şube Adı', type: 'text', required: true },
  { name: 'company', label: 'Şirket Adı', type: 'text', required: true },
  { name: 'phone', label: 'Telefon', type: 'tel', required: true,
    validation: {
      pattern: /^\+?[0-9]{10,15}$/,
      message: 'Geçerli bir telefon numarası giriniz'
    }
  },
];

const handleSubmit = (data) => {
  console.log('Form verileri:', data);
  // Form işleme
};

const handleCancel = () => {
  // İptal işlemleri
};

<EditForm 
  fields={fields} 
  onSubmit={handleSubmit} 
  onCancel={handleCancel} 
  title="Şube Ekle/Düzenle" 
  initialValues={{ name: 'Ankara Şubesi', company: 'Winfiniti', phone: '+905546924291' }} 
/>
```

### 1. ChartCard (`src/components/common/ChartCard.tsx`)

Grafik verilerini görüntülemek için kart bileşeni.

**Özellikler:**
- Line ve Bar grafikleri desteği
- Özelleştirilebilir başlık ve alt başlık
- Tema ile uyumlu stil
- Chart.js entegrasyonu

**Props:**
```typescript
interface ChartCardProps {
  title: string;                           // Kart başlığı
  subtitle?: string;                       // İsteğe bağlı alt başlık
  chartType: 'line' | 'bar';               // Grafik tipi
  data: ChartData<'line' | 'bar'>;         // Chart.js veri formatı
  options?: ChartOptions<'line' | 'bar'>;  // Chart.js seçenekleri (isteğe bağlı)
  height?: number;                         // Grafik yüksekliği (varsayılan: 300px)
}
```

**Örnek Kullanım:**
```tsx
import ChartCard from '../components/common/ChartCard';

const data = {
  labels: ['Ocak', 'Şubat', 'Mart'],
  datasets: [
    {
      label: 'Satışlar',
      data: [12, 19, 3],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }
  ],
};

<ChartCard
  title="Aylık Satışlar"
  subtitle="Son 3 aylık veri"
  chartType="line"
  data={data}
  height={250}
/>
```

### 2. DataTable (`src/components/common/DataTable.tsx`)

Veri tablolarını görüntülemek için gelişmiş tablo bileşeni.

**Özellikler:**
- Sayfalama (pagination)
- Sıralama (sorting)
- Arama/filtreleme
- Duyarlı tasarım (responsive design)
- Özelleştirilebilir sütunlar
- Veri formatlaması

**Props:**
```typescript
interface DataTableProps {
  title?: string;                    // Tablo başlığı (isteğe bağlı)
  columns: Column[];                 // Sütun tanımları
  data: any[];                       // Tablo verileri (satırlar)
  onRowClick?: (row: any) => void;   // Satıra tıklama işleyicisi
  onAddClick?: () => void;           // Ekle butonuna tıklama işleyicisi
  showToolbar?: boolean;             // Araç çubuğunu göster/gizle (varsayılan: true)
}

// Sütun tanımı
interface Column {
  id: string;                        // Sütun kimliği
  label: string;                     // Sütun başlığı
  minWidth?: number;                 // Minimum genişlik
  align?: 'right' | 'left' | 'center'; // Hizalama
  format?: (value: any, row?: any) => React.ReactNode; // Biçimlendirme fonksiyonu
}
```

**Örnek Kullanım:**
```tsx
import DataTable from '../components/common/DataTable';

const columns = [
  { id: 'name', label: 'İsim', minWidth: 150 },
  { id: 'email', label: 'E-posta' },
  { id: 'status', label: 'Durum', align: 'center',
    format: (value) => (
      <Chip 
        label={value} 
        color={value === 'Aktif' ? 'success' : 'error'} 
      />
    )
  },
  { id: 'date', label: 'Tarih', 
    format: (value) => new Date(value).toLocaleDateString('tr-TR')
  },
];

const data = [
  { name: 'Ahmet Yılmaz', email: 'ahmet@ornek.com', status: 'Aktif', date: '2023-01-15' },
  // ...diğer veriler
];

<DataTable
  title="Kullanıcılar"
  columns={columns}
  data={data}
  onRowClick={(row) => console.log('Seçilen satır:', row)}
  onAddClick={() => console.log('Yeni kullanıcı ekle')}
/>
```

### 3. StatCard (`src/components/common/StatCard.tsx`)

İstatistik kartları ve sayısal verileri görüntülemek için kart bileşeni.

**Özellikler:**
- Simge/ikon desteği
- Renk seçenekleri
- Değişim göstergesi (artış/azalış)

**Props:**
```typescript
interface StatCardProps {
  title: string;                      // Kart başlığı
  value: string | number;             // Ana değer
  icon: React.ReactElement<SvgIconProps>; // Material UI ikonu
  color: string;                      // Renk (hex kodu veya tema rengi)
  change?: {                          // İsteğe bağlı değişim bilgisi
    value: string | number;           // Değişim değeri
    isPositive: boolean;              // Pozitif mi (true) negatif mi (false)
  };
}
```

**Örnek Kullanım:**
```tsx
import StatCard from '../components/common/StatCard';
import { People, TrendingUp } from '@mui/icons-material';
import { colors } from '../theme/colors';

<StatCard
  title="Toplam Kullanıcılar"
  value="2,534"
  icon={<People />}
  color={colors.primary}
  change={{ value: '12%', isPositive: true }}
/>

<StatCard
  title="Gelir"
  value="₺45,231"
  icon={<TrendingUp />}
  color={colors.success}
  change={{ value: '8%', isPositive: true }}
/>
```

## Yerleşim Bileşenleri

`src/components/layout` altında bulunan bileşenler, uygulamanın ana yapısını ve yerleşimini oluşturur.

### 1. Header (`src/components/layout/Header.tsx`)

Uygulama üst çubuğu (AppBar).

**Özellikler:**
- Gezinme menüsü
- Kullanıcı profil menüsü
- Bildirimler
- Arama
- Sidebar toggle

### 2. Sidebar (`src/components/layout/Sidebar.tsx`)

Kenar çubuğu / ana navigasyon.

**Özellikler:**
- Genişletilebilir/daraltılabilir tasarım
- Sayfa navigasyonu
- Alt kategoriler
- İkon desteği

**Stil Notları:**
- Menü öğeleri #ff5722 (turuncu/secondary) renkte olmalıdır
- Seçili menü öğeleri daha koyu renkte veya arka plan vurgusuyla belirtilmelidir
- İkonlar menü öğeleriyle aynı renkte olmalıdır

### 3. Footer (`src/components/layout/Footer.tsx`)

Sayfa alt bilgisi.

**Özellikler:**
- Telif hakkı bilgisi
- Sosyal medya linkleri
- Hızlı erişim bağlantıları

## Kullanım Yönergeleri

### Yeni Bir Bileşen Oluştururken:

1. Benzer bileşenlerin nasıl oluşturulduğunu inceleyin
2. Projenin tema ve renk paletini kullanın
3. Yeniden kullanılabilir bileşenler oluşturmak için TypeScript interface'lerini doğru tanımlayın
4. Bileşeni ilgili dizine ekleyin (`common`, `layout`, vb.)

### Tema ve Renkler Kullanırken:

```tsx
// Doğru Yaklaşım
import { colors } from '../../theme/colors';

<Button 
  sx={{ 
    backgroundColor: colors.primary,
    '&:hover': { backgroundColor: colors.primaryDark }
  }}
>
  Kaydet
</Button>

// KULLANMAYIN: Sabit kodlanmış renk değerleri 
<Button sx={{ backgroundColor: '#25638f' }}>Kaydet</Button>
```

### DataTable Kullanırken:

Formatlama fonksiyonlarını doğru tiplendirin:

```typescript
// Doğru
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('tr-TR', { 
    style: 'currency', 
    currency: 'TRY' 
  }).format(value);
};

// Yanlış (tip belirtilmemiş)
const formatCurrency = (value) => {
  return `₺${value}`;
};
``` 