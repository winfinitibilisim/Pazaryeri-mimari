import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Stack,
    Divider,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Avatar,
    Chip,
    IconButton,
    Card
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ContentCopy as CopyIcon,
    LocalShipping as ShippingIcon,
    Description as InvoiceIcon,
    Print as PrintIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    Info as InfoIcon,
    OpenInNew as OpenIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AddInvoiceDialog from '../components/orders/AddInvoiceDialog';

const OrderDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [openAddInvoice, setOpenAddInvoice] = React.useState(false);
    const [hasInvoice, setHasInvoice] = React.useState(false);

    const handleInvoiceSave = (file: File | null) => {
        setHasInvoice(true);
    };

    // Mock Data for the selected order (In a real app, fetch by ID)
    const orderData = {
        id: orderId,
        orderNumber: '4146659772',
        deliveryNumber: '62154321253040',
        packetNumber: '5432125304',
        trackingNumber: '62154321253040',
        totalAmount: 1680.00,
        orderDate: '4 Ocak 2026 Pazar 18:48',
        packetDate: '5 Ocak 2026 Pazartesi 12:09',
        shippingDate: '6 Ocak 2026 Salı 11:30',
        deliveryDate: '12 Ocak 2026 Pazartesi 09:57',
        customer: {
            name: 'Gonca Gül Çakır',
            recipient: 'Gülseren Büber',
            email: '4146659772_5432125304@hepsifatura.com',
        },
        address: {
            delivery: '9 EYLÜL / MENEMEN / İzmir\n9 eylül mah. 251. Sok. Helin Apt. No:5/1 Kat:3 Daire:19 35663 Ulukent - Menemen / İzmir',
            invoice: 'ÇAĞLAYAN / MURATPAŞA / Antalya\nÇağlayan mah. 2033 sok. Doğa Birlik Sitesi A blok Kat:2 No:4',
            taxPayer: 'Gonca Gül Çakır',
            taxInfo: 'Bireysel Müşteri'
        },
        product: {
            name: 'Ekinezya Ekstraktı',
            image: '', // Placeholder
            sku: 'HBCV0000BJLAVY',
            stockCode: 'EKİNEZYA-E',
            salesPrice: 1680.00,
            listPrice: 1680.00,
            commission: 342.72,
            commissionRate: 17
        }
    };

    const steps = [
        {
            label: 'Sipariş tarihi',
            date: orderData.orderDate,
            subLabel: 'Ödemesi alındı',
            active: true,
            completed: true
        },
        {
            label: 'Paket hazırlandı',
            date: orderData.packetDate,
            active: true,
            completed: true
        },
        {
            label: 'Kargoya teslim edildi',
            date: orderData.shippingDate,
            active: true,
            completed: true
        },
        {
            label: 'Müşteriye teslim edildi',
            date: orderData.deliveryDate,
            active: true,
            completed: true
        }
    ];

    const CopyButton = () => (
        <IconButton size="small" sx={{ ml: 0.5, color: 'text.secondary', p: 0.5 }}>
            <CopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
    );

    return (
        <Box sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/orders')}
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                >
                    Geri
                </Button>
                <Typography variant="h5" fontWeight="600">
                    Teslim edildi detay
                </Typography>
            </Stack>

            <Grid container spacing={3}>
                {/* Left Column: Timeline */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', height: '100%', borderRadius: 2 }}>
                        <Stepper orientation="vertical" activeStep={4}>
                            {steps.map((step, index) => (
                                <Step key={step.label} active={true} completed={true}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <CheckCircleIcon color="success" />
                                        )}
                                    >
                                        <Typography variant="subtitle2" fontWeight="700">{step.label}</Typography>
                                    </StepLabel>
                                    <StepContent>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {step.date}
                                        </Typography>
                                        {step.subLabel && (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <CheckCircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {step.subLabel}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>
                </Grid>

                {/* Right Column: Order Details */}
                <Grid item xs={12} md={9}>
                    {/* Top Summary Card */}
                    <Paper elevation={0} sx={{ p: 0, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
                        {/* Order Header Info */}
                        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                            <Grid container spacing={4}>
                                <Grid item>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Müşteri bilgileri</Typography>
                                    <Typography variant="body2">{orderData.customer.name}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Sipariş no</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2">{orderData.orderNumber}</Typography>
                                        <CopyButton />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Teslimat no</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2">{orderData.deliveryNumber}</Typography>
                                        <CopyButton />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Paket no</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2">{orderData.packetNumber}</Typography>
                                        <CopyButton />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Takip no</Typography>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="body2">{orderData.trackingNumber}</Typography>
                                        <CopyButton />
                                    </Box>
                                </Grid>
                                <Grid item xs sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" fontWeight="600">Toplam tutar</Typography>
                                    <Typography variant="h5" fontWeight="700">
                                        {orderData.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Cargo Info */}
                        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="subtitle2" fontWeight="700" mb={1}>Kargo bilgileri</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {/* Placeholder for Logo */}
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                    <ShippingIcon sx={{ mr: 1 }} /> Yurtiçi Kargo
                                </Typography>
                            </Box>
                        </Box>

                        {/* Addresses */}
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" fontWeight="700" mb={1} fontSize="0.85rem">Teslim alacak kişi</Typography>
                                    <Typography variant="body2" color="text.secondary">{orderData.customer.recipient}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" fontWeight="700" mb={1} fontSize="0.85rem">E-posta adresi</Typography>
                                    <Box display="flex" alignItems="flex-start">
                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{orderData.customer.email}</Typography>
                                        <CopyButton />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" fontWeight="700" mb={1} fontSize="0.85rem">Teslimat adresi</Typography>
                                    <Box display="flex" alignItems="flex-start">
                                        <Typography variant="body2" color="text.secondary">{orderData.address.delivery}</Typography>
                                        <CopyButton />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mt={1}>{orderData.customer.recipient}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" fontWeight="700" mb={1} fontSize="0.85rem">Fatura adresi</Typography>
                                    <Box display="flex" alignItems="flex-start">
                                        <Typography variant="body2" color="text.secondary">{orderData.address.invoice}</Typography>
                                        <CopyButton />
                                    </Box>
                                    <Typography variant="body2" fontWeight="600" mt={1} fontSize="0.85rem">{orderData.address.taxPayer}</Typography>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="caption" color="primary.main">{orderData.address.taxInfo}</Typography>
                                    </Stack>

                                    <Typography variant="subtitle2" fontWeight="700" mt={2} mb={1} fontSize="0.85rem">E-arşiv fatura</Typography>
                                    <Button variant="contained" color="warning" size="small" sx={{ bgcolor: '#ffe0b2', color: '#e65100', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#ffcc80' } }}>
                                        Faturayı Görüntüle
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Product List Card */}
                    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" fontWeight="600">Teslim edilen ürünler</Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color={hasInvoice ? "warning" : "primary"}
                                    onClick={() => setOpenAddInvoice(true)}
                                    sx={hasInvoice ? { bgcolor: '#fff3e0', color: '#ff6d00', border: 'none' } : {}}
                                >
                                    {hasInvoice ? "E-arşiv fatura değiştir" : "Fatura Ekle"}
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ bgcolor: '#ff6d00', color: 'white' }}
                                    onClick={() => window.open(`/orders/${orderId}/label`, '_blank')}
                                >
                                    Etiketi yazdır
                                </Button>
                            </Stack>
                        </Box>
                        <AddInvoiceDialog open={openAddInvoice} onClose={() => setOpenAddInvoice(false)} onSave={handleInvoiceSave} />
                        <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
                            <Typography variant="caption" color="text.secondary">Aşağıdaki fiyatlar birim üzerinden hesaplanmaktadır ve fiyatlara KDV dahildir.</Typography>
                        </Box>

                        <Box sx={{ p: 2 }}>
                            <Card variant="outlined" sx={{ p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        {/* Product Image Placeholder */}
                                        <Box sx={{ width: 60, height: 80, border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box component="img" src="https://via.placeholder.com/60x80" alt="Ürün" />
                                        </Box>
                                    </Grid>
                                    <Grid item xs>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight="600">{orderData.product.name}</Typography>
                                            <CopyButton />
                                        </Box>

                                        <Grid container spacing={4} sx={{ mt: 1 }}>
                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" fontWeight="600">Ürün Numarası</Typography>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography variant="body2">{orderData.product.sku}</Typography>
                                                    <OpenIcon sx={{ fontSize: 14, ml: 0.5, color: '#1976d2' }} />
                                                </Stack>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" fontWeight="600">Stok Kodu</Typography>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography variant="body2">{orderData.product.stockCode}</Typography>
                                                    <CopyButton />
                                                </Stack>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" fontWeight="600">Satış fiyatı</Typography>
                                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                                    {orderData.product.salesPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" fontWeight="600">Liste fiyatı <InfoIcon sx={{ fontSize: 12 }} /></Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {orderData.product.listPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="caption" display="block" color="text.secondary" fontWeight="600">Komisyonu <InfoIcon sx={{ fontSize: 12 }} /></Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {orderData.product.commission.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL (%{orderData.product.commissionRate})
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box>
                    </Paper>

                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => window.scrollTo(0, 0)}
                            sx={{ borderRadius: 5, textTransform: 'none' }}
                        >
                            Başa Dön
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderDetailPage;
