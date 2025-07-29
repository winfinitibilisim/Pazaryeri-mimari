import React, { useState } from 'react';
import { 
  TextField, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

interface WarehouseFormProps {
  onSubmit: (formData: Record<string, any>) => void;
  initialData?: Record<string, any>;
  isEdit?: boolean;
  formId?: string;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({
  onSubmit,
  initialData = {},
  isEdit = false,
  formId = 'warehouse-form'
}) => {
  const { translations } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    location: initialData.location || '',
    manager: initialData.manager || '',
    capacity: initialData.capacity || '',
    status: initialData.status || 'Aktif',
    floors: initialData.floors || '',
    shelfSections: initialData.shelfSections || '',
    description: initialData.description || ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={translations.warehouseName || 'Depo Adı'}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={translations.location || 'Konum'}
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={translations.warehouseManager || 'Depo Sorumlusu'}
            value={formData.manager}
            onChange={(e) => handleChange('manager', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={translations.capacity || 'Kapasite (m²)'}
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Kat Sayısı"
            type="number"
            value={formData.floors}
            onChange={(e) => handleChange('floors', e.target.value)}
            helperText="Deponun toplam kat sayısı"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Raf Bölgeleri"
            value={formData.shelfSections}
            onChange={(e) => handleChange('shelfSections', e.target.value)}
            placeholder="Örn: A1-A10, B1-B15, C1-C20"
            helperText="Raf bölgelerini virgülle ayırarak yazın"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>{translations.status || 'Durum'}</InputLabel>
            <Select
              value={formData.status}
              label={translations.status || 'Durum'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="Aktif">{translations.active || 'Aktif'}</MenuItem>
              <MenuItem value="Pasif">{translations.inactive || 'Pasif'}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Açıklama"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Depo hakkında ek bilgiler..."
            helperText="İsteğe bağlı açıklama ekleyebilirsiniz"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseForm;
