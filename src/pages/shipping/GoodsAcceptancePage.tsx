import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QuickAddProductModal from '../../components/products/QuickAddProductModal';

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField as DialogTextField } from '@mui/material';

const GoodsAcceptancePage: React.FC = () => {
  const [extraCosts, setExtraCosts] = React.useState([{ id: 1, name: 'Çuval Başı', value: 5 }]);

  const handleAddExtraCost = () => {
    setExtraCosts([...extraCosts, { id: Date.now(), name: '', value: 0 }]);
  };

  const handleRemoveExtraCost = (id: number) => {
    setExtraCosts(extraCosts.filter(cost => cost.id !== id));
  };

  const handleExtraCostChange = (id: number, field: 'name' | 'value', value: string) => {
    const newCosts = extraCosts.map(cost => {
      if (cost.id === id) {
        return { ...cost, [field]: field === 'value' ? parseFloat(value) || 0 : value };
      }
      return cost;
    });
    setExtraCosts(newCosts);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [items, setItems] = React.useState([
    { id: 1, name: 'Laptop', quantity: 1, kg: 50, volume: 1, munit: 'Adet', birimler: 'Çuval', price: 5, total: 3000 },
    { id: 2, name: 'Laptop', quantity: 1, kg: 50, volume: 1, munit: 'Adet', birimler: 'Çuval', price: 5, total: 3000 },
  ]);

  const [duplicateDialogOpen, setDuplicateDialogOpen] = React.useState(false);
  const [itemToDuplicate, setItemToDuplicate] = React.useState<any>(null);
  const [duplicateCount, setDuplicateCount] = React.useState(1);

  const handleOpenDuplicateDialog = (item: any) => {
    setItemToDuplicate(item);
    setDuplicateDialogOpen(true);
  };

  const handleCloseDuplicateDialog = () => {
    setDuplicateDialogOpen(false);
    setItemToDuplicate(null);
    setDuplicateCount(1);
  };

  const handleItemChange = (id: number, field: string, value: any) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'kg' || field === 'price') {
            const kg = field === 'kg' ? parseFloat(value) || 0 : updatedItem.kg;
            const price = field === 'price' ? parseFloat(value) || 0 : updatedItem.price;
            updatedItem.total = kg * price;
          }
          return updatedItem;
        }
        return item;
      });
      return newItems;
    });
  };

  const handleDuplicate = () => {
    if (!itemToDuplicate || duplicateCount < 1) return;

    const newItems = Array.from({ length: duplicateCount }).map((_, index) => ({
      ...itemToDuplicate,
      id: Date.now() + index,
    }));

    setItems([...items, ...newItems]);
    handleCloseDuplicateDialog();
  };

  const subTotal = React.useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items]);
  const extraCostsTotal = React.useMemo(() => extraCosts.reduce((acc, cost) => acc + cost.value, 0), [extraCosts]);
  const grandTotal = React.useMemo(() => subTotal + extraCostsTotal, [subTotal, extraCostsTotal]);

  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: '', quantity: 1, kg: 0, volume: 0, munit: 'Adet', birimler: 'Çuval', price: 0, total: 0 };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const [isM3ModalOpen, setIsM3ModalOpen] = React.useState(false);
  const [selectedItemIdForM3, setSelectedItemIdForM3] = React.useState<number | null>(null);
  const [m3Data, setM3Data] = React.useState({
    width: '',
    length: '',
    height: '',
    description: '',
    shippingPrice: '',
  });
  const [calculatedM3, setCalculatedM3] = React.useState(0);

  const handleOpenM3Modal = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setSelectedItemIdForM3(itemId);
    setIsM3ModalOpen(true);
    // For now, we only load the price. W/L/H/Desc could be loaded too if needed.
    setM3Data({
      width: '',
      length: '',
      height: '',
      description: '',
      shippingPrice: item.price.toString(),
    });
    setCalculatedM3(0);
  };

  const handleCloseM3Modal = () => {
    setIsM3ModalOpen(false);
    setSelectedItemIdForM3(null);
  };

  const handleM3DataChange = (field: keyof typeof m3Data, value: string) => {
    setM3Data(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    const width = parseFloat(m3Data.width) || 0;
    const length = parseFloat(m3Data.length) || 0;
    const height = parseFloat(m3Data.height) || 0;
    setCalculatedM3((width * length * height) / 1000000);
  }, [m3Data.width, m3Data.length, m3Data.height]);

  const handleSaveM3Data = () => {
    if (selectedItemIdForM3 === null) return;

    // Update the item's price using the existing handler
    handleItemChange(selectedItemIdForM3, 'price', parseFloat(m3Data.shippingPrice) || 0);

    console.log('Saving m3 data for item:', selectedItemIdForM3, { ...m3Data, m3: calculatedM3 });
    // Here you would also save width, length, height, and description if needed
    handleCloseM3Modal();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mal Kabul
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={4}>
          {/* Alıcı Bölümü */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Alıcı
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>Ahmet Yılmaz</Typography>
              </Box>
              <Button size="small" endIcon={<AddIcon />}>
                Ekle
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Orhan Mah. Test Cad. No:1 D:2, İstanbul
              <br />
              Vergi Dairesi: Maslak - Vergi No: 1234567890
            </Typography>
          </Grid>

          {/* Satıcı Bölümü */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Satıcı
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>Ahmet Yılmaz</Typography>
              </Box>
              <Button size="small" endIcon={<AddIcon />}>
                Ekle
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Orhan Mah. Test Cad. No:1 D:2, İstanbul
              <br />
              Vergi Dairesi: Maslak - Vergi No: 1234567890
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Gönderim Tipi */}
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Gönderim Tipi" defaultValue="TIR" SelectProps={{ native: true }}>
            <option value="TIR">TIR</option>
            <option value="Uçak">Uçak</option>
            <option value="Gemi">Gemi</option>
          </TextField>
        </Grid>

        {/* Gönderim Nedeni */}
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Gönderim Nedeni" defaultValue="Satış" SelectProps={{ native: true }}>
            <option value="Satış">Satış</option>
            <option value="İade">İade</option>
            <option value="Numune">Numune</option>
          </TextField>
        </Grid>

        {/* Sıvı, Pil veya Kimyasal mı? */}
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Sıvı, Pil veya Kimyasal mı?" defaultValue="Hayır" SelectProps={{ native: true }}>
            <option value="Evet">Evet</option>
            <option value="Hayır">Hayır</option>
          </TextField>
        </Grid>

        {/* Kargo Fiyatı */}
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Kargo Fiyatı" defaultValue="Rusya (5 usd)" SelectProps={{ native: true }}>
            <option value="Rusya (5 usd)">Rusya (5 usd)</option>
            <option value="ABD (10 usd)">ABD (10 usd)</option>
          </TextField>
        </Grid>

        {/* Açıklama */}
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Açıklama" variant="outlined" />
        </Grid>

        {/* Para Birimi */}
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Para Birimi" defaultValue="USD" SelectProps={{ native: true }}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="TRY">TRY</option>
          </TextField>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {items.map((item, index) => (
        <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12}>
              <TextField fullWidth label="Ürün Adı / Açıklama" value={item.name} variant="outlined" onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}><TextField fullWidth label="Miktar" value={item.quantity} variant="outlined" type="number" onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} /></Grid>
            <Grid item xs={6} sm={4} md={2}><TextField fullWidth label="KG" value={item.kg} variant="outlined" type="number" onChange={(e) => handleItemChange(item.id, 'kg', e.target.value)} /></Grid>
            <Grid item xs={6} sm={4} md={2}><TextField fullWidth label="Hacim" value={item.volume} variant="outlined" type="number" onChange={(e) => handleItemChange(item.id, 'volume', e.target.value)} /></Grid>
            <Grid item xs={6} sm={4} md={2}><TextField select fullWidth label="Munit" value={item.munit} SelectProps={{ native: true }} onChange={(e) => handleItemChange(item.id, 'munit', e.target.value)}><option>Adet</option></TextField></Grid>
            <Grid item xs={6} sm={4} md={2}><TextField select fullWidth label="Birimler" value={item.birimler} SelectProps={{ native: true }} onChange={(e) => handleItemChange(item.id, 'birimler', e.target.value)}><option>Çuval</option></TextField></Grid>
            
            <Grid item xs={6} sx={{ mt: { xs: 2, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Satır Numarası: {index + 1}/{items.length}
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  Kargo Fiyatı: {item.price}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', mt: { xs: 2, md: 0 } }}>
              <Typography variant="h6">${item.total.toFixed(2)}</Typography>
              <Button size="small" startIcon={<ContentCopyIcon />} sx={{ mr: 1, textTransform: 'none' }} onClick={() => handleOpenDuplicateDialog(item)}>Çoğalt</Button>
              <Button size="small" startIcon={<AddCircleOutlineIcon />} sx={{ mr: 1, textTransform: 'none' }} onClick={() => handleOpenM3Modal(item.id)}>İşlem Ekle</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleRemoveItem(item.id)}>Sil</Button>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mr: 1 }}>
          Kalem Ekle
        </Button>
        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => setIsModalOpen(true)}>
          Yeni Ürün Ekle
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Notlar Bölümü */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Notlar</Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Fatura ile ilgili notlarınızı buraya ekleyebilirsiniz..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Toplamlar Bölümü */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Toplamlar</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Ara Toplam Kg Fiyatı</Typography>
              <Typography variant="body1">${subTotal.toFixed(2)}</Typography>
            </Box>
            {extraCosts.map((cost, index) => (
              <Box key={cost.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <TextField variant="outlined" size="small" placeholder="Ek maliyet" value={cost.name} onChange={(e) => handleExtraCostChange(cost.id, 'name', e.target.value)} sx={{ flexGrow: 1, mr: 1 }} />
                <TextField size="small" sx={{ width: '100px' }} value={cost.value} type="number" onChange={(e) => handleExtraCostChange(cost.id, 'value', e.target.value)} />
                <IconButton onClick={() => handleRemoveExtraCost(cost.id)} size="small" sx={{ ml: 0.5 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleAddExtraCost} size="small">
                    <AddCircleOutlineIcon />
                </IconButton>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">GENEL TOPLAM</Typography>
              <Typography variant="h6">${grandTotal.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box>
              <Typography variant="body2">Toplam Paket : 1</Typography>
              <Typography variant="body2">Toplam Adet : 50</Typography>
              <Typography variant="body2">Toplam Kg : 1</Typography>
              <Typography variant="body2">Toplam Hacim: 1</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" color="secondary" sx={{ mr: 2 }}>
          Vazgeç
        </Button>
        <Button variant="contained">
          Kaydet
        </Button>
      </Box>

      <Dialog open={isM3ModalOpen} onClose={handleCloseM3Modal} maxWidth="sm" fullWidth>
        <DialogTitle>İşlem Ekle - M³ Hesaplama</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="En (cm)"
                type="number"
                value={m3Data.width}
                onChange={(e) => handleM3DataChange('width', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Boy (cm)"
                type="number"
                value={m3Data.length}
                onChange={(e) => handleM3DataChange('length', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Yükseklik (cm)"
                type="number"
                value={m3Data.height}
                onChange={(e) => handleM3DataChange('height', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">
                  Hesaplanan M³: {calculatedM3.toFixed(4)}
                </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kargo Fiyatı"
                type="number"
                value={m3Data.shippingPrice}
                onChange={(e) => handleM3DataChange('shippingPrice', e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Paket Açıklaması"
                multiline
                rows={3}
                value={m3Data.description}
                onChange={(e) => handleM3DataChange('description', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseM3Modal}>Vazgeç</Button>
          <Button onClick={handleSaveM3Data} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      <QuickAddProductModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Dialog open={duplicateDialogOpen} onClose={handleCloseDuplicateDialog}>
        <DialogTitle>Ürünü Çoğalt</DialogTitle>
        <DialogContent>
          <DialogTextField
            autoFocus
            margin="dense"
            label="Kaç adet kopyalansın?"
            type="number"
            fullWidth
            variant="standard"
            value={duplicateCount}
            onChange={(e) => setDuplicateCount(parseInt(e.target.value, 10))}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDuplicateDialog}>Vazgeç</Button>
          <Button onClick={handleDuplicate}>Ekle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoodsAcceptancePage;
