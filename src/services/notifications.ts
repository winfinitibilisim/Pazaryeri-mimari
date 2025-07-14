// Bildirim servisi
// Bu servis, uygulama genelinde tutarlı bildirimler göstermek için kullanılır

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  type: NotificationType;
  message: string;
  title?: string;
  autoHideDuration?: number;
}

class NotificationService {
  // Temel bildirim gösterme fonksiyonu
  show(options: NotificationOptions): void {
    const { type, message, title, autoHideDuration = 3000 } = options;
    
    // Konsola bildirim bilgilerini yazdır (geliştirme amaçlı)
    console.log(`[${type.toUpperCase()}] ${title ? title + ': ' : ''}${message}`);
    
    // Burada gerçek bildirim gösterme işlemi yapılacak
    // Şu an için basit bir alert kullanıyoruz, gerçek uygulamada
    // bu kısım NotificationContext ile entegre edilecek
    
    // Bildirim tipine göre ikon ve renk belirle
    let icon = '🔔';
    switch (type) {
      case 'success':
        icon = '✅';
        break;
      case 'error':
        icon = '❌';
        break;
      case 'warning':
        icon = '⚠️';
        break;
      case 'info':
        icon = 'ℹ️';
        break;
    }
    
    // Bildirim göster
    // Bu kısım gerçek uygulamada NotificationContext ile değiştirilecek
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // Browser bildirimlerini kullan (izin varsa)
      if (Notification.permission === 'granted') {
        new Notification(title || `${icon} Bildirim`, {
          body: message,
          icon: '/logo192.png' // Uygulamanızın logosu
        });
      }
    }
    
    // Bildirim sistemini NotificationContext ile entegre et
    const notificationEvent = new CustomEvent('notification', {
      detail: { type, message, title, autoHideDuration }
    });
    window.dispatchEvent(notificationEvent);
  }
  
  // Başarı bildirimi göster
  showSuccess(message: string, title?: string): void {
    this.show({ type: 'success', message, title });
  }
  
  // Hata bildirimi göster
  showError(message: string, title?: string): void {
    this.show({ type: 'error', message, title });
  }
  
  // Uyarı bildirimi göster
  showWarning(message: string, title?: string): void {
    this.show({ type: 'warning', message, title });
  }
  
  // Bilgi bildirimi göster
  showInfo(message: string, title?: string): void {
    this.show({ type: 'info', message, title });
  }
}

// Singleton örneği oluştur
export const notifications = new NotificationService();
