import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import AccordionFilter from './AccordionFilter';
import { FilterField } from './AccordionFilter';
import { colors } from '../../theme/colors';

export interface FilterPanelProps {
  /**
   * Filtre paneli başlığı
   */
  title?: string;
  
  /**
   * Arama kutusu placeholder metni
   */
  searchPlaceholder?: string;
  
  /**
   * Arama terimi değeri
   */
  searchTerm: string;
  
  /**
   * Arama terimi değiştiğinde çağrılacak fonksiyon
   */
  onSearchChange: (value: string) => void;
  
  /**
   * Filtre alanları konfigürasyonu
   */
  filterFields: FilterField[];
  
  /**
   * Filtre değerleri değiştiğinde çağrılacak fonksiyon
   */
  onFilterChange: (filters: Record<string, any>) => void;
  
  /**
   * Filtre panelinin sağ tarafında gösterilecek ek butonlar
   */
  actionButtons?: React.ReactNode;
  
  /**
   * Filtre panelinin başlangıçta açık olup olmayacağı
   */
  defaultFilterPanelOpen?: boolean;
  
  /**
   * Filtre panelinin başlangıç değerleri
   */
  initialFilterValues?: Record<string, any>;
}

/**
 * Merkezi filtre paneli bileşeni
 * 
 * Bu bileşen, tüm listeleme sayfalarında kullanılabilecek standart bir filtre paneli sağlar.
 * Arama kutusu, filtre paneli ve eylem butonlarını içerir.
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  title = 'Filtreler',
  searchPlaceholder = 'Ara...',
  searchTerm,
  onSearchChange,
  filterFields,
  onFilterChange,
  actionButtons,
  defaultFilterPanelOpen = false,
  initialFilterValues = {}
}) => {
  const { t } = useTranslation();
  const [filterPanelOpen, setFilterPanelOpen] = useState(defaultFilterPanelOpen);

  // Filtre panelini aç/kapat
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  return (
    <Paper sx={{ p: { xs: 1, sm: 1.5, md: 2 }, mb: 2, borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: { xs: 1, sm: 2 }, 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between'
      }}>
        {/* Sol taraf - Arama kutusu */}
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          alignItems: 'center', 
          width: { xs: '100%', sm: 'auto' } 
        }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '100%' }}
          />
        </Box>
        
        {/* Orta - Filtre butonu */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
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
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Sağ taraf - Eylem butonları */}
        {actionButtons && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            justifyContent: { xs: 'flex-end', sm: 'flex-end' },
            mt: { xs: 1, sm: 0 }
          }}>
            {actionButtons}
          </Box>
        )}
      </Box>

      {/* Filtre Paneli - Açılır/Kapanır */}
      {filterPanelOpen && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <AccordionFilter
            title={title}
            fields={filterFields}
            onSearch={onFilterChange}
            initialValues={initialFilterValues}
          />
        </Box>
      )}
    </Paper>
  );
};

export default FilterPanel;
