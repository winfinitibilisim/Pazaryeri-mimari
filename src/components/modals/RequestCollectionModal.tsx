import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import tr from 'date-fns/locale/tr';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface RequestCollectionModalProps {
  open: boolean;
  onClose: () => void;
}

const currencySymbols: { [key: string]: string } = {
  'TL': '₺',
  'USD': '$',
  'EUR': '€',
};

const RequestCollectionModal: React.FC<RequestCollectionModalProps> = ({ open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('TL');
  const [sendMethod, setSendMethod] = useState({ email: true, whatsapp: false });
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('winfiniti- Ödeme Hatırlatma');

  const handleSendMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendMethod({ ...sendMethod, [event.target.name]: event.target.checked });
  };

  React.useEffect(() => {
    const today = new Date().toLocaleDateString('tr-TR');
    const companyName = "winfiniti";
    const userName = "ahmet";
    const linkText = "Extre Ekranında İncele";
    const filledAmount = amount || '[TUTAR]';

    const template = `Merhaba,\n\nFirmamıza (${companyName}) ödemeniz bulunmaktadır.\n\n${today} tarihi itibariyle ${filledAmount} ${selectedCurrency} borç bakiyeniz bulunmaktadır.\n\n${linkText}\n\nİyi Çalışmalar.\n${userName}`;
    
    setDescription(template);
  }, [amount, selectedCurrency]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tahsilat Talebi Oluştur
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers ref={dialogContentRef}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Para Birimi</Typography>
              <TextField select fullWidth value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)} variant="outlined" size="small">
                <MenuItem value="TL">TL</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Tutar</Typography>
              <TextField 
                fullWidth 
                variant="outlined" 
                size="small" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{currencySymbols[selectedCurrency]}</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Son Ödeme Tarihi</Typography>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                PopperProps={{ container: dialogContentRef.current }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Konu</Typography>
              <TextField 
                fullWidth 
                variant="outlined" 
                size="small" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Açıklama</Typography>
              <TextField 
                fullWidth 
                multiline 
                rows={8} 
                variant="outlined" 
                size="small" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Gönderim Yöntemi</Typography>
                <FormGroup row>
                    <FormControlLabel 
                        control={<Checkbox checked={sendMethod.email} onChange={handleSendMethodChange} name="email" />} 
                        label={<Box sx={{ display: 'flex', alignItems: 'center' }}><EmailIcon sx={{ mr: 1 }} /> E-posta</Box>}
                    />
                    <FormControlLabel 
                        control={<Checkbox checked={sendMethod.whatsapp} onChange={handleSendMethodChange} name="whatsapp" />} 
                        label={<Box sx={{ display: 'flex', alignItems: 'center' }}><WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp</Box>}
                    />
                </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="error" startIcon={<CloseIcon />}>Vazgeç</Button>
          <Button onClick={onClose} variant="contained" color="primary">Talep Gönder</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default RequestCollectionModal;
