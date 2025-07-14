# React Admin Panel - Proje Kuralları (RULES)

Bu dosya, React Admin Panel projesi için geliştirme standartlarını, kodlama kurallarını ve tasarım prensiplerini içerir. Projeye katkıda bulunan herkesin bu kurallara uyması beklenir.

## Kod Formatı ve Stil

1. **Genel Kod Formatı**
   - İki boşluk (2 space) indentasyon kullanılmalıdır
   - Satır uzunluğu maksimum 100 karakter olmalıdır
   - Her dosyanın sonunda boş bir satır bulunmalıdır
   - Gereksiz boş satırlardan kaçınılmalıdır

2. **TypeScript Kullanımı**
   - Tüm dosyalar `.tsx` veya `.ts` uzantılı olmalıdır
   - `any` tip kullanımından kaçınılmalıdır
   - Her bileşen ve fonksiyon için tip tanımları yapılmalıdır
   - Interface isimleri `I` öneki olmadan yazılmalıdır (örn: `UserProps` vs `IUserProps`)
   - Prop tipleri için interface kullanılmalıdır
   - Tip tanımları export edilecekse ayrı bir `types.ts` dosyasında toplanmalıdır

3. **İsimlendirme Kuralları**
   - Bileşen isimleri PascalCase olarak yazılmalıdır (örn: `UserProfile`)
   - Fonksiyon ve değişken isimleri camelCase olarak yazılmalıdır (örn: `getUserData`)
   - Sabitler ve enum değerleri UPPER_SNAKE_CASE olarak yazılmalıdır (örn: `MAX_RETRY_COUNT`)
   - CSS sınıf isimleri kebab-case olarak yazılmalıdır (örn: `user-avatar`)
   - Dosya isimleri bileşenler için PascalCase, diğerleri için camelCase olmalıdır

## Proje Yapısı

1. **Dosya Organizasyonu**
   ```
   src/
   ├── components/         # Yeniden kullanılabilir bileşenler
   │   ├── common/         # Ortak kullanılan temel bileşenler
   │   ├── layout/         # Layout bileşenleri (Header, Sidebar, Footer)
   │   └── features/       # Özellik bazlı bileşenler
   ├── pages/              # Sayfa bileşenleri
   ├── hooks/              # Custom React hooks
   ├── services/           # API servisleri ve veri işlemleri
   ├── utils/              # Yardımcı fonksiyonlar
   ├── context/            # React context dosyaları
   ├── types/              # Tip tanımlamaları
   ├── assets/             # Statik dosyalar (resimler, fontlar)
   └── theme/              # UI teması ve stil dosyaları
   ```

2. **İçe Aktarma (Import) Düzeni**
   Her dosyanın başında importlar şu sırayla yapılmalıdır:
   - React ve React-related importlar
   - Third-party kütüphane importları
   - Projeden component importları
   - Projeden stil, tip ve yardımcı fonksiyon importları

## Bileşen Standartları

1. **Bileşen Yapısı**
   - Fonksiyonel bileşenler ve React Hooks tercih edilmelidir
   - Her bileşen tek bir sorumluluk prensibine uymalıdır
   - Karmaşık bileşenler daha küçük alt bileşenlere bölünmelidir
   - Her bileşenin bir prop arayüzü (interface) olmalıdır

2. **Bileşen Örneği**
   ```tsx
   import React, { useState, useEffect } from 'react';
   import { Typography, Box } from '@mui/material';
   import { fetchUserData } from 'services/userService';
   import { UserAvatar } from 'components/common/UserAvatar';
   import type { User } from 'types/user';

   interface UserProfileProps {
     userId: string;
     showDetails?: boolean;
   }

   export const UserProfile: React.FC<UserProfileProps> = ({ 
     userId, 
     showDetails = false 
   }) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState<boolean>(true);

     useEffect(() => {
       const loadUser = async () => {
         try {
           const data = await fetchUserData(userId);
           setUser(data);
         } catch (error) {
           console.error('Error loading user:', error);
         } finally {
           setLoading(false);
         }
       };

       loadUser();
     }, [userId]);

     if (loading) return <Typography>Yükleniyor...</Typography>;
     if (!user) return <Typography>Kullanıcı bulunamadı</Typography>;

     return (
       <Box>
         <UserAvatar user={user} />
         <Typography variant="h6">{user.name}</Typography>
         {showDetails && (
           <Box>
             <Typography>{user.email}</Typography>
             <Typography>{user.role}</Typography>
           </Box>
         )}
       </Box>
     );
   };
   ```

