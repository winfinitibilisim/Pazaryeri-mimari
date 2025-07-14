import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  styled
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Dropzone = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.action.hover,
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ open, onClose }) => {

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Yeni Döküman Ekle
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        
        <Dropzone>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Dosyaları buraya sürükleyin veya seçmek için tıklayın
            </Typography>
            <Button variant="contained" component="label">
                Dosya Seç
                <input type="file" hidden multiple />
            </Button>
        </Dropzone>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            <Button variant="text" onClick={onClose}>İptal</Button>
            <Button variant="contained">Yükle</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddDocumentModal;
