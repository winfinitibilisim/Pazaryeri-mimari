import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Safe } from '../../../types/Safe';

interface SafesListProps {
  safes: Safe[];
  onEdit: (safe: Safe) => void;
  onDelete: (safeId: string) => void;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
};

const SafesList: React.FC<SafesListProps> = ({ safes, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="safes table">
        <TableHead>
          <TableRow>
            <TableCell>{t('safes.safeCode')}</TableCell>
            <TableCell>{t('safes.safeName')}</TableCell>
            <TableCell>{t('safes.iban')}</TableCell>
            <TableCell>{t('safes.currency')}</TableCell>
            <TableCell align="right">{t('safes.balance')}</TableCell>
            <TableCell align="center">{t('common.status')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safes.map((safe) => (
            <TableRow key={safe.id} hover>
              <TableCell>{safe.id}</TableCell>
              <TableCell>{safe.name}</TableCell>
              <TableCell>{safe.iban}</TableCell>
              <TableCell>{safe.currency}</TableCell>
              <TableCell align="right">
                <Typography component="span" sx={{ color: safe.balance < 0 ? 'error.main' : 'primary.main', fontWeight: 'bold' }}>
                  {formatCurrency(safe.balance, safe.currency)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={safe.isActive ? t('common.active') : t('common.inactive')}
                  color={safe.isActive ? 'warning' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                                <Tooltip title={t('common.view_details') as string}>
                  <IconButton size="small" onClick={() => navigate(`/safes/${safe.id}`)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                                <Tooltip title={t('common.edit') as string}>
                  <IconButton size="small" onClick={() => onEdit(safe)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                                <Tooltip title={t('common.delete') as string}>
                  <IconButton size="small" onClick={() => onDelete(safe.id)}>
                    <DeleteIcon fontSize="small" />
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

export default SafesList;
