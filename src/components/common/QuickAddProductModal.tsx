import React, { useState } from 'react';
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
  FormControl,
} from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon, TouchApp as TouchAppIcon } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import CategorySelectionModal from './CategorySelectionModal';

interface QuickAddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');



  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('quickAddProduct.title')}
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
            label={t('quickAddProduct.name')}
            margin="normal"

          />
          <TextField
            required
            fullWidth
            label={t('quickAddProduct.category')}
            value={selectedCategory}
            margin="normal"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setCategoryModalOpen(true)}>
                    <TouchAppIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label={t('quickAddProduct.brand')}
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
            label={t('quickAddProduct.stockCode')}
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
            label={t('quickAddProduct.barcode')}
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
            <TextField fullWidth label={t('quickAddProduct.sellingPrice')} margin="normal" defaultValue="0" />
            <FormControl sx={{ minWidth: 80 }}>
              <Select defaultValue="$">
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="€">€</MenuItem>
                <MenuItem value="₺">₺</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField fullWidth label={t('quickAddProduct.purchasePrice')} margin="normal" defaultValue="0" />
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
              <FormControlLabel value="Aktif" control={<Radio />} label={t('quickAddProduct.status.active')} />
              <FormControlLabel value="Pasif" control={<Radio />} label={t('quickAddProduct.status.passive')} />
              <FormControlLabel value="Ürünü Gizle" control={<Radio />} label={t('quickAddProduct.status.hideProduct')} />
              <FormControlLabel value="Sadece Katalog" control={<Radio />} label={t('quickAddProduct.status.catalogOnly')} />
              <FormControlLabel value="Arşiv" control={<Radio />} label={t('quickAddProduct.status.archive')} />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained">
          {t('quickAddProduct.cancel')}
        </Button>
        <Button onClick={onClose} variant="contained" disabled>
          {t('quickAddProduct.add')}
        </Button>
      </DialogActions>
      <CategorySelectionModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelect={(category) => {
          setSelectedCategory(category);
          setCategoryModalOpen(false);
        }}
      />
    </Dialog>
  );
};

export default QuickAddProductModal;
