import React, { useEffect } from 'react';
import { Box, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';

const OrderLabelPage: React.FC = () => {
    const { orderId } = useParams();

    // Mock Data (In a real app, fetch using orderId)
    const data = {
        orderNumber: '4146659772',
        barcode: '62154321253040',
        cargoCompany: 'Yurtiçi Kargo',
        deliveryInfo: {
            recipient: 'Gülseren Büber',
            address: '9 EYLÜL / MENEMEN / İzmir\n9 eylül mah. 251. Sok. Helin Apt.\nNo:5/1 Kat:3 Daire:19 35663\nUlukent - Menemen / İzmir'
        },
        invoiceInfo: {
            recipient: 'Gonca Gül Çakır',
            address: 'ÇAĞLAYAN / MURATPAŞA / Antalya\nÇağlayan mah. 2033 sok. Doğa Birlik\nSitesi A blok Kat:2 No:4',
            taxPayer: 'Gonca Gül Çakır',
            taxInfo: 'Bireysel Müşteri'
        },
        seller: {
            name: 'Winfiniti A.Ş. (WİNFİNİTİ BİLİŞİM PROMOSYON GİYİM VE TURİZM ANONİM ŞİRKETİ)'
        },
        order: {
            number: '4146659772'
        },
        products: [
            { name: 'Ekinezya Ekstraktı', stockCode: 'EKİNEZYA-E', quantity: 1 }
        ]
    };

    useEffect(() => {
        // Auto-print when loaded
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    return (
        <Box sx={{
            width: '210mm',
            minHeight: '297mm',
            mx: 'auto',
            bgcolor: 'white',
            p: 4,
            '@media print': {
                margin: 0,
                padding: '20px',
                width: '100%',
                height: '100%'
            }
        }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: '#ff6d00', fontWeight: 'bold' }}>hepsiburada</Typography>
            </Box>

            {/* Barcode Section */}
            <Box sx={{ border: '1px solid #000', p: 3, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    {/* Mock Barcode */}
                    <Box sx={{ height: 60, width: 200, bgcolor: '#000', mb: 1, maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}>
                        {/* CSS Mock Barcode */}
                        <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 5px)' }}></div>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">{data.barcode}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="#1a237e">X {data.cargoCompany}</Typography>
                    <Typography variant="caption">{data.cargoCompany}</Typography>
                </Box>
            </Box>

            {/* Info Grid 1 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Teslimat Bilgileri</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Teslim Alacak Kişi</Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ mb: 2 }}>{data.deliveryInfo.recipient}</Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>Semt/İlçe/İl</Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ mb: 2 }}>{data.deliveryInfo.address.split('\n')[0]}</Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>Teslimat Adresi</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{data.deliveryInfo.address.split('\n').slice(1).join('\n')}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Fatura Bilgileri</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Müşteri Adı</Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ mb: 2 }}>{data.invoiceInfo.recipient}</Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>Semt/İlçe/İl</Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ mb: 2 }}>{data.invoiceInfo.address.split('\n')[0]}</Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>Fatura Adresi</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{data.invoiceInfo.address.split('\n').slice(1).join('\n')}</Typography>

                    <Typography variant="body2" fontWeight="bold" mt={1}>{data.invoiceInfo.taxPayer}</Typography>
                    <Typography variant="caption">{data.invoiceInfo.taxInfo}</Typography>
                </Grid>
            </Grid>

            {/* Info Grid 2 */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Satıcı Bilgileri</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Satıcı Adı</Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'uppercase' }}>{data.seller.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>Sipariş Bilgileri</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>Sipariş Numarası</Typography>
                    <Typography variant="body2" fontWeight="500">{data.order.number}</Typography>
                </Grid>
            </Grid>

            {/* Products Table */}
            <Box>
                <Typography variant="subtitle2" fontWeight="bold" mb={2}>Ürünler</Typography>
                <TableContainer>
                    <Table size="small" sx={{ '& .MuiTableCell-root': { border: 'none', px: 0 } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="caption" color="text.secondary">Ürün Adı</Typography></TableCell>
                                <TableCell><Typography variant="caption" color="text.secondary">Stok Kodu</Typography></TableCell>
                                <TableCell align="right"><Typography variant="caption" color="text.secondary">Adet</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.products.map((product, index) => (
                                <TableRow key={index}>
                                    <TableCell><Typography variant="body2" fontWeight="500">{product.name}</Typography></TableCell>
                                    <TableCell><Typography variant="body2">{product.stockCode}</Typography></TableCell>
                                    <TableCell align="right"><Typography variant="body2">{product.quantity}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default OrderLabelPage;
