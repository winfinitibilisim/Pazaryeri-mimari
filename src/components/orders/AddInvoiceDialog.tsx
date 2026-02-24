import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface AddInvoiceDialogProps {
    open: boolean;
    onClose: () => void;
    onSave?: (file: File | null) => void;
}

const AddInvoiceDialog: React.FC<AddInvoiceDialogProps> = ({ open, onClose, onSave }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSave = () => {
        // Mock save logic
        console.log('Invoice saved', file);
        if (onSave) {
            onSave(file);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Fatura Ekle
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        label="Fatura Numarası"
                        fullWidth
                        size="small"
                        placeholder="FTR-2024-..."
                    />
                    <TextField
                        label="Fatura Tarihi"
                        type="date"
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Tutar"
                        type="number"
                        fullWidth
                        size="small"
                        InputProps={{
                            endAdornment: <Typography variant="caption">TL</Typography>
                        }}
                    />

                    <Box
                        sx={{
                            border: '2px dashed #e0e0e0',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: '#fafafa', borderColor: 'primary.main' }
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.png"
                            onChange={handleFileChange}
                        />
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {file ? file.name : 'Dosya yüklemek için tıklayın veya sürükleyin'}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block">
                            PDF, JPG, PNG (Max 5MB)
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">İptal</Button>
                <Button variant="contained" onClick={handleSave} disableElevation>
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddInvoiceDialog;
