import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
} from '@mui/material';

// Bu interface, EmployeeDetailPage.tsx dosyasından alınmıştır.
// İdeal olarak, bu tür tanımlamaları paylaşılan bir types dosyasında tutmak daha iyidir.
interface Employee {
  id: number;
  name: string;
}

interface DefineSalaryDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const DefineSalaryDialog: React.FC<DefineSalaryDialogProps> = ({ open, onClose, employee }) => {
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSave = () => {
    // TODO: Maaş tanımını kaydetme mantığı buraya eklenecek.
    console.log('Maaş bilgileri kaydediliyor...', { isRecurring });
    onClose();
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{employee.name} için Maaş Tanımla</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maaş Tutarı"
              type="number"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Para Birimi</InputLabel>
              <Select label="Para Birimi" defaultValue="TRY">
                <MenuItem value="TRY">Türk Lirası (TRY)</MenuItem>
                <MenuItem value="USD">ABD Doları (USD)</MenuItem>
                <MenuItem value="EUR">Euro (EUR)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Maaş Tipi</InputLabel>
              <Select label="Maaş Tipi" defaultValue="monthly">
                <MenuItem value="monthly">Aylık</MenuItem>
                <MenuItem value="weekly">Haftalık</MenuItem>
                <MenuItem value="daily">Günlük</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Geçerlilik Tarihi"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
              }
              label="Maaşı her ayın aynı gününde tekrarla"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSave} variant="contained">Kaydet</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefineSalaryDialog;
