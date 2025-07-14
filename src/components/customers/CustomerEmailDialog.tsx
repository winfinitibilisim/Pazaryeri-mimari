import React from 'react';
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  Divider,
  IconButton,
  Grid,
  Chip
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { Customer } from '../../types/Customer';
import HookForm from '../form/HookForm';
import { FormField } from '../../types/FormField';

interface CustomerEmailDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSend: (data: any) => void;
}

const CustomerEmailDialog: React.FC<CustomerEmailDialogProps> = ({
  open,
  customer,
  onClose,
  onSend
}) => {
  // Form alanlarını tanımla
  const formFields: FormField[] = [
    {
      name: 'subject',
      label: 'Konu',
      type: 'text',
      required: true,
      placeholder: 'E-posta konusu'
    },
    {
      name: 'body',
      label: 'İçerik',
      type: 'textarea',
      required: true,
      multiline: true,
      minRows: 8,
      maxRows: 15,
      placeholder: 'Mesajınızı buraya yazabilirsiniz...'
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
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          width: '100%', 
          maxWidth: 800,
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
          <EmailIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            E-posta Gönder
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={customer?.name || 'Müşteri'} 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
              <Typography variant="body2" color="textSecondary">
                {customer?.email}
              </Typography>
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
          defaultValues={{ subject: '', body: '' }}
        />
      </Box>
    </Dialog>
  );
};

export default CustomerEmailDialog;
