import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Grid,
  useTheme,
  Button
} from '@mui/material';

import { useNotifications } from '../contexts/NotificationContext';
import { formatCurrency, formatDate, exportToExcel, exportToPdf } from '../utils/exportUtils';
import { colors } from '../theme/colors';

// Örnek veri
const mockInvoices = [
  {
    id: '1001',
    invoiceNumber: 'INV-2023-001',
    customerName: 'Ahmet Yılmaz',
    invoiceDate: '2023-05-15',
    dueDate: '2023-06-15',
    items: [
      { id: '1', productId: 'P1', name: 'Laptop', quantity: 1, unitPrice: 12000, discount: 5, taxRate: 18 }
    ],
    totalAmount: 13452,
    status: 'paid'
  },
  {
    id: '1002',
    invoiceNumber: 'INV-2023-002',
    customerName: 'Mehmet Demir',
    invoiceDate: '2023-05-20',
    dueDate: '2023-06-20',
    items: [
      { id: '1', productId: 'P2', name: 'Monitör', quantity: 2, unitPrice: 3500, discount: 0, taxRate: 18 }
    ],
    totalAmount: 8260,
    status: 'pending'
  },
  {
    id: '1003',
    invoiceNumber: 'INV-2023-003',
    customerName: 'Ayşe Kaya',
    invoiceDate: '2023-05-25',
    dueDate: '2023-06-25',
    items: [
      { id: '1', productId: 'P3', name: 'Yazıcı', quantity: 1, unitPrice: 4500, discount: 10, taxRate: 18 }
    ],
    totalAmount: 4779,
    status: 'overdue'
  }
];

const SalesReferencePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { showSuccess } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices);
  
  // Arama terimi değiştiğinde filtreleme
  useEffect(() => {
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const filtered = invoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(lowerSearchTerm) ||
        invoice.customerName.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchTerm, invoices]);
  
  // Filtre değişikliği
  const handleFilterChange = (filters: any) => {
    let filtered = [...invoices];
    
    // Status filtresi
    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }
    
    // Tarih filtreleri
    if (filters.invoiceDateStart) {
      const startDate = new Date(filters.invoiceDateStart);
      filtered = filtered.filter(invoice => new Date(invoice.invoiceDate) >= startDate);
    }
    
    if (filters.invoiceDateEnd) {
      const endDate = new Date(filters.invoiceDateEnd);
      filtered = filtered.filter(invoice => new Date(invoice.invoiceDate) <= endDate);
    }
    
    // Tutar filtreleri
    if (filters.amountMin) {
      filtered = filtered.filter(invoice => invoice.totalAmount >= filters.amountMin);
    }
    
    if (filters.amountMax) {
      filtered = filtered.filter(invoice => invoice.totalAmount <= filters.amountMax);
    }
    
    // Müşteri adı filtresi
    if (filters.customerName) {
      const customerNameLower = filters.customerName.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.customerName.toLowerCase().includes(customerNameLower)
      );
    }
    
    setFilteredInvoices(filtered);
  };
  
  // Excel'e aktarma
  const handleExportExcel = () => {
    const dataToExport = filteredInvoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      invoiceDate: formatDate(inv.invoiceDate),
      dueDate: formatDate(inv.dueDate),
      taxAmount: inv.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return sum + (itemTotal * item.taxRate / 100);
      }, 0),
      totalAmount: inv.totalAmount,
      status: t(inv.status, { defaultValue: inv.status })
    }));
    
    // Toplam satırı ekle
    const grandTotal = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTax = filteredInvoices.reduce((sum, inv) => {
      return sum + inv.items.reduce((itemSum, item) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return itemSum + (itemTotal * item.taxRate / 100);
      }, 0);
    }, 0);
    
    dataToExport.push({
      invoiceNumber: '',
      customerName: '',
      invoiceDate: '',
      dueDate: t('grandTotal', { defaultValue: 'Genel Toplam' }),
      taxAmount: totalTax,
      totalAmount: grandTotal,
      status: ''
    });
    
    const columns = [
      { field: 'invoiceNumber', header: t('invoiceNumber', 'Fatura No') },
      { field: 'customerName', header: t('customer', 'Müşteri') },
      { field: 'invoiceDate', header: t('invoiceDate', 'Fatura Tarihi') },
      { field: 'dueDate', header: t('dueDate', 'Vade Tarihi') },
      { field: 'taxAmount', header: t('taxAmount', 'KDV Tutarı') },
      { field: 'totalAmount', header: t('totalAmount', 'Toplam Tutar') },
      { field: 'status', header: t('status', 'Durum') }
    ];
    
    exportToExcel(dataToExport, columns, 'sales_invoices');
    showSuccess(t('exportSuccessExcel', { defaultValue: 'Faturalar başarıyla Excel\'e aktarıldı.' }));
  };
  
  // PDF'e aktarma
  const handleExportPdf = () => {
    const dataToExport = filteredInvoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      invoiceDate: formatDate(inv.invoiceDate),
      dueDate: formatDate(inv.dueDate),
      taxAmount: inv.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return sum + (itemTotal * item.taxRate / 100);
      }, 0),
      totalAmount: inv.totalAmount,
      status: t(inv.status, { defaultValue: inv.status })
    }));
    
    // Toplam satırı ekle
    const grandTotal = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTax = filteredInvoices.reduce((sum, inv) => {
      return sum + inv.items.reduce((itemSum, item) => {
        const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
        return itemSum + (itemTotal * item.taxRate / 100);
      }, 0);
    }, 0);
    
    dataToExport.push({
      invoiceNumber: '',
      customerName: '',
      invoiceDate: '',
      dueDate: t('grandTotal', { defaultValue: 'Genel Toplam' }),
      taxAmount: totalTax,
      totalAmount: grandTotal,
      status: ''
    });
    
    const columns = [
      { field: 'invoiceNumber', header: t('invoiceNumber', 'Fatura No') },
      { field: 'customerName', header: t('customer', 'Müşteri') },
      { field: 'invoiceDate', header: t('invoiceDate', 'Fatura Tarihi') },
      { field: 'dueDate', header: t('dueDate', 'Vade Tarihi') },
      { field: 'taxAmount', header: t('taxAmount', 'KDV Tutarı') },
      { field: 'totalAmount', header: t('totalAmount', 'Toplam Tutar') },
      { field: 'status', header: t('status', 'Durum') }
    ];
    
    exportToPdf(dataToExport, columns, 'sales_references', t('salesReferencesPdfTitle', { defaultValue: 'Satış Referansları' }));
    showSuccess(t('exportSuccessPdf', { defaultValue: 'Faturalar başarıyla PDF olarak aktarıldı.' }));
  };
  
  // Yazdırma
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t('salesReferences', 'Satış Referansları')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: none; padding: 8px; text-align: left; }
            th { background-color: ${colors.primary}; color: white; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: ${colors.primary}; }
            .date { font-size: 14px; }
            .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #666; }
            .total-row { font-weight: bold; background-color: #f5f5f5; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${t('salesReferences', 'Satış Referansları')}</div>
            <div class="date">${new Date().toLocaleDateString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>${t('invoiceNumber', 'Fatura No')}</th>
                <th>${t('customer', 'Müşteri')}</th>
                <th>${t('invoiceDate', 'Fatura Tarihi')}</th>
                <th>${t('dueDate', 'Vade Tarihi')}</th>
                <th>${t('taxAmount', 'KDV Tutarı')}</th>
                <th>${t('totalAmount', 'Toplam Tutar')}</th>
                <th>${t('status', 'Durum')}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredInvoices.map(invoice => {
                const taxAmount = invoice.items.reduce((sum, item) => {
                  const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                  return sum + (itemTotal * item.taxRate / 100);
                }, 0);
                
                return `
                  <tr>
                    <td>${invoice.invoiceNumber}</td>
                    <td>${invoice.customerName}</td>
                    <td>${formatDate(invoice.invoiceDate)}</td>
                    <td>${formatDate(invoice.dueDate)}</td>
                    <td>${formatCurrency(taxAmount)}</td>
                    <td>${formatCurrency(invoice.totalAmount)}</td>
                    <td>${t(invoice.status, { defaultValue: invoice.status })}</td>
                  </tr>
                `;
              }).join('')}
              
              <tr class="total-row">
                <td colspan="4">${t('grandTotal', 'Genel Toplam')}</td>
                <td>${formatCurrency(filteredInvoices.reduce((sum, inv) => {
                  return sum + inv.items.reduce((itemSum, item) => {
                    const itemTotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
                    return itemSum + (itemTotal * item.taxRate / 100);
                  }, 0);
                }, 0))}</td>
                <td>${formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            ${t('printDate', 'Yazdırma Tarihi')}: ${new Date().toLocaleString()}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };
  
  // Yeni fatura ekleme
  const handleAddNew = () => {
    // Yeni fatura ekleme sayfasına yönlendirme veya modal açma
    alert('Yeni fatura ekleme sayfasına yönlendirileceksiniz.');
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, color: colors.primary, fontWeight: 600 }}>
        {t('salesReferences', 'Satış Referansları')}
      </Typography>
      
      {/* Filtre ve Buton Bileşeni */}
      <Grid container sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" onClick={handleExportExcel}>
            {t('exportExcel', 'Excel\'e Aktar')}
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleExportPdf}>
            {t('exportPdf', 'PDF\'ye Aktar')}
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={handlePrint}>
            {t('print', 'Yazdır')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Button variant="contained" onClick={handleAddNew}>
            {t('addNew', 'Yeni Fatura Ekle')}
          </Button>
        </Grid>
      </Grid>
      
      {/* Fatura Tablosu */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          '& .MuiTableCell-root': { 
            border: 'none !important',
            outline: 'none !important',
            padding: { xs: 1.5, md: 2 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          },
          '& .MuiTableRow-root': {
            border: 'none !important',
            outline: 'none !important',
            '&:nth-of-type(odd)': {
              backgroundColor: 'rgba(0,0,0,0.02)'
            },
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 143, 0.04)'
            }
          },
          '& *': { 
            border: 'none !important', 
            outline: 'none !important' 
          }
        }}
      >
        <Table sx={{ border: 'none' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                {t('invoiceNumber', 'Fatura No')}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                {t('customer', 'Müşteri')}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                {t('invoiceDate', 'Fatura Tarihi')}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                {t('dueDate', 'Vade Tarihi')}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                textAlign: 'right'
              }}>
                {t('totalAmount', 'Toplam Tutar')}
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: colors.primary,
                backgroundColor: 'rgba(37, 99, 143, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 1
              }}>
                {t('status', 'Durum')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>
                  <Chip
                    label={t(invoice.status, { defaultValue: invoice.status })}
                    size="small"
                    sx={{
                      bgcolor: invoice.status === 'paid' 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : invoice.status === 'pending' 
                          ? 'rgba(255, 152, 0, 0.1)' 
                          : 'rgba(244, 67, 54, 0.1)',
                      color: invoice.status === 'paid' 
                        ? '#4caf50' 
                        : invoice.status === 'pending' 
                          ? '#ff9800' 
                          : '#f44336',
                      fontWeight: 500,
                      borderRadius: 1
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('noInvoicesFound', 'Fatura bulunamadı')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Toplam Bilgisi */}
      <Grid container sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            {t('totalInvoices', 'Toplam Fatura Sayısı')}: {filteredInvoices.length}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" fontWeight={600} color={colors.primary}>
            {t('grandTotal', 'Genel Toplam')}: {formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesReferencePage;
