import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import MainCategoriesBar from './components/layout/MainCategoriesBar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Login from './pages/Login';


// Page Imports
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import AddCustomerPage from './pages/AddCustomerPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SecurityPage from './pages/SecurityPage';
import MuiJoyExamplePage from './pages/MuiJoyExamplePage';
import NotificationsPage from './pages/NotificationsPage';
import Help from './pages/Help';
import HelpDetail from './pages/HelpDetail';
import LocationAndTaxes from './pages/LocationAndTaxes';
import BranchesPage from './pages/BranchesPage';
import MailPage from './pages/MailPage';
import SmsSettingsPage from './pages/SmsSettingsPage';
import EmailSettingsPage from './pages/EmailSettingsPage';
import CountriesPage from './pages/CountriesPage';
import RadioExamplePage from './pages/RadioExamplePage';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import PrivacyPage from './pages/PrivacyPage';
import AccordionFilterExample from './components/examples/AccordionFilterExample';
import ToggleSwitchExample from './components/examples/ToggleSwitchExample';
import WarehousesPage from './pages/WarehousesPage';
import ModularCountriesPage from './pages/ModularCountriesPage';
import ModularCitiesPage from './pages/ModularCitiesPage';
import ModularDistrictsPage from './pages/ModularDistrictsPage';
import PurchaseInvoicesPage from './pages/PurchaseInvoicesPage';
import CurrentAccountTransactionsPage from './pages/CurrentAccountTransactionsPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import ExpenseReceiptsPage from './pages/ExpenseReceiptsPage';
import ExpenseReceiptDetailPage from './pages/ExpenseReceiptDetailPage';

import CreatePurchaseInvoicePage from './pages/CreatePurchaseInvoicePage';
import SalesInvoicesListPage from './pages/sales-invoices/SalesInvoicesListPage';
import SalesInvoiceDetailPage from './pages/sales-invoices/SalesInvoiceDetailPage';
import EditSalesInvoicePage from './pages/sales-invoices/EditSalesInvoicePage';
import CreateSalesInvoicePage from './pages/sales-invoices/CreateSalesInvoicePage';
import ViewSalesInvoicePage from './pages/sales-invoices/ViewSalesInvoicePage';
import CreateReturnInvoicePage from './pages/sales-invoices/CreateReturnInvoicePage';
import PurchaseInvoiceDetailPage from './pages/purchase-invoices/PurchaseInvoiceDetailPage';

import FlagTestPage from './pages/FlagTestPage';
import DraftInvoicesPage from './pages/DraftInvoicesPage';
import DraftInvoiceDetailPage from './pages/DraftInvoiceDetailPage';

import IncomingPaymentsPage from './pages/payments/IncomingPaymentsPage';
import OutgoingPaymentDetailPage from './pages/payments/OutgoingPaymentDetailPage';
import OutgoingPaymentsPage from './pages/payments/OutgoingPaymentsPage';
import CustomerReceivablesPage from './pages/receivables/CustomerReceivablesPage';
import OverdueReceivablesPage from './pages/receivables/OverdueReceivablesPage';

import ReceivablesReportsPage from './pages/receivables/ReceivablesReportsPage';
import SafesPage from './pages/finance/SafesPage';
import SafeDetailPage from './pages/finance/safes/SafeDetailPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import ShippingListPage from './pages/ShippingListPage';
import AccountingPage from './pages/AccountingPage';
import ShipmentsPage from './pages/ShipmentsPage';
import ShippingPricesPage from './pages/ShippingPricesPage';
import GoodsAcceptancePage from './pages/shipping/GoodsAcceptancePage';
import PendingPackagesPage from './pages/shipping/PendingPackagesPage';
import SentPackagesPage from './pages/shipping/SentPackagesPage';
import AllPackagesPage from './pages/shipping/AllPackagesPage';

// Shipping Management Pages
import PendingShipmentsPage from './pages/shipping/PendingShipmentsPage';
import SentShipmentsPage from './pages/shipping/SentShipmentsPage';
import DeliveredShipmentsPage from './pages/shipping/DeliveredShipmentsPage';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MessageProvider } from './contexts/MessageContext';

// Theme
import theme from './theme';



function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <MessageProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AppWithLanguage />
          </LocalizationProvider>
        </MessageProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

