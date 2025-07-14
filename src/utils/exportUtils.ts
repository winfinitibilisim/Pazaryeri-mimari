import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Veriyi Excel dosyasına aktarır
 * @param data Aktarılacak veri dizisi
 * @param columns Sütun yapılandırması
 * @param fileName Dosya adı
 */
export const exportToExcel = (
  data: any[],
  columns: { field: string; header: string }[],
  fileName: string,
  summary?: Record<string, any>
) => {
  // Veriyi Excel formatına dönüştür
  const excelData = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(column => {
      row[column.header] = item[column.field];
    });
    return row;
  });

  // Excel çalışma kitabı oluştur
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
    // Toplamlar satırını ekle
  if (summary) {
    const summaryRow = columns.map(col => summary[col.field] || null);
    XLSX.utils.sheet_add_aoa(worksheet, [summaryRow], { origin: -1 });
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Dosyayı indir
  XLSX.writeFile(workbook, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

/**
 * Veriyi PDF dosyasına aktarır
 * @param data Aktarılacak veri dizisi
 * @param columns Sütun yapılandırması
 * @param fileName Dosya adı
 * @param title Belge başlığı
 */
export const exportToPdf = (
  data: any[],
  columns: { field: string; header: string }[],
  fileName: string,
  title: string,
  summary?: Record<string, any>
) => {
  // PDF belgesi oluştur (A4 boyutu, yatay)
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Başlık ekle
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Oluşturulma Tarihi: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, 30);
  
  // Tablo başlıkları ve verileri hazırla
  const headers = columns.map(column => column.header);
  const rows = data.map(item => {
    return columns.map(column => {
      const value = item[column.field];
      // Tarih formatını kontrol et
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return format(new Date(value), 'dd.MM.yyyy');
      }
      // Para birimi formatını kontrol et
      if (typeof value === 'number' && column.field.toString().includes('amount')) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
      }
      return value;
    });
  });

  // Tablo oluştur
    // Toplamlar satırını hazırla
  const footer = summary ? [columns.map(col => summary[col.field] || '')] : [];

  autoTable(doc, {
    head: [headers],
    body: rows,
    foot: footer,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Dosyayı indir
  doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

/**
 * Fatura durumu için renk belirleme fonksiyonu
 * @param status Fatura durumu
 * @returns Arka plan ve metin rengi
 */
export const getInvoiceStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return { bg: '#e6f7ee', text: '#1e8e3e' };
    case 'unpaid':
      return { bg: '#fef2f2', text: '#d92f2f' };
    case 'partial':
      return { bg: '#fff8e6', text: '#e8a317' };
    case 'cancelled':
      return { bg: '#f2f2f2', text: '#757575' };
    case 'draft':
      return { bg: '#e6f3ff', text: '#1976d2' };
    default:
      return { bg: '#f2f2f2', text: '#757575' };
  }
};

/**
 * Fatura durumunu insan tarafından okunabilir formata dönüştürür
 * @param status Fatura durumu
 * @param translations Çeviri nesnesi
 * @returns İnsan tarafından okunabilir durum metni
 */
export const formatInvoiceStatus = (status: string, translations: Record<string, string>) => {
  return translations[status] || status;
};

/**
 * Para birimini formatlar
 * @param amount Miktar
 * @returns Formatlanmış para birimi
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
};

/**
 * Tarihi formatlar
 * @param dateString Tarih dizesi
 * @returns Formatlanmış tarih
 */
export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy');
  } catch (error) {
    return dateString;
  }
};
