import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import PurchaseInvoiceForm from '../../components/forms/PurchaseInvoiceForm';

interface CreatePurchaseInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { invoiceNumber: string; supplierName: string; date: string; dueDate: string; }) => void;
}

export const CreatePurchaseInvoiceModal: React.FC<CreatePurchaseInvoiceModalProps> = ({ open, onClose, onSave }) => {
  const { t } = useTranslation();

  const handleSave = (formData: any) => {
    // Adapt the data from the form to what the onSave prop expects
    const saveData = {
      invoiceNumber: formData.invoiceNumber || '',
      supplierName: formData.supplier?.label || '',
      date: formData.invoiceDate ? new Date(formData.invoiceDate).toISOString() : '',
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
    };
    onSave(saveData);
    onClose(); // Close modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' },
        maxWidth: '900px',
        bgcolor: 'background.paper',
        borderRadius: '12px',
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
          <Typography variant="h6" component="h2">
            {t('invoice.createNewPurchaseInvoice', 'Yeni Alış Faturası Oluştur')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
            <PurchaseInvoiceForm 
                isModal={true} 
                onSave={handleSave} 
                onSaveAsDraft={() => { /* Optionally handle draft saving */ onClose(); }}
            />
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePurchaseInvoiceModal;
