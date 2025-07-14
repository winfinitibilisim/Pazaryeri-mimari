# React Admin Panel

Modern, duyarlı bir yönetici paneli; React, TypeScript ve Material UI ile oluşturulmuştur.

## Proje Hakkında
Bu proje modern bir React Admin Panel uygulamasıdır. TypeScript, Material-UI ve diğer modern teknolojiler kullanılarak geliştirilmiştir.

![React Admin Panel](https://via.placeholder.com/800x400?text=React+Admin+Panel)

## Özellikler

- 🔒 Güvenli Kimlik Doğrulama Sistemi
- 📊 Grafiklerle Etkileşimli Gösterge Paneli
- 👥 Kullanıcı Yönetimi
- 📱 Tamamen Duyarlı Tasarım
- 🎨 Özelleştirilebilir Material UI Teması
- 📈 Chart.js ile Veri Görselleştirme
- 📋 Sıralama, Filtreleme ve Sayfalama ile Veri Tabloları
- 🛣️ React Router ile Yönlendirme

## Teknoloji Yığını

- **React**: Kullanıcı arayüzleri oluşturmak için bir JavaScript kütüphanesi
- **TypeScript**: Ölçeklenebilir, tip güvenli JavaScript
- **Material UI**: Kapsamlı bileşenlere sahip React UI çerçevesi
- **React Router**: React için navigasyon kütüphanesi
- **Chart.js**: Basit ancak esnek JavaScript grafik oluşturma
- **React Chart.js 2**: Chart.js için React sarmalayıcısı

## Proje Yapısı

```
react-admin-panel/
├── public/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ChartCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── StatCard.tsx
│   │   ├── dashboard/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   └── analytics/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Users.tsx
│   ├── services/
│   ├── theme/
│   │   ├── theme.ts
│   │   └── ThemeProvider.tsx
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Bileşen Yapısı

### Düzen Bileşenleri

- **Layout**: Header ve Sidebar'ı içeren ana düzen sarmalayıcısı
- **Header**: Bildirimler ve kullanıcı profili içeren üst gezinme çubuğu
- **Sidebar**: Daraltılabilir kenar çubuğuna sahip gezinme menüsü

### Ortak Bileşenler

- **StatCard**: İkonlarla istatistikleri görüntülemek için yeniden kullanılabilir kart
- **ChartCard**: Farklı grafik türlerini render etmek için kart bileşeni
- **DataTable**: Sıralama, filtreleme ve sayfalama özellikleri olan yeniden kullanılabilir tablo

### Sayfa Bileşenleri

- **Dashboard**: İstatistikler, grafikler ve son siparişlerle ana gösterge paneli
- **Login**: Form doğrulaması olan kimlik doğrulama sayfası
- **Users**: CRUD işlevselliğine sahip kullanıcı yönetim sayfası

## Başlarken

### Ön Koşullar

- Node.js (14.x veya daha yüksek)
- npm veya yarn

### Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/yourusername/react-admin-panel.git
   cd react-admin-panel
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm start
   # veya
   yarn start
   ```

4. Tarayıcınızı açın ve `http://localhost:3000` adresine gidin

### Demo Kimlik Bilgileri

- **E-posta**: admin@example.com
- **Parola**: password

## Özellikler ve Kullanım

### Kimlik Doğrulama

Yönetici paneli, simüle edilmiş bir kimlik doğrulama sistemi kullanır. Üretim ortamında gerçek bir backend API ile entegre edilmelidir.

### Gösterge Paneli

Gösterge paneli sayfası şunları gösterir:
- Temel performans göstergeleri
- Satış eğilimleri grafikleri
- Ziyaretçi istatistikleri
- Son siparişler tablosu

### Kullanıcı Yönetimi

Kullanıcı yönetimi sayfası şunları yapmanıza olanak tanır:
- Tüm kullanıcıları tablo formatında görüntüleme
- Yeni kullanıcılar ekleme
- Mevcut kullanıcı bilgilerini düzenleme
- Kullanıcıları silme

## Özelleştirme

### Tema Özelleştirme

`src/theme/theme.ts` dosyasını değiştirerek temayı özelleştirebilirsiniz. Material UI tema seçenekleri, renkler, tipografi, bileşen stilleri ve daha fazlasını değiştirmenize olanak tanır.

### Yeni Sayfalar Ekleme

Yeni bir sayfa eklemek için:

1. `src/pages` dizininde yeni bir bileşen oluşturun
2. `src/App.tsx` içine yeni bir rota ekleyin
3. `src/components/layout/Sidebar.tsx` içine bir navigasyon öğesi ekleyin

## Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen bir Pull Request göndermekten çekinmeyin.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için LICENSE dosyasına bakın.

## Teşekkürler

- [Material UI](https://mui.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Router](https://reactrouter.com/)

## Test
- `npm test` ile testleri çalıştırabilirsiniz
- Jest ve React Testing Library ile yazılmış testler mevcuttur

## Production
- `npm run build` ile production build oluşturabilirsiniz
- Build dosyaları `build/` klasörüne kaydedilir

---

❤️ ile yapıldı

## Örnek Senaryolar

### Silinenler Özelliği

- **Örnek Veriler**: Ürün, müşteri ve sipariş gibi silinen örnek veriler listeleniyor.
- **Geri Alma**: Her bir veri için "Geri Al" butonu mevcut. Bu buton, veriyi geri yüklemek için kullanılabilir.

### Kullanıcı Girişi

- **Demo Kullanıcı**: `admin@example.com` e-posta adresi ve `password` şifresi ile giriş yapabilirsiniz.

### Sistem Logları

- **Log Görüntüleme**: Sistem loglarını görüntülemek için "Sistem Loglarınız" butonuna tıklayın.

---

## Git Komutları

Yeni bir git deposu başlatmak ve GitHub'a göndermek için aşağıdaki komutları kullanın:

```bash
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/winfinitibilisim/React-Admin-Panel.git
git push -u origin main
```

---

Bu yapı, projenizin başka bir AI agent tarafından daha kolay anlaşılmasını sağlayacaktır.
