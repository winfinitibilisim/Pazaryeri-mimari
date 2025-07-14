import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  IconButton,
  Radio,
  FormControlLabel,
  Tooltip,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { District } from '../../types/Country';

interface DistrictTableProps {
  districts: District[];
  cityName: string;
  countryName: string;
  page: number;
  rowsPerPage: number;
  onEditClick: (district: District) => void;
  onDeleteClick: (district: District) => void;
  onDetailsClick: (district: District) => void;
  onActiveChange?: (districtId: number) => void;
}

const DistrictTable: React.FC<DistrictTableProps> = ({
  districts,
  cityName,
  countryName,
  page,
  rowsPerPage,
  onEditClick,
  onDeleteClick,
  onDetailsClick,
  onActiveChange
}) => {
  const { translations } = useLanguage();
  // Nüfus bilgisini formatla
  const formatPopulation = (population: number): string => {
    return population.toLocaleString();
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{translations.district}</TableCell>
            <TableCell>{translations.city}</TableCell>
            <TableCell>{translations.country}</TableCell>
            <TableCell>{translations.population}</TableCell>
            <TableCell align="center">{translations.customerCount}</TableCell>
            {onActiveChange && (
              <TableCell align="center">{translations.status}</TableCell>
            )}
            <TableCell align="center">{translations.actionButtons}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {districts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((district) => (
              <TableRow key={district.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">{district.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{cityName}</TableCell>
                <TableCell>{countryName}</TableCell>
                <TableCell>{formatPopulation(district.population)}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: district.customerCount > 500 ? '#4caf50' : district.customerCount > 200 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {district.customerCount.toLocaleString()}
                  </Typography>
                </TableCell>
                {onActiveChange && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={true} // Bu kısmı district.isActive olarak değiştirebilirsiniz
                            onClick={() => onActiveChange(district.id)}
                            sx={{
                              color: '#9e9e9e',
                              '&.Mui-checked': {
                                color: '#4caf50',
                              },
                            }}
                          />
                        }
                        label={translations.active}
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',
                            color: '#4caf50',
                            fontWeight: 500
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                )}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title={translations.view}>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onDetailsClick(district)}
                        sx={{ color: '#0288d1' }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.edit}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditClick(district)}
                        sx={{ color: '#25638f' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.delete}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(district)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          {districts.length === 0 && (
            <TableRow>
              <TableCell colSpan={onActiveChange ? 7 : 6} align="center">
                <Typography variant="body1" sx={{ py: 3, color: 'text.secondary' }}>
                  {translations.noDistrictsFound || "Arama kriterlerinize uygun ilçe bulunamadı."}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DistrictTable;
