import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Tooltip, Chip, Box
} from '@mui/material';
import { Visibility as VisibilityIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

// This should eventually come from a types file
interface Transaction {
  id: number;
  date: string;
  type: 'Giriş' | 'Çıkış';
  description: string;
  amount: number;
  balance: number;
  status: string;
}

interface SafeTransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

const formatCurrency = (amount: number, currency: string = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
};

const SafeTransactionTable: React.FC<SafeTransactionTableProps> = ({ transactions, onViewDetails }) => {
  const { t } = useTranslation();

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Tamamlandı':
        return <Chip label={t('safes.statusCompleted')} color="success" size="small" />;
      case 'Beklemede':
        return <Chip label={t('safes.statusPending')} color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="safe transactions table">
        <TableHead sx={{ '& .MuiTableCell-root': { backgroundColor: 'grey.200' } }}>
          <TableRow>
            <TableCell>{t('safes.transactionDate')}</TableCell>
            <TableCell>{t('safes.transactionType')}</TableCell>
            <TableCell>{t('safes.transactionDescription')}</TableCell>
            <TableCell align="right">{t('safes.transactionAmount')}</TableCell>
            <TableCell align="right">{t('safes.transactionBalance')}</TableCell>
            <TableCell align="center">{t('safes.transactionStatus')}</TableCell>
            <TableCell align="center">{t('safes.transactionActions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{new Date(transaction.date).toLocaleDateString('tr-TR')}</TableCell>
              <TableCell>
                <Typography variant="body2" color={transaction.type === 'Giriş' ? 'success.main' : 'error.main'} sx={{ fontWeight: 'medium' }}>
                  {transaction.type === 'Giriş' ? t('safes.typeCredit') : t('safes.typeDebit')}
                </Typography>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" color={transaction.amount > 0 ? 'inherit' : 'error.main'}>
                  {formatCurrency(transaction.amount)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {formatCurrency(transaction.balance)}
                </Typography>
              </TableCell>
              <TableCell align="center">{getStatusChip(transaction.status)}</TableCell>
              <TableCell align="center">
                <Tooltip title={t('common.view_details') as string}>
                  <IconButton size="small" onClick={() => onViewDetails(transaction)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common.export_pdf') as string}>
                  <IconButton size="small">
                    <PdfIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SafeTransactionTable;
