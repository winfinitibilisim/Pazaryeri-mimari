import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, useTheme } from '@mui/material';
// Global bileşenleri kullanıyoruz
import ExportButton from '../../common/ExportButton';
import PrintButton from '../../common/PrintButton';

interface FormActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
  onPrint: () => void;
  onExport: () => void;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isEditMode, 
  onCancel, 
  onPrint, 
  onExport, 
  isSubmitting 
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: { xs: 1, sm: 2 }, 
      mt: 3,
      flexWrap: { xs: 'wrap', sm: 'nowrap' }
    }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{ 
          textTransform: 'none',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          minWidth: { xs: '80px', sm: '100px' },
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider,
          '&:hover': {
            borderColor: theme.palette.text.secondary,
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        {t('cancel')}
      </Button>
      
      <PrintButton
        label={t('print')}
        onClick={onPrint}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      />
      
      <ExportButton
        label={t('exportToExcel')}
        onClick={onExport}
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      />
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        sx={{ 
          textTransform: 'none',
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          minWidth: { xs: '80px', sm: '100px' }
        }}
      >
        {isEditMode ? t('update') : t('save')}
      </Button>
    </Box>
  );
};

export default FormActions;
