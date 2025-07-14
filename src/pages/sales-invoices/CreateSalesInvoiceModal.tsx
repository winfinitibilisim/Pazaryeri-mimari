import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import tr from 'date-fns/locale/tr';
import { addDays } from 'date-fns';

interface CreateSalesInvoiceModalProps {
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

const CreateSalesInvoiceModal: React.FC<CreateSalesInvoiceModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [invoiceDate, setInvoiceDate] = React.useState<Date | null>(new Date());
  const [invoiceTime, setInvoiceTime] = React.useState<Date | null>(new Date());
  const [dueDate, setDueDate] = React.useState<Date | null>(new Date());

  const handleDueDateChange = (days: number) => {
    if (invoiceDate) {
      const newDueDate = addDays(invoiceDate, days);
      setDueDate(newDueDate);
    }
  };

  const handleContinue = () => {
    // TODO: Pass modal data to the new invoice page
    navigate('/sales-invoices/new/edit');
    onClose(); // Close the modal after navigating
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Yeni Fatura Oluştur
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fatura bilgilerini girin.
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Fatura Numarası" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Müşteri Adı" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Fatura Tarihi"
                value={invoiceDate}
                onChange={(newValue) => setInvoiceDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Fatura Saati"
                value={invoiceTime}
                onChange={(newValue) => setInvoiceTime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Vade Tarihi</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => handleDueDateChange(0)}>Aynı gün</Button>
                    <Button variant="outlined" size="small" onClick={() => handleDueDateChange(7)}>7 Gün</Button>
                    <Button variant="outlined" size="small" onClick={() => handleDueDateChange(30)}>30 Gün</Button>
                    <Button variant="outlined" size="small" onClick={() => handleDueDateChange(60)}>60 Gün</Button>
                    <Button variant="outlined" size="small" onClick={() => handleDueDateChange(90)}>90 Gün</Button>
                </Box>
                <DatePicker
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
              <Button variant="text" onClick={onClose}>İptal</Button>
              <Button variant="contained" onClick={handleContinue}>Devam Et</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
};

export default CreateSalesInvoiceModal;
