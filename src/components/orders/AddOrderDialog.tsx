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
    Stack
} from '@mui/material';

interface AddOrderDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (orderData: any) => void;
}

const paymentMethods = [
    'Kredi Kartı',
    'Havale',
    'Kapıda Ödeme'
];

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ open, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        productName: '',
        productCount: 1,
        amount: '',
        paymentMethod: 'Kredi Kartı'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        onSave({
            ...formData,
            productCount: Number(formData.productCount),
            amount: Number(formData.amount)
        });
        // Reset form
        setFormData({
            customerName: '',
            customerEmail: '',
            productName: '',
            productCount: 1,
            amount: '',
            paymentMethod: 'Kredi Kartı'
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Yeni Sipariş Ekle</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="customerName"
                                label="Müşteri Adı"
                                fullWidth
                                value={formData.customerName}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="customerEmail"
                                label="E-posta"
                                fullWidth
                                value={formData.customerEmail}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                name="productName"
                                label="Ürün Adı"
                                fullWidth
                                value={formData.productName}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="productCount"
                                label="Adet"
                                type="number"
                                fullWidth
                                value={formData.productCount}
                                onChange={handleChange}
                                size="small"
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="amount"
                                label="Tutar (₺)"
                                type="number"
                                fullWidth
                                value={formData.amount}
                                onChange={handleChange}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="paymentMethod"
                                label="Ödeme Yöntemi"
                                fullWidth
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                size="small"
                            >
                                {paymentMethods.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose} color="inherit">
                    İptal
                </Button>
                <Button onClick={handleSave} variant="contained" disableElevation>
                    Sipariş Oluştur
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddOrderDialog;