const AppWithLanguage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');


  useEffect(() => {
    const handleNavigation = () => {
      if (isAuthenticated) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/') {
          localStorage.setItem('lastVisitedPage', currentPath);
        }
      }
    };
    window.addEventListener('popstate', handleNavigation);
    handleNavigation(); // Initial check
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [isAuthenticated]);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const AppLayout = () => {
    const [activeMenu, setActiveMenu] = useState('default');
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header open={sidebarOpen} onToggle={handleSidebarToggle} />
        <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} activeMenu={activeMenu} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar />
          <MainCategoriesBar setActiveMenu={setActiveMenu} />
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 2 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    );
  };

  const ProtectedRoute = () => {
    const location = useLocation();
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <AppLayout />;
  };

  const router = createBrowserRouter([
    {
      path: '/login',
      element: !isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={localStorage.getItem('lastVisitedPage') || '/dashboard'} />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        { path: '', element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'users', element: <Users /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'customers', element: <CustomersPage /> },
        { path: 'add-customer', element: <AddCustomerPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'categories', element: <CategoriesPage /> },
        { path: 'brands', element: <BrandsPage /> },
        { path: 'payments', element: <PaymentsPage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'security', element: <SecurityPage /> },
        { path: 'mui-joy-example', element: <MuiJoyExamplePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
        { path: 'help', element: <Help /> },
        { path: 'help/:topic', element: <HelpDetail /> },
        { path: 'location-and-taxes', element: <LocationAndTaxes /> },
        { path: 'branches', element: <BranchesPage /> },
        { path: 'mail', element: <MailPage /> },
        { path: 'sms-settings', element: <SmsSettingsPage /> },
        { path: 'email-settings', element: <EmailSettingsPage /> },
        { path: 'countries', element: <CountriesPage /> },
        { path: 'radio-example', element: <RadioExamplePage /> },
        { path: 'user-management', element: <UserManagementPage /> },
        { path: 'role-management', element: <RoleManagementPage /> },
        { path: 'privacy', element: <PrivacyPage /> },
        { path: 'accordion-filter-example', element: <AccordionFilterExample /> },
        { path: 'toggle-switch-example', element: <ToggleSwitchExample /> },
        { path: 'warehouses', element: <WarehousesPage /> },
        { path: 'modular-countries', element: <ModularCountriesPage /> },
        { path: 'modular-cities', element: <ModularCitiesPage /> },
        { path: 'modular-districts', element: <ModularDistrictsPage /> },
        { path: 'current-account-transactions', element: <CurrentAccountTransactionsPage /> },
        { path: 'account-details/:customerCode', element: <AccountDetailsPage /> },
        { path: 'collection-detail/:transactionId', element: <CollectionDetailPage /> },
        { path: 'outgoing-payment-detail/:transactionId', element: <OutgoingPaymentDetailPage /> },
        { path: 'purchase-invoices/new', element: <CreatePurchaseInvoicePage /> },

        { path: 'sales-invoices', element: <SalesInvoicesListPage /> },
        { path: 'sales-invoices/create', element: <CreateSalesInvoicePage /> },
        { path: 'sales-invoices/view/:id', element: <ViewSalesInvoicePage /> },
        { path: 'sales-invoices/edit/:id', element: <EditSalesInvoicePage /> },
        { path: 'sales-invoices/create-return', element: <CreateReturnInvoicePage /> },
        { path: 'draft-invoices', element: <DraftInvoicesPage /> },
        { path: 'draft-invoices/:id', element: <DraftInvoiceDetailPage /> },
        { path: 'purchase-invoices', element: <PurchaseInvoicesPage /> },
        { path: 'purchase-invoices/:id', element: <PurchaseInvoiceDetailPage /> },
        { path: 'expense-receipts', element: <ExpenseReceiptsPage /> },
        { path: 'expense-receipts/:id', element: <ExpenseReceiptDetailPage /> },


        { path: 'flag-test', element: <FlagTestPage /> },
        { path: 'payments/incoming', element: <IncomingPaymentsPage /> },
        { path: 'payments/outgoing', element: <OutgoingPaymentsPage /> },
        { path: 'receivables/customer', element: <CustomerReceivablesPage /> },
        { path: 'receivables/overdue', element: <OverdueReceivablesPage /> },

        { path: 'receivables/reports', element: <ReceivablesReportsPage /> },
        { path: 'safes', element: <SafesPage /> },
        { path: 'safes/:id', element: <SafeDetailPage /> },
        { path: 'employees', element: <EmployeesPage /> },
        { path: 'employees/:id', element: <EmployeeDetailPage /> },
        { path: 'shipping-list', element: <ShippingListPage /> },
        { path: 'accounting', element: <AccountingPage /> },
        { path: 'shipments', element: <ShipmentsPage /> },
                { path: 'shipping-prices', element: <ShippingPricesPage /> },
        { path: 'shipping/goods-acceptance', element: <GoodsAcceptancePage /> },
        { path: 'shipping/pending-packages', element: <PendingPackagesPage /> },
        { path: 'shipping/sent-packages', element: <SentPackagesPage /> },
        { path: 'shipping/all-packages', element: <AllPackagesPage /> },
        
        // Shipping Management Routes
        { path: 'shipping/pending', element: <PendingShipmentsPage /> },
        { path: 'shipping/sent', element: <SentShipmentsPage /> },
        { path: 'shipping/delivered', element: <DeliveredShipmentsPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/" /> }, // Redirect any unknown paths to dashboard
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
