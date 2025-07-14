import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';
import { useSafes } from '../../hooks/useSafes'; // Kasa verilerini çekmek için

interface Safe {
  id: string;
  name: string;
  currency: string;
}

interface NewOutgoingPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payment: any) => void;
}

const NewOutgoingPaymentModal: React.FC<NewOutgoingPaymentModalProps> = ({ open, onClose, onSave }) => {
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [safeId, setSafeId] = useState('');
  const [description, setDescription] = useState('');
  const { safes, fetchSafes } = useSafes(); // Kasaları çekmek için hook

  useEffect(() => {
    if (open) {
      fetchSafes();
    }
  }, [open, fetchSafes]);

  const handleSave = () => {
    if (!supplier || !amount || !safeId) {
      // Gerekli alanların doldurulduğundan emin olun
      return;
    }
    const newPayment = {
      id: Date.now().toString(),
      paymentNumber: `PAY-OUT-${Date.now()}`,
      supplier,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      status: 'Planlandı', // Varsayılan durum
      safeId, // Hangi kasadan ödeme yapıldığı bilgisi
      description
    };
    onSave(newPayment);
    onClose(); // Modalı kapat
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Giden Ödeme Ekle</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Tedarikçi / Cari Adı"
              fullWidth
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tutar"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="safe-select-label">Kasa</InputLabel>
              <Select
                labelId="safe-select-label"
                value={safeId}
                label="Kasa"
                onChange={(e: SelectChangeEvent) => setSafeId(e.target.value)}
              >
                {safes.map((safe) => (
                  <MenuItem key={safe.id} value={safe.id}>
                    {safe.name} ({safe.currency})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Açıklama"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default NewOutgoingPaymentModal;
