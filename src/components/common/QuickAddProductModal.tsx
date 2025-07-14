import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon, TouchApp as TouchAppIcon } from '@mui/icons-material';

interface QuickAddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Hızlı Ürün Ekle
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            required
            fullWidth
            label="Ad"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src="https://flagcdn.com/w20/tr.png" alt="TR Flag" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            label="Kategori"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <TouchAppIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Marka"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <TouchAppIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            fullWidth
            label="Stok Kodu"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" color="primary">
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Barkod"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" color="primary">
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField fullWidth label="Satış Fiyatı" margin="normal" defaultValue="0" />
            <FormControl sx={{ minWidth: 80 }}>
              <Select defaultValue="$">
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="€">€</MenuItem>
                <MenuItem value="₺">₺</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField fullWidth label="Alış Fiyatı" margin="normal" defaultValue="0" />
            <FormControl sx={{ minWidth: 80 }}>
              <Select defaultValue="$">
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="€">€</MenuItem>
                <MenuItem value="₺">₺</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl component="fieldset" margin="normal">
            <RadioGroup row defaultValue="Aktif">
              <FormControlLabel value="Aktif" control={<Radio />} label="Aktif" />
              <FormControlLabel value="Pasif" control={<Radio />} label="Pasif" />
              <FormControlLabel value="Ürünü Gizle" control={<Radio />} label="Ürünü Gizle" />
              <FormControlLabel value="Sadece Katalog" control={<Radio />} label="Sadece Katalog" />
              <FormControlLabel value="Arşiv" control={<Radio />} label="Arşiv" />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          Vazgeç
        </Button>
        <Button onClick={onClose} variant="contained" disabled>
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddProductModal;
