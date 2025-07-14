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
import { City } from '../../types/Country';

interface CityTableProps {
  cities: City[];
  countryName: string;
  page: number;
  rowsPerPage: number;
  onEditClick: (city: City) => void;
  onDeleteClick: (city: City) => void;
  onDetailsClick: (city: City) => void;
  onActiveChange?: (cityId: number) => void;
}

const CityTable: React.FC<CityTableProps> = ({
  cities,
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
            <TableCell>{translations.city}</TableCell>
            <TableCell>{translations.country}</TableCell>
            <TableCell>{translations.population}</TableCell>
            <TableCell align="center">{translations.districtCount}</TableCell>
            <TableCell align="center">{translations.customerCount}</TableCell>
            {onActiveChange && (
              <TableCell align="center">{translations.status}</TableCell>
            )}
            <TableCell align="center">{translations.actionButtons}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((city) => (
              <TableRow key={city.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">{city.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{countryName}</TableCell>
                <TableCell>{formatPopulation(city.population)}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={city.districts.length} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 'bold' }} 
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: city.customerCount > 1000 ? '#4caf50' : city.customerCount > 500 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {city.customerCount.toLocaleString()}
                  </Typography>
                </TableCell>
                {onActiveChange && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={true} // Bu kısmı city.isActive olarak değiştirebilirsiniz
                            onClick={() => onActiveChange(city.id)}
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
                        onClick={() => onDetailsClick(city)}
                        sx={{ color: '#0288d1' }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.edit}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditClick(city)}
                        sx={{ color: '#25638f' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.delete}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(city)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          {cities.length === 0 && (
            <TableRow>
              <TableCell colSpan={onActiveChange ? 7 : 6} align="center">
                <Typography variant="body1" sx={{ py: 3, color: 'text.secondary' }}>
                  {translations.noCitiesFound || "Arama kriterlerinize uygun şehir bulunamadı."}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CityTable;
