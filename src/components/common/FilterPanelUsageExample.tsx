import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GridOnIcon from '@mui/icons-material/GridOn';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FilterPanel from './FilterPanel';
import ExportButton from './ExportButton';
import { colors } from '../../theme/colors';

// Örnek filtre yapılandırması
const exampleFilterConfig = [
  {
    id: 'name',
    label: 'İsim',
    type: 'text' as const
  },
  {
    id: 'status',
    label: 'Durum',
    type: 'select' as const,
    options: [
      { value: '', label: 'Tümü' },
      { value: 'active', label: 'Aktif' },
      { value: 'inactive', label: 'Pasif' },
      { value: 'pending', label: 'Beklemede' }
    ]
  },
  {
    id: 'date',
    label: 'Tarih',
    type: 'date' as const
  },
  {
    id: 'amount',
    label: 'Tutar',
    type: 'numberrange' as const
  }
];

/**
 * FilterPanel bileşeninin nasıl kullanılacağını gösteren örnek bileşen
 */
const FilterPanelUsageExample: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // Arama terimi değiştiğinde çağrılacak fonksiyon
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log('Arama terimi değişti:', value);
  };

  // Filtre değerleri değiştiğinde çağrılacak fonksiyon
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Filtreler değişti:', filters);
    // Burada API çağrısı yapabilir veya yerel filtreleme yapabilirsiniz
  };

  // Excel'e aktarma işlemi
  const handleExportExcel = () => {
    console.log('Excel\'e aktarılıyor...');
    // Excel'e aktarma işlemi burada yapılabilir
  };

  // PDF'e aktarma işlemi
  const handleExportPdf = () => {
    console.log('PDF\'e aktarılıyor...');
    // PDF'e aktarma işlemi burada yapılabilir
  };

  // Yeni öğe ekleme işlemi
  const handleAddNew = () => {
    console.log('Yeni öğe ekleniyor...');
    // Yeni öğe ekleme işlemi burada yapılabilir
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <h2>FilterPanel Kullanım Örneği</h2>
      
      {/* FilterPanel bileşeni */}
      <FilterPanel
        title="Örnek Filtreler"
        searchPlaceholder="Ara..."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterFields={exampleFilterConfig}
        onFilterChange={handleFilterChange}
        actionButtons={
          <>
            <ExportButton
              onClick={handleExportExcel}
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
              onClick={handleExportPdf}
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
            
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                height: 36,
                whiteSpace: 'nowrap',
                bgcolor: colors.primary,
                '&:hover': { bgcolor: colors.primaryDark }
              }}
            >
              {t('add')}
            </Button>
          </>
        }
      />
      
      <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
        <h3>Kullanım Talimatları</h3>
        <p>FilterPanel bileşeni, tüm listeleme sayfalarında kullanılabilecek merkezi bir filtre bileşenidir.</p>
        <p>Özellikler:</p>
        <ul>
          <li><strong>title:</strong> Filtre paneli başlığı</li>
          <li><strong>searchPlaceholder:</strong> Arama kutusu placeholder metni</li>
          <li><strong>searchTerm:</strong> Arama terimi değeri (state'ten gelir)</li>
          <li><strong>onSearchChange:</strong> Arama terimi değiştiğinde çağrılacak fonksiyon</li>
          <li><strong>filterFields:</strong> Filtre alanları konfigürasyonu</li>
          <li><strong>onFilterChange:</strong> Filtre değerleri değiştiğinde çağrılacak fonksiyon</li>
          <li><strong>actionButtons:</strong> Filtre panelinin sağ tarafında gösterilecek ek butonlar</li>
          <li><strong>defaultFilterPanelOpen:</strong> Filtre panelinin başlangıçta açık olup olmayacağı</li>
          <li><strong>initialFilterValues:</strong> Filtre panelinin başlangıç değerleri</li>
        </ul>
      </Box>
    </Box>
  );
};

export default FilterPanelUsageExample;
