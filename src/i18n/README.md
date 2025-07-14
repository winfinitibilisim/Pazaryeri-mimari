# Dil Dosyaları Hakkında

Bu klasör, React Admin Panel uygulamasının çoklu dil desteği için gerekli olan dil dosyalarını içerir.

## Desteklenen Diller

Uygulama şu dilleri desteklemektedir:
- Türkçe (tr.json)
- İngilizce (en.json)
- Arapça (ar.json)
- Rusça (ru.json)

## Bilinen Sorunlar

Dil dosyalarında bazı anahtarlar tekrarlanmaktadır. Bu, uygulamanın çalışmasını engellemez ancak çevirilerin doğru şekilde yönetilmesini zorlaştırabilir. Gelecekte bu sorunun çözülmesi için dil dosyalarının yeniden düzenlenmesi önerilir.

## Dil Dosyalarını Düzenleme Kılavuzu

Dil dosyalarını düzenlerken şu kurallara dikkat edilmelidir:

1. Her anahtar yalnızca bir kez tanımlanmalıdır.
2. Anahtarlar mantıksal kategorilere göre gruplandırılmalıdır.
3. Yeni bir çeviri eklendiğinde, tüm dil dosyalarına eklenmesi gerekir.
4. Çeviriler, ilgili modüllere göre düzenlenmelidir.

## Satış Faturaları Modülü Çevirileri

Satış faturaları modülü için eklenen çeviriler şunlardır:

```json
{

  "searchInvoices": "Fatura ara...",
  "invoiceNumber": "Fatura Numarası",
  "invoiceDate": "Fatura Tarihi",
  "dueDate": "Vade Tarihi",
  "invoiceStatus": "Fatura Durumu",
  "paymentMethod": "Ödeme Yöntemi",
  "billingAddress": "Fatura Adresi",
  "shippingAddress": "Teslimat Adresi",
  "notes": "Notlar",
  "taxId": "Vergi No",
  "email": "E-posta",
  "phone": "Telefon",
  "description": "Açıklama",
  
  "paid": "Ödendi",
  "unpaid": "Ödenmedi",
  "partial": "Kısmi Ödeme",
  "cancelled": "İptal Edildi",
  "draft": "Taslak",
  
  "bankTransfer": "Banka Havalesi",
  "creditCard": "Kredi Kartı",
  "cash": "Nakit",
  "check": "Çek",
  
  "invoiceDetails": "Fatura Detayları",
  "items": "Kalemler",
  "printDate": "Yazdırma Tarihi",
  "exportToExcel": "Excel'e Aktar",
  "exportToPdf": "PDF'e Aktar",
  "invoiceProductName": "Ürün Adı",
  "invoiceUnitPrice": "Birim Fiyat",
  "taxRate": "Vergi Oranı",
  "discount": "İndirim",
  "subtotal": "Ara Toplam",
  "discountAmount": "İndirim Tutarı",
  "taxAmount": "Vergi Tutarı",
  "totalAmount": "Toplam Tutar",
  "rowsPerPage": "Sayfa başına satır"
}
```

## Dil Dosyalarını Yeniden Düzenleme Önerisi

Dil dosyalarını yeniden düzenlemek için şu adımları izleyebilirsiniz:

1. Tüm dil dosyalarını yedekleyin.
2. Her dil dosyasını açın ve tekrarlanan anahtarları tespit edin.
3. Tekrarlanan anahtarları kaldırın, yalnızca bir tanesi kalsın.
4. Anahtarları mantıksal kategorilere göre düzenleyin.
5. Tüm dil dosyalarının aynı anahtarları içerdiğinden emin olun.
6. Değişiklikleri test edin ve uygulamayı yeniden başlatın.

Bu işlem, dil dosyalarının daha kolay yönetilmesini sağlayacak ve tekrarlanan anahtarlardan kaynaklanan uyarıları ortadan kaldıracaktır.
