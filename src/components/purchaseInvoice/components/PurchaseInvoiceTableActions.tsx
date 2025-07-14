import React from 'react';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTranslation } from 'react-i18next';
import ExportButton from '../../common/ExportButton';
import PrintButton from '../../common/PrintButton';

interface PurchaseInvoiceTableActionsProps {
  onAddNew: () => void;
  onExportExcel: () => void;
  onExportPdf?: () => void;
  onPrint: () => void;
  onToggleFilter: () => void;
  showFilter: boolean;
}

const PurchaseInvoiceTableActions: React.FC<PurchaseInvoiceTableActionsProps> = ({
  onAddNew,
  onExportExcel,
  onExportPdf,
  onPrint,
  onToggleFilter,
  showFilter
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: { xs: 1, sm: 2 }, 
      flexWrap: 'wrap', 
      justifyContent: { xs: 'center', sm: 'flex-end'},
      mb: 2
    }}>
      <ExportButton 
        onClick={onExportExcel} 
        label={t('exportToExcel')}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      />
      
      {onExportPdf && (
        <ExportButton 
          onClick={onExportPdf} 
          label={t('exportToPdf')}
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        />
      )}
      
      <PrintButton 
        onClick={onPrint}
        label={t('print')}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      />
      
      <Button
        variant="outlined"
        color={showFilter ? "primary" : "inherit"}
        onClick={onToggleFilter}
        startIcon={<FilterListIcon />}
        sx={{ 
          textTransform: 'none',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          borderColor: showFilter ? theme.palette.primary.main : theme.palette.divider,
          color: showFilter ? theme.palette.primary.main : theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: showFilter ? 'rgba(76, 175, 80, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            borderColor: showFilter ? theme.palette.primary.main : theme.palette.text.secondary
          }
        }}
      >
        {t('filter')}
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        onClick={onAddNew}
        startIcon={<AddIcon />}
        sx={{ 
          textTransform: 'none',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          backgroundColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#388e3c'
          }
        }}
      >
        {t('addNewPurchaseInvoice')}
      </Button>
    </Box>
  );
};

export default PurchaseInvoiceTableActions;
