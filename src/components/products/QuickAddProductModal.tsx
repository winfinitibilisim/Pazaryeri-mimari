import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useTranslation } from 'react-i18next';

interface QuickAddProductModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('active');

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {t('quickAddProduct.title')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label={t('quickAddProduct.name')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <img src="/flags/tr.svg" alt="TR Flag" width="24" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label={t('quickAddProduct.category')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" sx={{ border: '1px solid #ddd', borderRadius: 1 }}><TouchAppIcon fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('quickAddProduct.brand')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" sx={{ border: '1px solid #ddd', borderRadius: 1 }}><TouchAppIcon fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label={t('quickAddProduct.stockCode')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" sx={{ backgroundColor: '#3f51b5', color: 'white', '&:hover': { backgroundColor: '#303f9f' }, borderRadius: 1 }}><AutorenewIcon fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('quickAddProduct.barcode')}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                     <IconButton size="small" sx={{ backgroundColor: '#3f51b5', color: 'white', '&:hover': { backgroundColor: '#303f9f' }, borderRadius: 1 }}><AutorenewIcon fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth label={t('quickAddProduct.sellingPrice')} type="number" defaultValue={0} variant="outlined" />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth variant="outlined">
                <Select defaultValue="USD">
                    <MenuItem value="USD">$</MenuItem>
                    <MenuItem value="EUR">€</MenuItem>
                    <MenuItem value="TRY">₺</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <TextField fullWidth label={t('quickAddProduct.purchasePrice')} type="number" defaultValue={0} variant="outlined" />
          </Grid>
          <Grid item xs={3}>
             <FormControl fullWidth variant="outlined">
                <Select defaultValue="USD">
                    <MenuItem value="USD">$</MenuItem>
                    <MenuItem value="EUR">€</MenuItem>
                    <MenuItem value="TRY">₺</MenuItem>
                </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
                <RadioGroup row name="status" value={status} onChange={handleStatusChange}>
                    <FormControlLabel value="active" control={<Radio />} label={t('quickAddProduct.status.active')} />
                    <FormControlLabel value="passive" control={<Radio />} label={<Typography color="error">{t('quickAddProduct.status.passive')}</Typography>} />
                    <FormControlLabel value="hideProduct" control={<Radio />} label={t('quickAddProduct.status.hideProduct')} />
                    <FormControlLabel value="catalogOnly" control={<Radio />} label={t('quickAddProduct.status.catalogOnly')} />
                    <FormControlLabel value="archive" control={<Radio />} label={t('quickAddProduct.status.archive')} />
                </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" color="error" startIcon={<CloseIcon />}>{t('buttons.cancel')}</Button>
        <Button onClick={onClose} variant="contained" disabled sx={{ backgroundColor: '#e0e0e0' }}>{t('buttons.add')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuickAddProductModal;