## Material UI Kullanımı

1. **Tema ve Stil**
   - Doğrudan CSS yerine Material UI'nin stil sistemi kullanılmalıdır
   - Renkler tema dosyasından referans alınmalıdır, hardcoded değerler kullanılmamalıdır
   - Responsive tasarım için MUI Grid sistemi ve breakpoint API'si kullanılmalıdır
   - Özel stil tanımları için `sx` prop tercih edilmelidir

2. **Bileşen Kullanımı**
   - MUI bileşenleri varsayılan olarak tercih edilmelidir
   - Tasarım tutarlılığı için UI öğeleri arasında spacing değerleri theme'den alınmalıdır
   - İkon boyutları ve renkler tutarlı olmalıdır
   - Sayfalar arası geçişlerde Loading durumları gösterilmelidir

## Performans Kuralları

1. **Optimizasyon**
   - Büyük listeler için sanal kaydırma (virtualization) kullanılmalıdır
   - Gereksiz render'lardan kaçınmak için `React.memo`, `useMemo` ve `useCallback` kullanılmalıdır
   - Ağır hesaplamalar için lazy loading ve code splitting uygulanmalıdır
   - Büyük veya sık değişmeyen state için Redux veya Context API kullanılmalıdır

2. **API İstekleri**
   - Tüm API istekleri servis katmanında yapılmalıdır
   - İstek sonuçları için uygun caching mekanizmaları kullanılmalıdır
   - API istek durumları (loading, error, success) kullanıcıya gösterilmelidir
   - Hata durumları için uygun hata işleme mekanizmaları olmalıdır

## Erişilebilirlik (Accessibility)

1. **Genel A11y Kuralları**
   - Tüm interaktif elemanların uygun ARIA attribute'ları olmalıdır
   - Klavye ile gezinme desteklenmelidir
   - Renk kontrastı WCAG standartlarına uygun olmalıdır (minimum AA seviyesi)
   - Formlar screen reader uyumlu olmalıdır

## Test Standartları

1. **Birim Testleri**
   - Kritik bileşenler ve yardımcı fonksiyonlar için birim testleri yazılmalıdır
   - Test adları açıklayıcı ve anlaşılır olmalıdır
   - Her test tek bir davranışı kontrol etmelidir
   - Snapshot testleri minimum düzeyde tutulmalıdır

2. **Test Yapısı**
   ```tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { UserProfile } from './UserProfile';

   describe('UserProfile', () => {
     it('should display loading state when data is being fetched', () => {
       render(<UserProfile userId="123" />);
       expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
     });

     it('should display user name when data is loaded', async () => {
       render(<UserProfile userId="123" />);
       const userName = await screen.findByText('John Doe');
       expect(userName).toBeInTheDocument();
     });

     it('should toggle details when showDetails prop changes', () => {
       const { rerender } = render(<UserProfile userId="123" showDetails={false} />);
       expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
       
       rerender(<UserProfile userId="123" showDetails={true} />);
       expect(screen.getByText('john@example.com')).toBeInTheDocument();
     });
   });
   ```

## Commit ve Dokümantasyon Kuralları

1. **Commit Mesajları**
   - Commit mesajları anlaşılır ve açıklayıcı olmalıdır
   - Mesajlar şu formatı takip etmelidir: `<type>(<scope>): <description>`
   - Örnek: `feat(auth): add login page`, `fix(dashboard): resolve chart loading issue`

2. **Kod Dokümantasyonu**
   - Karmaşık fonksiyonlar ve bileşenler için JSDoc yorumları eklenmelidir
   - Public API'ler dokümante edilmelidir
   - Karmaşık iş mantığı açıklanmalıdır
   - Geçici çözümler (workaround) ve bilinen problemler belgelenmelidir

---

Bu kurallar, projenin tutarlı, sürdürülebilir ve yüksek kalitede olmasını sağlamak için düzenli olarak güncellenmelidir. 