import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import HookForm from '../form/HookForm';
import { Warehouse } from './WarehouseList';

interface WarehouseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  isEdit?: boolean;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  isEdit = false
}) => {
  const { translations } = useLanguage();

  // Form alanları
  const formFields = [
    {
      name: 'name',
      label: translations.warehouseName || 'Depo Adı',
      type: 'text',
      required: true,
      defaultValue: initialData.name || '',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'location',
      label: translations.location || 'Konum',
      type: 'text',
      required: true,
      defaultValue: initialData.location || '',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'manager',
      label: translations.warehouseManager || 'Depo Sorumlusu',
      type: 'text',
      required: true,
      defaultValue: initialData.manager || '',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'capacity',
      label: translations.capacity || 'Kapasite (m²)',
      type: 'number',
      required: true,
      defaultValue: initialData.capacity || '',
      gridProps: { xs: 12, sm: 6 }
    },
    {
      name: 'status',
      label: translations.status || 'Durum',
      type: 'select',
      options: [
        { value: 'Aktif', label: translations.active || 'Aktif' },
        { value: 'Pasif', label: translations.inactive || 'Pasif' }
      ],
      required: true,
      defaultValue: initialData.status || 'Aktif',
      gridProps: { xs: 12, sm: 6 }
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit 
          ? (translations.editWarehouse || 'Depo Düzenle') 
          : (translations.addWarehouse || 'Depo Ekle')
        }
      </DialogTitle>
      <DialogContent>
        <HookForm 
          fields={formFields} 
          onSubmit={onSubmit}
          submitButtonText={translations.saveChanges || 'Değişiklikleri Kaydet'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {translations.close || 'Kapat'}
        </Button>
        <Button 
          type="submit" 
          form="hook-form" 
          color="primary" 
          variant="contained"
        >
          {translations.saveChanges || 'Değişiklikleri Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseForm;
