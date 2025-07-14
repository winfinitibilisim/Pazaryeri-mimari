import React, { useState } from 'react';
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

interface AddNewProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductAdd: (productName: string) => void;
}

const AddNewProductModal: React.FC<AddNewProductModalProps> = ({ open, onClose, onProductAdd }) => {
  const [productName, setProductName] = useState('');
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Ürün/Hizmet Ekle</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField 
              autoFocus 
              label="Ürün/Hizmet Adı" 
              fullWidth 
              variant="outlined" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>Birim</InputLabel>
                <Select label="Birim" defaultValue="Adet">
                    <MenuItem value="Adet">Adet</MenuItem>
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Metre">Metre</MenuItem>
                    <MenuItem value="Saat">Saat</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
             <TextField label="Birim Fiyatı" type="number" fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel>KDV Oranı (%)</InputLabel>
                <Select label="KDV Oranı (%)" defaultValue={20}>
                    <MenuItem value={0}>%0</MenuItem>
                    <MenuItem value={1}>%1</MenuItem>
                    <MenuItem value={10}>%10</MenuItem>
                    <MenuItem value={20}>%20</MenuItem>
                </Select>
            </FormControl>
          </Grid>
           <Grid item xs={6}>
             <TextField label="Stok Kodu" fullWidth variant="outlined" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button 
          onClick={() => {
            if (productName.trim()) {
              onProductAdd(productName.trim());
              setProductName('');
              onClose();
            }
          }}
          variant="contained"
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewProductModal;
