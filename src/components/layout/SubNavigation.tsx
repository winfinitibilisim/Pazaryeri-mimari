import React from 'react';
import { Box, Tabs, Tab, Breadcrumbs, Typography, Link as MuiLink, Container } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Tune as TuneIcon,
  Class as ClassIcon,
  Label as LabelIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  AccountBalance as AccountBalanceIcon,
  CardGiftcard as CardGiftcardIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  Comment as CommentIcon,
  Storefront as StorefrontIcon,
  Event as EventIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  MonetizationOn as MonetizationOnIcon,
  LocalShipping as LocalShippingIcon,
  ImportExport as ImportExportIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Transform as TransformIcon,
  List as ListIcon,
  SettingsInputComponent as SettingsInputComponentIcon,
  ContactSupport as ContactSupportIcon,
  ReceiptLong as ReceiptLongIcon,
  Textsms as TextsmsIcon
} from '@mui/icons-material';

interface SubNavigationProps {
  activeMenu: string;
}

// Menü tanımları Sidebar'dan taşındı ve ikonları eklendi
const productMenuItems = [
  { text: 'Ürün Listesi', path: '/products', icon: <InventoryIcon fontSize="small" /> },
  { text: 'Ürün Seçenekleri', path: '/product-options', icon: <ListAltIcon fontSize="small" /> },
  { text: 'Kategoriler', path: '/categories', icon: <CategoryIcon fontSize="small" /> },
  { text: 'Markalar', path: '/brands', icon: <LocalOfferIcon fontSize="small" /> },
  { text: 'Özellikler', path: '/features', icon: <TuneIcon fontSize="small" /> },
  { text: 'Ürün Sınıfları', path: '/product-classes', icon: <ClassIcon fontSize="small" /> },
  { text: 'Kullanılabilir Etiketler', path: '/available-tags', icon: <LabelIcon fontSize="small" /> },
  { text: 'İkonlar', path: '/icons', icon: <EmojiEmotionsIcon fontSize="small" /> },
];

const accountingMenuItems = [
  { text: 'Siparişler', path: '/orders', icon: <ShoppingCartIcon fontSize="small" /> },
  { text: 'Müşteriler', path: '/customers', icon: <PeopleIcon fontSize="small" /> },
  { text: 'Satış Faturaları', path: '/sales-invoices', icon: <ReceiptIcon fontSize="small" /> },
  { text: 'Taslak Faturalar', path: '/draft-invoices', icon: <DescriptionIcon fontSize="small" /> },
  { text: 'Alış Faturaları', path: '/purchase-invoices', icon: <ReceiptIcon fontSize="small" /> },
  { text: 'Çalışanlar', path: '/employees', icon: <WorkIcon fontSize="small" /> },
  { text: 'Gider Fişleri', path: '/expense-receipts', icon: <ReceiptIcon fontSize="small" /> },
  { text: 'Müşteri Alacakları', path: '/receivables/customer', icon: <TrendingUpIcon fontSize="small" /> },
  { text: 'Vadesi Geçen Alacaklar', path: '/receivables/overdue', icon: <WarningIcon fontSize="small" /> },
  { text: 'Kasalar', path: '/safes', icon: <AccountBalanceIcon fontSize="small" /> },
];

const promotionsMenuItems = [
  { text: 'İndirimler', path: '/promotions/discounts', icon: <LocalOfferIcon fontSize="small" /> },
  { text: 'A ürün + B ürün indirimi', path: '/promotions/ab-discount', icon: <LocalOfferIcon fontSize="small" /> },
  { text: 'X Ürün Al Y Öde', path: '/promotions/gift', icon: <CardGiftcardIcon fontSize="small" /> },
  { text: 'Kuponlar', path: '/promotions/coupons', icon: <ConfirmationNumberIcon fontSize="small" /> },
  { text: 'Değerlendirmeler & Yorumlar', path: '/promotions/reviews', icon: <CommentIcon fontSize="small" /> },
  { text: 'Vitrin Ürünleri', path: '/promotions/showcase', icon: <StorefrontIcon fontSize="small" /> },
  { text: 'Önerilen Ürünler', path: '/promotions/recommended', icon: <EventIcon fontSize="small" /> },
  { text: 'İstek Listesi', path: '/promotions/wishlist', icon: <FavoriteBorderIcon fontSize="small" /> },
];

