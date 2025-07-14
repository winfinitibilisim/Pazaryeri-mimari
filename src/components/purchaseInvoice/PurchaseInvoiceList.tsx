import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  GridOn as GridOnIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import AccordionFilter from '../common/AccordionFilter';
import ConfirmationDialog from '../common/ConfirmationDialog';
import ExportButton from '../common/ExportButton';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatCurrency, formatDate, exportToExcel, exportToPdf } from '../../utils/exportUtils';
import { colors } from '../../theme/colors';
import { getPurchaseInvoiceFilterConfig } from './PurchaseInvoiceFilterConfig';

// Satın alma faturası için tip tanımı
interface PurchaseInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  taxRate?: number;
  discount?: number;
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  supplierName: string;
  supplierId?: string;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'canceled';
  paymentMethod: string;
  notes?: string;
  items: PurchaseInvoiceItem[];
  billingAddress?: string;
  shippingAddress?: string;
}

// Filtre tipi
interface PurchaseInvoiceFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  supplierName?: string;
  dateStart?: string;
  dateEnd?: string;
  amountMin?: number;
  amountMax?: number;
  invoiceDateStart?: string;
  invoiceDateEnd?: string;
}

// Bileşen props tanımı
interface PurchaseInvoiceListProps {
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

// Durum renk yardımcı fonksiyonu
const getStatusColor = (status: string): { bg: string; text: string } => {
  switch (status) {
    case 'paid':
      return { bg: '#e8f5e9', text: '#2e7d32' }; // Yeşil
    case 'pending':
      return { bg: '#fff8e1', text: '#f57c00' }; // Turuncu
    case 'overdue':
      return { bg: '#ffebee', text: '#c62828' }; // Kırmızı
    case 'draft':
      return { bg: '#e3f2fd', text: '#1565c0' }; // Mavi
    case 'canceled':
      return { bg: '#f5f5f5', text: '#757575' }; // Gri
    default:
      return { bg: '#f5f5f5', text: '#757575' }; // Varsayılan gri
  }
};

// Örnek veri
const mockInvoices: PurchaseInvoice[] = [
  {
    id: '1',
    invoiceNumber: 'PUR-2023-001',
    invoiceDate: '2023-01-15',
    dueDate: '2023-02-15',
    supplierName: 'ABC Tedarikçi Ltd.',
    supplierId: '1',
    totalAmount: 2500.75,
    status: 'paid',
    paymentMethod: 'Banka Transferi',
    notes: 'Ofis malzemeleri alımı',
    items: [
      { id: '1', description: 'Ofis Kağıdı A4', quantity: 10, price: 120, total: 1200 },
      { id: '2', description: 'Toner Kartuşu', quantity: 2, price: 650.375, total: 1300.75 }
    ],
    billingAddress: 'Merkez Mah. Atatürk Cad. No:1, İstanbul',
    shippingAddress: 'Merkez Mah. Atatürk Cad. No:1, İstanbul'
  },
  {
    id: '2',
    invoiceNumber: 'PUR-2023-002',
    invoiceDate: '2023-02-05',
    dueDate: '2023-03-05',
    supplierName: 'XYZ Toptan A.Ş.',
    supplierId: '2',
    totalAmount: 1850.00,
    status: 'pending',
    paymentMethod: 'Kredi Kartı',
    notes: 'IT ekipmanları',
    items: [
      { id: '3', description: 'Klavye', quantity: 5, price: 120, total: 600 },
      { id: '4', description: 'Mouse', quantity: 5, price: 90, total: 450 },
      { id: '5', description: 'Monitör', quantity: 2, price: 400, total: 800 }
    ],
    billingAddress: 'Yeni Mah. İstiklal Cad. No:42, Ankara',
    shippingAddress: 'Yeni Mah. İstiklal Cad. No:42, Ankara'
  },
  {
    id: '3',
    invoiceNumber: 'PUR-2023-003',
    invoiceDate: '2023-02-20',
    dueDate: '2023-03-20',
    supplierName: 'Mega Tedarik Ltd.',
    supplierId: '3',
    totalAmount: 3750.50,
    status: 'overdue',
    paymentMethod: 'Çek',
    notes: 'Hammadde alımı',
    items: [
      { id: '6', description: 'Çelik Levha', quantity: 10, price: 250, total: 2500 },
      { id: '7', description: 'Alüminyum Profil', quantity: 25, price: 50.02, total: 1250.50 }
    ],
    billingAddress: 'Sanayi Mah. Fabrika Sok. No:15, İzmir',
    shippingAddress: 'Sanayi Mah. Fabrika Sok. No:15, İzmir'
  },
  {
    id: '4',
    invoiceNumber: 'PUR-2023-004',
    invoiceDate: '2023-03-10',
    dueDate: '2023-04-10',
    supplierName: 'Global İthalat A.Ş.',
    supplierId: '4',
    totalAmount: 5200.25,
    status: 'draft',
    paymentMethod: 'Havale',
    notes: 'Yedek parça siparişi',
    items: [
      { id: '8', description: 'Motor Parçaları', quantity: 1, price: 3200.25, total: 3200.25 },
      { id: '9', description: 'Elektronik Devre', quantity: 4, price: 500, total: 2000 }
    ],
    billingAddress: 'İthalat Mah. Dış Ticaret Cad. No:101, İstanbul',
    shippingAddress: 'İthalat Mah. Dış Ticaret Cad. No:101, İstanbul'
  },
  {
    id: '5',
    invoiceNumber: 'PUR-2023-005',
    invoiceDate: '2023-03-25',
    dueDate: '2023-04-25',
    supplierName: 'Teknik Malzeme Ltd.',
    supplierId: '5',
    totalAmount: 980.00,
    status: 'canceled',
    paymentMethod: 'Nakit',
    notes: 'İptal edilen sipariş',
    items: [
      { id: '10', description: 'Teknik Çizim Kağıdı', quantity: 20, price: 15, total: 300 },
      { id: '11', description: 'Teknik Kalem Seti', quantity: 8, price: 85, total: 680 }
    ],
    billingAddress: 'Teknik Mah. Malzeme Sok. No:55, Bursa',
    shippingAddress: 'Teknik Mah. Malzeme Sok. No:55, Bursa'
  }
];

const PurchaseInvoiceList: React.FC<PurchaseInvoiceListProps> = ({ onAddNew, onEdit, onView }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSuccess, showError } = useNotifications();
  
