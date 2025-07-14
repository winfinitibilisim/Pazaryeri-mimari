import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface SendInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  customerEmail: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const SendInvoiceModal: React.FC<SendInvoiceModalProps> = ({ open, onClose, invoiceId, customerEmail }) => {

  const defaultSubject = `Fatura #${invoiceId} Hakkında`;
  const defaultMessage = `Sayın Müşteri,\n\nEkte #${invoiceId} numaralı faturanız bulunmaktadır.\n\nİyi günler dileriz.`;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Faturayı E-posta ile Gönder
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField fullWidth label="Kimden" variant="outlined" defaultValue="noreply@yourcompany.com" disabled />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Kime" variant="outlined" defaultValue={customerEmail} />
            </Grid>
            <Grid item xs={12}>
                <TextField fullWidth label="Konu" variant="outlined" defaultValue={defaultSubject} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mesaj" multiline rows={6} variant="outlined" defaultValue={defaultMessage}/>
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="Faturayı PDF olarak ekle" />
            </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button variant="text" onClick={onClose}>İptal</Button>
            <Button variant="contained">Gönder</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SendInvoiceModal;
