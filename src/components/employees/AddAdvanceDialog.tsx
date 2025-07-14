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
} from '@mui/material';
import { Safe } from '../../types/Safe';

// Bu interface, EmployeeDetailPage.tsx dosyasından alınmıştır.
interface Employee {
  id: number;
  name: string;
}

interface AddAdvanceDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  safes: Safe[];
}

const AddAdvanceDialog: React.FC<AddAdvanceDialogProps> = ({ open, onClose, employee, safes }) => {

  const handleSave = () => {
    // TODO: Avans bilgilerini kaydetme mantığı buraya eklenecek.
    console.log('Avans bilgileri kaydediliyor...');
    onClose();
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{employee.name} için Avans Ekle</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Avans Tutarı"
              type="number"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Kasa</InputLabel>
              <Select label="Kasa" defaultValue="">
                {safes.map((safe) => (
                  <MenuItem key={safe.id} value={safe.id}>
                    {safe.name} ({safe.currency})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tarih"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Açıklama"
              multiline
              rows={3}
              variant="outlined"
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

export default AddAdvanceDialog;