  // Temel state'ler
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<PurchaseInvoice[]>(mockInvoices);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filter, setFilter] = useState<PurchaseInvoiceFilter>({});
  // Menü kaldırıldığı için anchorEl state'i kaldırıldı
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  // Silme işlemi için state'ler
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceToDeleteId, setInvoiceToDeleteId] = useState<string | null>(null);
  
  
  // Silme işlemi - Bu fonksiyon artık yukarıda tanımlandı

  const confirmDeleteInvoice = () => {
    if (invoiceToDeleteId) {
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceToDeleteId));
      setFilteredInvoices(filteredInvoices.filter(invoice => invoice.id !== invoiceToDeleteId));
      showSuccess(t('invoiceDeletedSuccess'));
      setDialogOpen(false);
      setInvoiceToDeleteId(null);
    }
  };
  
  // Doğrudan işlem fonksiyonları
  const handleView = (invoiceId: string) => {
    onView(invoiceId);
  };
  
  const handleEdit = (invoiceId: string) => {
    onEdit(invoiceId);
  };
  
  const handleDeleteClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setDialogOpen(true);
  };

  // Arama ve filtreleme işlemi
  useEffect(() => {
    let result = [...invoices];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(lowerSearchTerm) ||
        invoice.supplierName.toLowerCase().includes(lowerSearchTerm) ||
        invoice.status.toLowerCase().includes(lowerSearchTerm) ||
        invoice.paymentMethod.toLowerCase().includes(lowerSearchTerm) ||
        (invoice.notes && invoice.notes.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Durum filtresi
    if (filter.status) {
      result = result.filter(invoice => invoice.status === filter.status);
    }
    
    // Fatura tarihi aralığı filtresi
    if (filter.invoiceDateStart && filter.invoiceDateEnd) {
      const startDate = new Date(filter.invoiceDateStart);
      const endDate = new Date(filter.invoiceDateEnd);
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }
    
    // Tutar aralığı filtresi
    if (filter.amountMin !== undefined && filter.amountMax !== undefined) {
      result = result.filter(invoice => 
        invoice.totalAmount >= filter.amountMin! && invoice.totalAmount <= filter.amountMax!
      );
    }
    
    // Tedarikçi adı filtresi
    if (filter.supplierName) {
      result = result.filter(invoice => 
        invoice.supplierName.toLowerCase().includes(filter.supplierName!.toLowerCase())
      );
    }
    
    setFilteredInvoices(result);
  }, [invoices, searchTerm, filter]);

  // Sayfalama işlemleri
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtre paneli açma/kapama
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  // Filtre değişiklikleri
  const handleFilterChange = (filterData: PurchaseInvoiceFilter) => {
    setFilter(filterData);
    setPage(0);
  };

  // Export fonksiyonu (Excel veya PDF)
  const handleExport = (type: 'excel' | 'pdf') => {
    try {
      // KDV tutarını hesapla ve veriyi hazırla
      const dataToExport = filteredInvoices.map(inv => {
        // KDV tutarını hesapla (toplam KDV tutarı)
        const taxAmount = inv.items?.reduce((sum, item) => {
          const itemTotal = item.quantity * item.price * (1 - (item.discount || 0) / 100);
          return sum + (itemTotal * (item.taxRate || 0) / 100);
        }, 0) || 0;
        
        return {
          ...inv,
          taxAmount: taxAmount // KDV tutarı ekleniyor
        };
      });
      
      // Toplam KDV tutarını hesapla
      const totalTaxAmount = dataToExport.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
      
      // Toplam satırı ekle
      if (dataToExport.length > 0) {
        const totalRow = {
          id: 'total',
          invoiceNumber: '',
          supplierName: '',
          invoiceDate: '',
          dueDate: t('grandTotal', 'Genel Toplam'),
          taxAmount: totalTaxAmount,
          totalAmount: dataToExport.reduce((sum, inv) => sum + inv.totalAmount, 0),
          status: 'paid' as 'paid' | 'pending' | 'overdue' | 'draft' | 'canceled',
          paymentMethod: '',
          items: [],
          supplierId: ''
        };
        dataToExport.push(totalRow);
      }
      
      const columns = [
        { field: 'invoiceNumber', header: t('invoiceNumber', 'Fatura No') },
        { field: 'supplierName', header: t('supplierName', 'Tedarikçi') },
        { field: 'invoiceDate', header: t('invoiceDate', 'Fatura Tarihi') },
        { field: 'dueDate', header: t('dueDate', 'Vade Tarihi') },
        { field: 'taxAmount', header: t('taxAmount', 'KDV Tutarı') },
        { field: 'totalAmount', header: t('totalAmount', 'Toplam Tutar') },
        { field: 'status', header: t('status', 'Durum') }
      ];

      if (type === 'excel') {
        exportToExcel(dataToExport, columns, 'purchase_invoices');
      } else {
        exportToPdf(dataToExport, columns, 'purchase_invoices', t('purchaseInvoices', 'Alış Faturaları'));
      }
      showSuccess(t('exportSuccess', 'Export successful!'));
    } catch (error) {
      console.error(`${type.toUpperCase()} export error:`, error);
      showError(t('exportError', 'Export failed!'));
    }
  };

  // Yazdırma fonksiyonu
  const handlePrint = () => {
    try {
      window.print();
      showSuccess(t('printSuccess', 'Print job sent successfully!'));
    } catch (error) {
      console.error('Print error:', error);
      showError(t('printError', 'Print failed!'));
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Kontrol Paneli */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, boxShadow: 2, mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: { xs: 1, sm: 2 }, 
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
      }}>
        {/* Sol Taraf - Arama ve Filtre */}
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          alignItems: 'center', 
          width: { xs: '100%', sm: 'auto' } 
        }}>
          {/* Arama Kutusu */}
          <TextField
            variant="outlined"
            size="small"
            placeholder={t('searchInvoices') || 'Fatura No.'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
          
          {/* Filtre Butonu */}
          <IconButton
            onClick={toggleFilterPanel}
            size="small"
            sx={{ 
              color: colors.primary,
              border: `1px solid ${colors.grey300}`,
              borderRadius: 1,
              p: 1,
              '&:hover': {
                borderColor: colors.primary,
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
            aria-label={t('filter')}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Sağ Taraf - Export Butonları ve Fatura Ekle */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          justifyContent: { xs: 'flex-end', sm: 'flex-end' },
          mt: { xs: 1, sm: 0 }
        }}>
          <ExportButton
            onClick={() => handleExport('excel')}
            size="small"
            label={t('exportToExcel')}
            customIcon={<GridOnIcon sx={{ color: '#217346', fontSize: '1rem' }} />}
            sx={{
              height: 36,
              whiteSpace: 'nowrap',
              minWidth: { xs: 'auto', sm: 'auto' },
              px: { xs: 1, sm: 1.5 },
              fontSize: '0.8rem',
              border: `1px solid ${colors.grey300}`,
              color: colors.text.primary,
              bgcolor: 'white',
              '&:hover': { bgcolor: colors.grey100 }
            }}
          />
          
          <ExportButton
            onClick={() => handleExport('pdf')}
            size="small"
            label={t('exportToPdf')}
            customIcon={<PictureAsPdfIcon sx={{ color: '#e53935', fontSize: '1rem' }} />}
            sx={{
              height: 36,
              whiteSpace: 'nowrap',
              minWidth: { xs: 'auto', sm: 'auto' },
              px: { xs: 1, sm: 1.5 },
              fontSize: '0.8rem',
              border: `1px solid ${colors.grey300}`,
              color: colors.text.primary,
              bgcolor: 'white',
              '&:hover': { bgcolor: colors.grey100 }
            }}
          />
          
          {/* Add Invoice butonu kaldırıldı */}
        </Box>
      </Box>

      {/* Filtre Paneli - Açılır/Kapanır */}
      {filterPanelOpen && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <AccordionFilter
            title={t('purchaseInvoicesFilter', 'Alış Faturaları Filtresi')}
            fields={getPurchaseInvoiceFilterConfig(t)}
            onSearch={handleFilterChange}
            initialValues={{}}
          />
        </Box>
      )}
    </Paper>
    
    {/* Mobil uyarısı - Yatay kaydırma için */}
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        alignItems: 'center', 
        gap: 1, 
        mb: 1,
        px: 1,
        color: 'text.secondary',
        fontSize: '0.75rem'
      }}
    >
      <Box 
        component="span" 
        sx={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          animation: 'swipeAnimation 1.5s infinite',
          '@keyframes swipeAnimation': {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(10px)' },
            '100%': { transform: 'translateX(0)' }
          }
        }}
      >
        <span>&#8596;</span> {/* Yatay ok işareti */}
      </Box>
      <Typography variant="caption">{t('swipeToSeeMore') || 'Daha fazlası için sağa-sola kaydırın'}</Typography>
    </Box>

    {/* Mobil uyarısı - Yatay kaydırma için */}
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' }, 
        alignItems: 'center', 
        gap: 1, 
        mb: 1,
        px: 1,
        color: 'text.secondary',
        fontSize: '0.75rem'
      }}
    >
      <Box 
        sx={{ 
          animation: {
            xs: 'swipe 1.5s infinite',
            md: 'none'
          },
          '@keyframes swipe': {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(10px)' },
            '100%': { transform: 'translateX(0)' }
          }
        }}
      >
        <span>&#8596;</span> {/* Yatay ok işareti */}
      </Box>
      <Typography variant="caption">{t('swipeToSeeMore') || 'Daha fazlası için sağa-sola kaydırın'}</Typography>
    </Box>
    
    {/* Yatay kaydırılabilir tablo konteyneri */}
    <Box 
      sx={{ 
        width: '100%', 
        overflow: 'auto',
        flexGrow: 1,
        WebkitOverflowScrolling: 'touch', /* iOS için daha iyi kaydırma */
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '10px',
        },
      }}
    >
    <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Table 
        sx={{ 
          minWidth: 750, 
          borderCollapse: 'collapse',
          '& .MuiTableCell-root': {
            border: 'none',
            borderBottom: '1px solid #f0f0f0'
          },
          '& .MuiTableRow-root': {
            border: 'none'
          },
          '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root': {
            borderBottom: '1px solid #e0e0e0'
          }
        }} 
        aria-labelledby="tableTitle" 
        size={isMobile ? "small" : "medium"}
      >
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell 
              sx={{ 
                fontWeight: 'bold', 
                color: colors.text.primary, 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                position: 'sticky',
                left: 0,
                backgroundColor: '#f5f5f5',
                zIndex: 1
              }}
            >
              {t('invoiceNumber', 'Fatura No')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{t('customer', 'Müşteri')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{t('invoiceDate', 'Fatura Tarihi')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{t('dueDate', 'Son Ödeme Tarihi')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'right' }}>{t('taxAmount', 'KDV Tutarı')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'right' }}>{t('totalAmount', 'Toplam Tutar')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'center' }}>{t('status', 'Fatura Durumu')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'center' }}>{t('actions', 'Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvoices.length > 0 ? (
            (rowsPerPage > 0
              ? filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredInvoices
            ).map((invoice) => {
              const statusColor = getStatusColor(invoice.status);
              return (
                <TableRow
                  hover
                  key={invoice.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'white',
                      zIndex: 1
                    }}
                  >
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{invoice.supplierName || '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{invoice.invoiceDate ? formatDate(invoice.invoiceDate) : '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'right' }}>
                    {formatCurrency(invoice.items?.reduce((sum, item) => {
                      const itemTotal = item.quantity * item.price * (1 - (item.discount || 0) / 100);
                      return sum + (itemTotal * (item.taxRate || 0) / 100);
                    }, 0) || 0)}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'right' }}>
                    {formatCurrency(invoice.totalAmount)}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'center' }}>
                    <Chip
                      label={t(invoice.status)}
                      sx={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'center', px: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        aria-label={t('view')}
                        size="small"
                        onClick={() => handleView(invoice.id)}
                        sx={{ color: colors.primary }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        aria-label={t('edit')}
                        size="small"
                        onClick={() => handleEdit(invoice.id)}
                        sx={{ color: colors.primary }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        aria-label={t('delete')}
                        size="small"
                        onClick={() => handleDeleteClick(invoice.id)}
                        sx={{ color: colors.error }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="textSecondary">
                  {t('noInvoicesFound')}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: t('all'), value: -1 }]}
        component="div"
        count={filteredInvoices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} / ${count !== -1 ? count : t('moreThan')}`
        }
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows, .MuiTablePagination-select, .MuiTablePagination-actions': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      />
      </TableContainer>
    </Box>
      
      {/* Onay Diyaloğu */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDeleteInvoice}
        title={t('confirmDeleteTitle')}
        message={t('confirmDeleteContent', {
          invoiceNumber: invoices.find((inv) => inv.id === invoiceToDeleteId)?.invoiceNumber || ''
        })}
      />
    </Box>
  );
};

export default PurchaseInvoiceList;
