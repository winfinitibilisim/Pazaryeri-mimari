import React from 'react';
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import { Customer } from '../../types/Customer';
import HookForm from '../form/HookForm';
import { FormField } from '../../types/FormField';

interface CustomerSmsDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSend: (data: any) => void;
}

const CustomerSmsDialog: React.FC<CustomerSmsDialogProps> = ({
  open,
  customer,
  onClose,
  onSend
}) => {
  // Form alanlarını tanımla
  const formFields: FormField[] = [
    {
      name: 'message',
      label: 'SMS Mesajı',
      type: 'textarea',
      required: true,
      multiline: true,
      minRows: 4,
      maxRows: 8,
      placeholder: 'SMS mesajınızı buraya yazabilirsiniz...',
      helperText: 'SMS başına 160 karakter gönderilir'
    }
  ];
  
  // Form gönderim işleyicisi
  const handleFormSubmit = (data: any) => {
    onSend(data);
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          width: '100%', 
          maxWidth: 600,
          borderRadius: 2,
          overflow: 'hidden'
        } 
      }}
    >
      {/* Başlık */}
      <DialogTitle 
        sx={{ 
          bgcolor: '#25638f', 
          color: 'white', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SmsIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            SMS Gönder
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      {/* Alıcı bilgisi */}
      <Box sx={{ px: 3, py: 2, bgcolor: '#f5f5f5' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="textSecondary">
              Alıcı:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={customer?.name || 'Müşteri'} 
                color="primary" 
                variant="outlined" 
              />
              <Chip
                icon={<PhoneIcon sx={{ fontSize: '1rem !important' }} />}
                label={customer?.phone || '-'}
                variant="outlined"
                size="small"
                sx={{ borderColor: '#25638f', color: '#25638f' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Divider />
      
      {/* Form içeriği */}
      <Box sx={{ p: 0 }}>
        <HookForm
          open={true}
          onClose={onClose}
          onSubmit={handleFormSubmit}
          title=""
          submitButtonText="Gönder"
          fields={formFields}
          defaultValues={{ message: '' }}
        />
      </Box>
    </Dialog>
  );
};

export default CustomerSmsDialog;
