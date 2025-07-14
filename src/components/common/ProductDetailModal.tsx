import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Ürün Detayı
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Sol Taraf - Ürün Resmi */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Images
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={product.imageUrl}
                    variant="rounded"
                    sx={{
                      width: '100%',
                      height: 200,
                      mb: 1,
                      bgcolor: '#f0f0f0',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    product-1.png
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Primary
                  </Typography>
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Stock & invetory
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ width: '40%', color: 'text.secondary', py: 1.5 }}>
                        SKU
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {product.sku || '401_1BBXBK'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5 }}>
                        Barcode
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        None
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5 }}>
                        Quantity
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {product.qty || 10}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5 }}>
                        Height
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        25 cm
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          {/* Sağ Taraf - Ürün Bilgileri */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Basic Info
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '30%', color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="body2" fontWeight={500}>
                            {product.name}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Description
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="body2">
                            {product.description || 'Premium quality product with modern design.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Category
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                mr: 1,
                                bgcolor: 
                                  product.category === 'Electronics' ? '#e8e6ff' :
                                  product.category === 'Giyim' ? '#e6f7ff' :
                                  product.category === 'Accessories' ? '#ffebe6' :
                                  product.category === 'Shoes' ? '#e6ffe8' :
                                  product.category === 'Office' ? '#fff9e6' :
                                  product.category === 'Home Decor' ? '#e6f9ff' : '#f0f0f0'
                              }}
                            >
                              {product.category === 'Electronics' ? (
                                <Box component="span" sx={{ color: '#5045e4', fontSize: 14 }}>💻</Box>
                              ) : product.category === 'Giyim' ? (
                                <Box component="span" sx={{ color: '#4091db', fontSize: 14 }}>👕</Box>
                              ) : product.category === 'Accessories' ? (
                                <Box component="span" sx={{ color: '#e44545', fontSize: 14 }}>🎧</Box>
                              ) : product.category === 'Shoes' ? (
                                <Box component="span" sx={{ color: '#45e454', fontSize: 14 }}>👟</Box>
                              ) : product.category === 'Office' ? (
                                <Box component="span" sx={{ color: '#e4a045', fontSize: 14 }}>💼</Box>
                              ) : product.category === 'Home Decor' ? (
                                <Box component="span" sx={{ color: '#45c4e4', fontSize: 14 }}>🏠</Box>
                              ) : (
                                <Box component="span" sx={{ color: '#808080', fontSize: 14 }}>📦</Box>
                              )}
                            </Avatar>
                            <Typography variant="body2">{product.category}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              color: product.status === 'Aktif' ? '#1976d2' : '#7f8c8d',
                              bgcolor: product.status === 'Aktif' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(127, 140, 141, 0.1)',
                            }}
                          >
                            {product.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Color
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                mr: 1,
                                bgcolor: 
                                  product.color === 'Kırmızı' ? '#ff0000' :
                                  product.color === 'Mavi' ? '#0000ff' :
                                  product.color === 'Siyah' ? '#000000' :
                                  product.color === 'Beyaz' ? '#f5f5f5' :
                                  product.color === 'Yeşil' ? '#00ff00' :
                                  product.color === 'Sarı' ? '#ffff00' :
                                  product.color === 'Mor' ? '#800080' :
                                  product.color === 'Turuncu' ? '#ffa500' : '#cccccc',
                                border: product.color === 'Beyaz' ? '1px solid #e0e0e0' : 'none'
                              }}
                            />
                            <Typography variant="body2">{product.color}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pricing
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: 2
                }}
              >
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" sx={{ width: '30%', color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Price
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="body2" fontWeight={500}>
                            {product.price?.toFixed(2)} ₺
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Cost price
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="body2">
                            {(product.price * 0.7).toFixed(2)} ₺
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          Tax rate
                        </TableCell>
                        <TableCell sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                          <Typography variant="body2">
                            18%
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" sx={{ color: 'text.secondary', py: 1.5 }}>
                          Discount
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2">
                            No discount
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
