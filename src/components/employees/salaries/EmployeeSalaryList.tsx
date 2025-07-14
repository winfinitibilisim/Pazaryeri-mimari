import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEmployeeSalaries } from '../../../hooks/useEmployeeSalaries';
import EmployeeSalaryStatusChip from './EmployeeSalaryStatusChip';
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const EmployeeSalaryList: React.FC = () => {
  const { t } = useTranslation();
  const { salaries, loading, error } = useEmployeeSalaries();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <Typography>{t('loading')}</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'TRY':
        return '₺';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return currency;
    }
  };

  return (
    <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: 'grey.200', fontWeight: 'bold' } }}>
              <TableCell>{t('employeeName')}</TableCell>
              <TableCell>{t('paymentDate')}</TableCell>
              <TableCell align="right">{t('amount')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((salary) => (
              <TableRow hover key={salary.id}>
                <TableCell>{salary.employeeName}</TableCell>
                <TableCell>{format(new Date(salary.paymentDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell align="right">
                  {`${salary.amount.toLocaleString('tr-TR')} ${getCurrencySymbol(salary.currency)}`}
                </TableCell>
                <TableCell>
                  <EmployeeSalaryStatusChip status={salary.status} />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={salaries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t('rowsPerPage')}
      />
    </Paper>
  );
};

export default EmployeeSalaryList;
