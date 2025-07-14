import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import tr from 'date-fns/locale/tr';

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ open, onClose }) => {
  const [paymentDate, setPaymentDate] = React.useState<Date | null>(new Date());

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Yeni Ödeme Ekle
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <DatePicker
                  label="Ödeme Tarihi"
                  value={paymentDate}
                  onChange={(newValue) => setPaymentDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Tutar" type="number" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Ödeme Yöntemi</InputLabel>
                    <Select label="Ödeme Yöntemi" defaultValue="banka-transferi">
                        <MenuItem value="banka-transferi">Banka Transferi</MenuItem>
                        <MenuItem value="kredi-karti">Kredi Kartı</MenuItem>
                        <MenuItem value="nakit">Nakit</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Not" multiline rows={3} variant="outlined" />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button variant="text" onClick={onClose}>İptal</Button>
              <Button variant="contained">Kaydet</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
};

export default AddPaymentModal;
