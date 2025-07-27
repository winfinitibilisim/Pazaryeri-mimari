import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Chip,
  Typography
} from '@mui/material';
import { Close, CalendarToday, AccessTime } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import tr from 'date-fns/locale/tr';
import { useNavigate } from 'react-router-dom';

interface CreateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
  const [invoiceTime, setInvoiceTime] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [selectedDueDays, setSelectedDueDays] = useState<number | null>(null);

  const dueDaysOptions = [
    { label: 'Aynı gün', value: 0 },
    { label: '7 Gün', value: 7 },
    { label: '30 Gün', value: 30 },
    { label: '60 Gün', value: 60 },
    { label: '90 Gün', value: 90 }
  ];

  const handleDueDaysSelect = (days: number) => {
    setSelectedDueDays(days);
    if (invoiceDate) {
      const newDueDate = new Date(invoiceDate);
      newDueDate.setDate(newDueDate.getDate() + days);
      setDueDate(newDueDate);
    }
  };

  const handleContinue = () => {
    // Fatura bilgilerini state'e kaydet ve edit sayfasına yönlendir
    const invoiceData = {
      invoiceNumber,
      customerName,
      invoiceDate,
      invoiceTime,
      dueDate
    };
    
    // LocalStorage'a geçici olarak kaydet
    localStorage.setItem('newInvoiceData', JSON.stringify(invoiceData));
    
    // Edit sayfasına yönlendir
    navigate('/sales-invoices/create');
    onClose();
  };

  const handleCancel = () => {
    // Form'u temizle
    setInvoiceNumber('');
    setCustomerName('');
    setInvoiceDate(new Date());
    setInvoiceTime(new Date());
    setDueDate(new Date());
    setSelectedDueDays(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          Yeni Fatura Oluştur
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fatura bilgilerini girin.
          </Typography>

          <Grid container spacing={3}>
            {/* Fatura Numarası */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fatura Numarası"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="SATIS-2024-001"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>

            {/* Müşteri Adı */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Müşteri Adı"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Müşteri adını girin"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
            </Grid>

            {/* Fatura Tarihi ve Saati */}
            <Grid item xs={6}>
              <DatePicker
                label="Fatura Tarihi"
                value={invoiceDate}
                onChange={(newValue: Date | null) => setInvoiceDate(newValue)}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TimePicker
                label="Fatura Saati"
                value={invoiceTime}
                onChange={(newValue: Date | null) => setInvoiceTime(newValue)}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  />
                )}
              />
            </Grid>

            {/* Vade Tarihi Seçenekleri */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Vade Tarihi
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {dueDaysOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => handleDueDaysSelect(option.value)}
                    variant={selectedDueDays === option.value ? 'filled' : 'outlined'}
                    color={selectedDueDays === option.value ? 'primary' : 'default'}
                    sx={{
                      borderRadius: '20px',
                      '&:hover': {
                        backgroundColor: selectedDueDays === option.value ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Manuel Vade Tarihi */}
            <Grid item xs={12}>
              <DatePicker
                label="Vade Tarihi"
                value={dueDate}
                onChange={(newValue: Date | null) => setDueDate(newValue)}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCancel}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleContinue}
            variant="contained"
            disabled={!invoiceNumber || !customerName}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              ml: 2
            }}
          >
            Devam Et
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateInvoiceDialog;
