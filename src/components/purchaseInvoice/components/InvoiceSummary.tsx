import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
  Paper,
  useMediaQuery
} from '@mui/material';
import { PurchaseTotalsData, formatCurrency } from './types';

interface InvoiceSummaryProps {
  totals: PurchaseTotalsData;
  currency?: string;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ totals, currency = 'TRY' }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { subtotal, discountAmount, taxAmount, total } = totals;

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end',
      width: '100%',
      mb: 2,
      mt: 2
    }}>
      <Paper 
        elevation={isMobile ? 1 : 2} 
        sx={{ 
          width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' },
          ml: 'auto',
          p: { xs: 1, sm: 2 },
          borderRadius: 1,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Typography 
          variant={isMobile ? "subtitle2" : "subtitle1"} 
          sx={{ 
            mb: 1, 
            fontWeight: 'medium',
            pl: 1
          }}
        >
          {t('summary')}
        </Typography>
        
        <Table size="small" sx={{ 
          '& .MuiTableCell-root': {
            padding: { xs: '6px 4px', sm: '10px 8px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            borderBottom: 'none',
            color: theme.palette.text.primary
          }
        }}>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {t('subtotal')}:
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {formatCurrency(subtotal, currency)}
                </Typography>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {t('discount')}:
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                  -{formatCurrency(discountAmount, currency)}
                </Typography>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {t('tax')}:
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {formatCurrency(taxAmount, currency)}
                </Typography>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell sx={{ 
                borderTop: `1px solid ${theme.palette.divider}`, 
                pt: 1 
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {t('total')}:
                </Typography>
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  borderTop: `1px solid ${theme.palette.divider}`, 
                  pt: 1 
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(total, currency)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default InvoiceSummary;
