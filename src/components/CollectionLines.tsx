import React from 'react';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Divider,
  Grid,
  Box,
  Paper
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface CollectionLine {
  id: number;
  paymentType: string;
  checkOwner: string;
  dueDate: string;
  docNo: string;
  amount: number;
  description: string;
}

interface CollectionLinesProps {
  collectionLines: CollectionLine[];
}

const TotalRow = ({ label, value, isBold = false, isGreen = false }: { label: string, value: string, isBold?: boolean, isGreen?: boolean }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
    <Typography variant="body1" fontWeight={isBold ? 600 : 'normal'} color={isGreen ? 'success.main' : 'inherit'}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600} color={isGreen ? 'success.main' : 'inherit'}>
      {value}
    </Typography>
  </Box>
);

const CollectionLines: React.FC<CollectionLinesProps> = ({ collectionLines }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };

  const nakitTotal = collectionLines.filter(l => l.paymentType === 'Nakit').reduce((sum, l) => sum + l.amount, 0);
  const krediKartiTotal = collectionLines.filter(l => l.paymentType === 'Kredi Kartı').reduce((sum, l) => sum + l.amount, 0);
  const cekTotal = collectionLines.filter(l => l.paymentType === 'Çek').reduce((sum, l) => sum + l.amount, 0);
  const senetTotal = collectionLines.filter(l => l.paymentType === 'Senet').reduce((sum, l) => sum + l.amount, 0);
  const araToplam = nakitTotal + krediKartiTotal + cekTotal + senetTotal;
  const masrafToplam = 0; // Mock
  const vadeToplam = 0; // Mock
  const genelToplam = araToplam - masrafToplam;
  const cariyeIslenenTutar = araToplam;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Tahsilat Satırları</Typography>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Ödeme Tipi</TableCell>
              <TableCell>Çek & Senet Sahibi</TableCell>
              <TableCell>Vade Tarihi</TableCell>
              <TableCell>Evrak No</TableCell>
              <TableCell align="right">Tutar</TableCell>
              <TableCell>Açıklama</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionLines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>{line.paymentType}</TableCell>
                <TableCell>{line.checkOwner}</TableCell>
                <TableCell>{line.dueDate}</TableCell>
                <TableCell>{line.docNo}</TableCell>
                <TableCell align="right">{formatCurrency(line.amount)}</TableCell>
                <TableCell>
                  <Tooltip title={line.description || "Açıklama yok"}>
                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Grid container columnSpacing={4}>
          <Grid item xs={12} md={6}>
            <TotalRow label="NAKİT TOPLAM" value={formatCurrency(nakitTotal)} />
            <Divider />
            <TotalRow label="KREDİ KARTI TOPLAM" value={formatCurrency(krediKartiTotal)} />
            <Divider />
            <TotalRow label="ÇEK TOPLAM" value={formatCurrency(cekTotal)} />
            <Divider />
            <TotalRow label="SENET TOPLAM" value={formatCurrency(senetTotal)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TotalRow label="ARA TOPLAM" value={formatCurrency(araToplam)} />
            <Divider />
            <TotalRow label="MASRAF TOPLAM" value={formatCurrency(masrafToplam)} />
            <Divider />
            <TotalRow label="VADE TOPLAM" value={formatCurrency(vadeToplam)} />
            <Divider />
            <TotalRow label="GENEL TOPLAM" value={formatCurrency(genelToplam)} isBold />
            <Divider />
            <TotalRow label="CARİYE İŞLENECEK TUTAR" value={formatCurrency(cariyeIslenenTutar)} isBold isGreen />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CollectionLines;
