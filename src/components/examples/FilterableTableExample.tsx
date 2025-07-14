import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Box, Chip, Typography } from '@mui/material';
import FilterableTable, { TableColumn } from '../common/FilterableTable';
import { FilterOption } from '../common/TableFilter';
import LoginIcon from '@mui/icons-material/Login';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Örnek veri tipi
interface LogEntry {
  id: string;
  action: string;
  actionType: string;
  date: string;
  description: string;
  ipAddress: string;
  browser: string;
  device: string;
}

// Örnek veri
const sampleData: LogEntry[] = [
  {
    id: '1',
    action: 'Giriş yapıldı',
    actionType: 'login',
    date: '2023-05-22 14:30',
    description: 'Kullanıcı başarıyla giriş yaptı',
    ipAddress: '192.168.1.1',
    browser: 'Chrome',
    device: 'Windows'
  },
  {
    id: '2',
    action: 'Ürün eklendi',
    actionType: 'product_added',
    date: '2023-05-22 15:45',
    description: 'Yeni ürün: Laptop',
    ipAddress: '192.168.1.1',
    browser: 'Chrome',
    device: 'Windows'
  },
  {
    id: '3',
    action: 'Kod: A-98',
    actionType: 'code_updated',
    date: '2023-05-23 09:15',
    description: 'Ürün kodu güncellendi: A-98',
    ipAddress: '192.168.1.5',
    browser: 'Firefox',
    device: 'MacOS'
  },
  {
    id: '4',
    action: 'Ürün silindi',
    actionType: 'product_deleted',
    date: '2023-05-23 11:30',
    description: 'Ürün silindi: Klavye',
    ipAddress: '192.168.1.5',
    browser: 'Firefox',
    device: 'MacOS'
  },
  {
    id: '5',
    action: 'Giriş yapıldı',
    actionType: 'login',
    date: '2023-05-24 08:45',
    description: 'Yönetici giriş yaptı',
    ipAddress: '192.168.1.10',
    browser: 'Safari',
    device: 'iOS'
  },
  {
    id: '6',
    action: 'Ürün eklendi',
    actionType: 'product_added',
    date: '2023-05-24 10:15',
    description: 'Yeni ürün: Mouse',
    ipAddress: '192.168.1.10',
    browser: 'Safari',
    device: 'iOS'
  },
  {
    id: '7',
    action: 'Kod: A-98',
    actionType: 'code_updated',
    date: '2023-05-24 11:30',
    description: 'Ürün kodu güncellendi: A-98',
    ipAddress: '192.168.1.15',
    browser: 'Edge',
    device: 'Windows'
  },
  {
    id: '8',
    action: 'Ürün silindi',
    actionType: 'product_deleted',
    date: '2023-05-24 13:45',
    description: 'Ürün silindi: Monitor',
    ipAddress: '192.168.1.15',
    browser: 'Edge',
    device: 'Windows'
  }
];

// Filtre seçenekleri
const filterOptions: FilterOption[] = [
  {
    id: 'login',
    label: 'Giriş yapıldı',
    color: '#ffffff',
    backgroundColor: '#2196f3',
    icon: <LoginIcon />
  },
  {
    id: 'product_added',
    label: 'Ürün eklendi',
    color: '#ffffff',
    backgroundColor: '#4caf50',
    icon: <AddCircleIcon />
  },
  {
    id: 'code_updated',
    label: 'Kod: A-98',
    color: '#ffffff',
    backgroundColor: '#ff9800',
    icon: <EditIcon />
  },
  {
    id: 'product_deleted',
    label: 'Ürün silindi',
    color: '#ffffff',
    backgroundColor: '#f50057',
    icon: <DeleteIcon />
  }
];

const FilterableTableExample: React.FC = () => {
  const [data, setData] = useState<LogEntry[]>(sampleData);

  // Tablo sütunları tanımı
  const columns: TableColumn<LogEntry>[] = [
    {
      id: 'action',
      label: 'İşlem',
      render: (row) => {
        const option = filterOptions.find(opt => opt.id === row.actionType);
        return (
          <Chip
            label={row.action}
            sx={{
              backgroundColor: option?.backgroundColor || '#757575',
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />
        );
      }
    },
    {
      id: 'date',
      label: 'Tarih & Saat',
      render: (row) => row.date
    },
    {
      id: 'description',
      label: 'Açıklama',
      render: (row) => row.description
    },
    {
      id: 'ipAddress',
      label: 'IP Adresi',
      render: (row) => row.ipAddress
    },
    {
      id: 'browser',
      label: 'Tarayıcı',
      render: (row) => row.browser
    },
    {
      id: 'device',
      label: 'Cihaz',
      render: (row) => row.device
    }
  ];

  // Yenileme işlemi
  const handleRefresh = () => {
    // Gerçek uygulamada burada API çağrısı yapılabilir
    setData([...sampleData]);
  };

  // NotificationContext'i kullan
  const notifications = useNotifications();

  // Dışa aktarma işlemi
  const handleExport = () => {
    // Gerçek uygulamada burada dışa aktarma işlemi yapılabilir
    notifications.showSuccess('Veriler dışa aktarılıyor...', 'generic');
  };

  // Yeni ürün ekleme işlemi
  const handleAddItem = () => {
    // Gerçek uygulamada burada yeni ürün ekleme formu açılabilir
    notifications.show('Yeni ürün ekleme formu açılıyor...', { severity: 'info' });
  };

  // Ürün düzenleme işlemi
  const handleEditItem = (item: LogEntry) => {
    // Gerçek uygulamada burada ürün düzenleme formu açılabilir
    notifications.showUpdateSuccess(`"${item.action}" kaydı düzenleniyor...`);
  };

  // Yazdırma işlemi
  const handlePrint = () => {
    // Gerçek uygulamada burada yazdırma işlemi yapılabilir
    notifications.show('Tablo yazdırılıyor...', { severity: 'info' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Filtrelenebilir Tablo Örneği
      </Typography>
      
      <FilterableTable
        title="Sistem Logları"
        data={data}
        columns={columns}
        filterOptions={filterOptions}
        filterField="actionType"
        searchFields={['action', 'description', 'ipAddress', 'browser', 'device']}
        rowsPerPage={5}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onPrint={handlePrint}
        filterTitle="İşlem Türü"
        showAddButton={true}
        addButtonLabel="Yeni Kayıt Ekle"
        onAdd={handleAddItem}
        showEditButton={true}
        onEdit={handleEditItem}
        showPrintButton={true}
      />
    </Box>
  );
};

export default FilterableTableExample;