const reportsMenuItems = [
  { text: 'Satıcı Mağaza Raporları', path: '/reports/seller', icon: <StorefrontIcon fontSize="small" /> },
  { text: 'Bağımsız Temsilci Raporları', path: '/reports/representative', icon: <PeopleIcon fontSize="small" /> },
  { text: 'Finansal Raporlar', path: '/reports/financial', icon: <MonetizationOnIcon fontSize="small" /> },
  { text: 'Operasyonel Raporlar', path: '/reports/operational', icon: <LocalShippingIcon fontSize="small" /> },
  { text: 'Görselleştirilmiş Raporlar', path: '/reports/visualized', icon: <PieChartIcon fontSize="small" /> },
];

const xmlMenuItems = [
  { text: 'XML Dashboard', path: '/xml-transfer/dashboard', icon: <ImportExportIcon fontSize="small" /> },
  { text: 'XML İçe Aktar (Import)', path: '/xml-transfer/import', icon: <CloudUploadIcon fontSize="small" /> },
  { text: 'XML Dışa Aktar (Export)', path: '/xml-transfer/export', icon: <CloudDownloadIcon fontSize="small" /> },
  { text: 'Eşleştirme ve Şablonlar', path: '/xml-transfer/mappings', icon: <TransformIcon fontSize="small" /> },
  { text: 'Geçmiş & Loglar', path: '/xml-transfer/logs', icon: <ListIcon fontSize="small" /> },
];

const erpMenuItems = [
  { text: 'Bağlantı Özeti', path: '/erp-crm/dashboard', icon: <HomeIcon fontSize="small" /> },
  { text: 'ERP Entegrasyonları', path: '/erp-crm/erp-integrations', icon: <SettingsInputComponentIcon fontSize="small" /> },
  { text: 'CRM Entegrasyonları', path: '/erp-crm/crm-integrations', icon: <ContactSupportIcon fontSize="small" /> },
  { text: 'E-Fatura & Mali İşlemler', path: '/erp-crm/accounting-automations', icon: <ReceiptLongIcon fontSize="small" /> },
  { text: 'İletişim & Pazarlama Logları', path: '/erp-crm/communication-logs', icon: <TextsmsIcon fontSize="small" /> },
];

const SubNavigation: React.FC<SubNavigationProps> = ({ activeMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getSubMenus = () => {
    const currentPath = location.pathname;

    if (activeMenu === 'products' || currentPath.startsWith('/products') || currentPath.startsWith('/categories') || currentPath.startsWith('/brands')) {
      return productMenuItems;
    }
    if (activeMenu === 'promotions' || currentPath.startsWith('/promotions')) {
      return promotionsMenuItems;
    }
    if (activeMenu === 'sales' || currentPath.startsWith('/orders') || currentPath.startsWith('/customers') || currentPath.startsWith('/sales-invoices')) {
      return accountingMenuItems;
    }
    if (activeMenu === 'reports' || currentPath.startsWith('/reports') || currentPath.startsWith('/receivables/reports')) {
      return reportsMenuItems;
    }
    if (activeMenu === 'erp' || currentPath.startsWith('/erp-crm')) {
      return erpMenuItems;
    }
    if (activeMenu === 'xml' || currentPath.startsWith('/xml-transfer')) {
      return xmlMenuItems;
    }
    return productMenuItems; // fallback
  };

  const tabs = getSubMenus();

  // Aktif tab'i belirle (eğer path tam eşleşmiyorsa, startsWith vs bakılabilir)
  let activeTabIndex = tabs.findIndex(tab => location.pathname === tab.path);
  if (activeTabIndex === -1) {
    // Exact match yoksa fallback
    activeTabIndex = tabs.findIndex(tab => location.pathname.startsWith(tab.path));
    if (activeTabIndex === -1) activeTabIndex = 0; // Default none selected if wanted, or 0
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(tabs[newValue].path);
  };

  return (
    <Box sx={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea', pt: 1, pb: 0 }}>
      <Container maxWidth="xl">
        <Box sx={{ px: 2, pt: 1 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <MuiLink component={Link} to="/" color="inherit" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {tabs[activeTabIndex]?.text || 'Sayfa'}
            </Typography>
          </Breadcrumbs>
          
          <Tabs
            value={activeTabIndex !== -1 ? activeTabIndex : false}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              '& .MuiTabs-indicator': {
                backgroundColor: '#2980b9',
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.text}
                icon={tab.icon}
                iconPosition="start"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTabIndex === index ? 600 : 500,
                  fontSize: '0.9rem',
                  minHeight: 48,
                  padding: '12px 16px',
                  color: activeTabIndex === index ? '#2980b9' : '#5c6b7a',
                  '&.Mui-selected': {
                    color: '#2980b9',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginRight: 1,
                    marginBottom: 0
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
};

export default SubNavigation;
