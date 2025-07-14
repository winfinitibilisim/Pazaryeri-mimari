import React from 'react';
import { Paper, Grid, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Box } from '@mui/material';

interface PrintableReceiptProps {
  details: any;
  customer: any;
  lines: any[];
}

const PrintableReceipt = React.forwardRef<HTMLDivElement, PrintableReceiptProps>(({ details, customer, lines }, ref) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  };

  const nakitTotal = lines.filter(l => l.paymentType === 'Nakit').reduce((sum, l) => sum + l.amount, 0);
  const krediKartiTotal = lines.filter(l => l.paymentType === 'Kredi Kartı').reduce((sum, l) => sum + l.amount, 0);
  const cekTotal = lines.filter(l => l.paymentType === 'Çek').reduce((sum, l) => sum + l.amount, 0);
  const senetTotal = lines.filter(l => l.paymentType === 'Senet').reduce((sum, l) => sum + l.amount, 0);
  const araToplam = nakitTotal + krediKartiTotal + cekTotal + senetTotal;
  const masrafToplam = 10.00;
  const vadeToplam = 0.00;
  const genelToplam = araToplam - masrafToplam;
  const cariyeIslenenTutar = araToplam;

  return (
    <Paper ref={ref} sx={{ position: 'relative', p: 4, width: '794px', minHeight: '1122px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', color: 'black', backgroundColor: 'white' }}>
      <Grid container justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4, borderBottom: '2px solid black', pb: 2 }}>
        <Grid item xs={4}>
          <Typography variant="body2"><strong>drm</strong></Typography>
          <Typography variant="body2"><strong>Telefon:</strong> 535 585 75 26</Typography>
          <Typography variant="body2"><strong>E-Posta:</strong> sakifog475@iridales.com</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{customer.name}</Typography>
          <Typography variant="body2"><strong>C/H Kodu:</strong> {customer.chCode}</Typography>
          <Typography variant="body2"><strong>Telefon:</strong> {customer.phone}</Typography>
          <Typography variant="body2"><strong>Fax:</strong> {customer.fax}</Typography>
          <Typography variant="body2"><strong>Vergi Dairesi:</strong> {customer.taxOffice}</Typography>
          <Typography variant="body2"><strong>Vergi No:</strong> {customer.taxId}</Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>TAHSİLAT MAKBUZU</Typography>
          <Typography variant="body1"><strong>TARİH:</strong> {details.date.split(' ')[0]}</Typography>
          <Typography variant="body1"><strong>EVRAK NO:</strong> {details.documentNumber}</Typography>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={0} sx={{ my: 2, border: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid black' }}>
              <TableCell sx={{ fontWeight: 'bold', border: 'none', pb: 1, width: '15%' }}>TİPİ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: 'none', pb: 1, width: '15%' }}>NO</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: 'none', pb: 1, width: '15%' }}>VADE TARİHİ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: 'none', pb: 1 }}>AÇIKLAMA</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: 'none', pb: 1, borderLeft: '1px solid black', width: '20%' }} align="right">TUTAR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: 'none', pt: 2 }}>{line.paymentType}</TableCell>
                <TableCell sx={{ border: 'none', pt: 2 }}>{line.docNo || ''}</TableCell>
                <TableCell sx={{ border: 'none', pt: 2 }}>{line.dueDate || ''}</TableCell>
                <TableCell sx={{ border: 'none', pt: 2 }}>{line.description}</TableCell>
                <TableCell sx={{ border: 'none', pt: 2, borderLeft: '1px solid black' }} align="right">{formatCurrency(line.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ mb: 1 }}><strong>AÇIKLAMA:</strong> {details.description}</Typography>
          <Box sx={{ p: 1, border: '1px solid #eee', height: '100%' }}>
            <Grid container justifyContent="space-between"><Typography variant="body2">NAKİT TOPLAM</Typography><Typography variant="body2">{formatCurrency(nakitTotal)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">KREDİ KARTI TOPLAM</Typography><Typography variant="body2">{formatCurrency(krediKartiTotal)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">ÇEK TOPLAM</Typography><Typography variant="body2">{formatCurrency(cekTotal)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">SENET TOPLAM</Typography><Typography variant="body2">{formatCurrency(senetTotal)}</Typography></Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
           <Box sx={{ p: 1, border: '1px solid #eee', height: '100%' }}>
            <Grid container justifyContent="space-between"><Typography variant="body2">ARA TOPLAM</Typography><Typography variant="body2">{formatCurrency(araToplam)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">MASRAF TOPLAM</Typography><Typography variant="body2">{formatCurrency(masrafToplam)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">VADE TOPLAM</Typography><Typography variant="body2">{formatCurrency(vadeToplam)}</Typography></Grid><Divider sx={{ my: 0.5 }} />
            <Grid container justifyContent="space-between"><Typography variant="body2" sx={{fontWeight: 'bold'}}>GENEL TOPLAM</Typography><Typography variant="body2" sx={{fontWeight: 'bold'}}>{formatCurrency(genelToplam)}</Typography></Grid><Divider sx={{ my: 0.5, borderBottomWidth: 'medium' }} />
            <Grid container justifyContent="space-between"><Typography variant="body2">CARİYE İŞLENEN TUTAR</Typography><Typography variant="body2">{formatCurrency(cariyeIslenenTutar)}</Typography></Grid>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ position: 'absolute', bottom: 40, width: 'calc(100% - 64px)' }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 4 }}>Yukarıda dökümü yapılan tutar tarafımızdan teslim alınmış ve cari hesabınıza alacak kaydedilmiştir.</Typography>
        <Grid container justifyContent="flex-end" spacing={10}>
            <Grid item>
                <Typography variant="body2">Teslim Eden</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body2">Teslim Alan</Typography>
            </Grid>
        </Grid>
      </Box>
    </Paper>
  );
});

export default PrintableReceipt;
