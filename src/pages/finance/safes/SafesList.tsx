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
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="safes table">
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: '#f8fafc',
            '& .MuiTableCell-head': {
              fontWeight: 600,
              color: '#374151',
              borderBottom: 'none',
              py: 2
            }
          }}>
            <TableCell>Kasa Kodu</TableCell>
            <TableCell>Kasa Adı</TableCell>
            <TableCell>IBAN</TableCell>
            <TableCell>Para Birimi</TableCell>
            <TableCell align="right">Bakiye</TableCell>
            <TableCell align="center">Durum</TableCell>
            <TableCell align="right">İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safes.map((safe, index) => (
            <TableRow 
              key={safe.id} 
              sx={{
                backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.2s ease-in-out',
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  py: 2
                }
              }}
            >
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#25638f' }}>
                  {safe.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    backgroundColor: safe.type === 'bank' ? '#25638f' : '#fd7e14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {safe.type === 'bank' ? (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>B</Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>K</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {safe.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {safe.type === 'bank' ? 'Banka Hesabı' : 'Nakit Kasa'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {safe.iban || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={safe.currency}
                  size="small"
                  sx={{
                    backgroundColor: '#e2e8f0',
                    color: '#374151',
                    fontWeight: 600
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: safe.balance < 0 ? '#dc2626' : '#059669', 
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  {formatCurrency(safe.balance, safe.currency)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={safe.isActive ? 'Aktif' : 'Pasif'}
                  color={safe.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    ...(safe.isActive ? {
                      backgroundColor: '#dcfce7',
                      color: '#166534'
                    } : {
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280'
                    })
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Detayları Görüntüle">
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/safes/${safe.id}`)}
                      sx={{
                        color: '#6b7280',
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                          color: '#25638f'
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Düzenle">
                    <IconButton 
                      size="small" 
                      onClick={() => onEdit(safe)}
                      sx={{
                        color: '#6b7280',
                        '&:hover': {
                          backgroundColor: '#fef3c7',
                          color: '#d97706'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton 
                      size="small" 
                      onClick={() => onDelete(safe.id)}
                      sx={{
                        color: '#6b7280',
                        '&:hover': {
                          backgroundColor: '#fee2e2',
                          color: '#dc2626'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SafesList;
