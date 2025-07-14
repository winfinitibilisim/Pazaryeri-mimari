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
  InputAdornment,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import tr from 'date-fns/locale/tr';
import { 
    Close as CloseIcon, 
    BusinessCenter as BusinessCenterIcon, 
    AlternateEmail as AlternateEmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Check as CheckIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose }) => {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    bank: '',
    iban: '',
    startDate: null as Date | null,
    address: '',
    country: 'turkiye',
    city: '',
    district: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const handleDateChange = (newValue: Date | null) => {
    setFormState({ ...formState, startDate: newValue });
  };
  return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Çalışan Ekle</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={4}>
                <TextField 
                    fullWidth 
                    label="Ad Soyad" 
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleChange}
                    variant="outlined" 
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><BusinessCenterIcon /></InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField 
                    fullWidth 
                    label="E-Posta Adresi" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    variant="outlined" 
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><AlternateEmailIcon /></InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField 
                    fullWidth 
                    label="Telefon Numarası" 
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    variant="outlined" 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">🇹🇷</InputAdornment>,
                        endAdornment: <InputAdornment position="end"><PhoneIcon /></InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Banka" name="bank" value={formState.bank} onChange={handleChange}>
                    <MenuItem value="akbank">Akbank T.A.Ş.</MenuItem>
                    <MenuItem value="garanti">Garanti BBVA</MenuItem>
                    <MenuItem value="isbank">İş Bankası</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField fullWidth label="IBAN Numarası" name="iban" value={formState.iban} onChange={handleChange} placeholder="TR__ ____ ____ ____ ____ ____ #" />
            </Grid>
            <Grid item xs={12} sm={4}>
                 <DatePicker
                    label="Başlangıç Tarihi"
                    value={formState.startDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    fullWidth 
                    label="Adres" 
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                    variant="outlined" 
                    multiline 
                    rows={3} 
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><LocationOnIcon /></InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Ülke" name="country" value={formState.country} onChange={handleChange}>
                    <MenuItem value="turkiye">Türkiye</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Şehir" name="city" value={formState.city} onChange={handleChange}>
                    <MenuItem value="istanbul">İstanbul</MenuItem>
                    <MenuItem value="ankara">Ankara</MenuItem>
                    <MenuItem value="izmir">İzmir</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="İlçe" name="district" value={formState.district} onChange={handleChange}>
                     <MenuItem value="kadikoy">Kadıköy</MenuItem>
                     <MenuItem value="cankaya">Çankaya</MenuItem>
                     <MenuItem value="bornova">Bornova</MenuItem>
                </TextField>
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} variant="contained" color="error" startIcon={<CancelIcon />}>Vazgeç</Button>
            <Button onClick={onClose} variant="contained" color="success" startIcon={<CheckIcon />}>Ekle</Button>
        </DialogActions>
        </Dialog>
  );
};

export default AddEmployeeModal;
