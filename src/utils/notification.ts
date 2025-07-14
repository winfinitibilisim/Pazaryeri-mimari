import { NotificationOptions } from '../contexts/NotificationContext';

// Bildirim gösterme fonksiyonu için tip tanımı
type ShowNotificationFunction = (message: string, options?: NotificationOptions) => void;

// Global bildirim fonksiyonu
let showNotification: ShowNotificationFunction | null = null;

/**
 * Bildirim gösterme fonksiyonunu ayarlar
 * Bu fonksiyon, NotificationProvider tarafından çağrılır
 * @param fn Bildirim gösterme fonksiyonu
 */
export const setNotificationFunction = (fn: ShowNotificationFunction) => {
  showNotification = fn;
};

/**
 * Bildirim gösterir
 * @param message Bildirim mesajı
 * @param options Bildirim seçenekleri
 */
export const notify = (message: string, options?: NotificationOptions) => {
  if (showNotification) {
    showNotification(message, options);
  } else {
    console.warn('Notification function is not set. Make sure NotificationProvider is mounted.');
  }
};

/**
 * Bilgi bildirimi gösterir
 * @param message Bildirim mesajı
 * @param options Bildirim seçenekleri
 */
export const notifyInfo = (message: string, options?: NotificationOptions) => {
  notify(message, { ...options, severity: 'info' });
};

/**
 * Başarı bildirimi gösterir
 * @param message Bildirim mesajı
 * @param options Bildirim seçenekleri
 */
export const notifySuccess = (message: string, options?: NotificationOptions) => {
  notify(message, { ...options, severity: 'success' });
};

/**
 * Uyarı bildirimi gösterir
 * @param message Bildirim mesajı
 * @param options Bildirim seçenekleri
 */
export const notifyWarning = (message: string, options?: NotificationOptions) => {
  notify(message, { ...options, severity: 'warning' });
};

/**
 * Hata bildirimi gösterir
 * @param message Bildirim mesajı
 * @param options Bildirim seçenekleri
 */
export const notifyError = (message: string, options?: NotificationOptions) => {
  notify(message, { ...options, severity: 'error' });
};
