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
  Tooltip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { Country } from '../../types/Country';
import { getContinentLabel } from '../../data/countriesData';

interface CountryTableProps {
  countries: Country[];
  page: number;
  rowsPerPage: number;
  onEditClick: (country: Country) => void;
  onDeleteClick: (country: Country) => void;
  onDetailsClick: (country: Country) => void;
  onActiveChange: (countryId: number) => void;
  onDefaultChange: (countryId: number) => void;
}

const CountryTable: React.FC<CountryTableProps> = ({
  countries,
  page,
  rowsPerPage,
  onEditClick,
  onDeleteClick,
  onDetailsClick,
  onActiveChange,
  onDefaultChange
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
            <TableCell>{translations.country}</TableCell>
            <TableCell>{translations.code || "Kod"}</TableCell>
            <TableCell>{translations.capital}</TableCell>
            <TableCell>{translations.continent}</TableCell>
            <TableCell>{translations.population}</TableCell>
            <TableCell align="center">{translations.customerCount}</TableCell>
            <TableCell align="center">{translations.defaultCountry}</TableCell>
            <TableCell align="center">{translations.status}</TableCell>
            <TableCell align="center">{translations.actionButtons}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((country) => (
              <TableRow key={country.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1">{country.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{country.code}</TableCell>
                <TableCell>{country.capital}</TableCell>
                <TableCell>{getContinentLabel(country.continent)}</TableCell>
                <TableCell>{formatPopulation(country.population)}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: country.customerCount > 3000 ? '#4caf50' : country.customerCount > 1000 ? '#ff9800' : '#f44336'
                    }}
                  >
                    {country.customerCount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Radio
                    checked={country.isDefault}
                    onChange={() => onDefaultChange(country.id)}
                    sx={{
                      color: '#25638f',
                      '&.Mui-checked': {
                        color: '#25638f',
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={country.isActive}
                          onClick={() => onActiveChange(country.id)}
                          sx={{
                            color: '#9e9e9e',
                            '&.Mui-checked': {
                              color: '#4caf50',
                            },
                          }}
                        />
                      }
                      label={country.isActive ? translations.active : translations.inactive}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.875rem',
                          color: country.isActive ? '#4caf50' : '#f44336',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title={translations.view}>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => onDetailsClick(country)}
                        sx={{ color: '#0288d1' }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.edit}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditClick(country)}
                        sx={{ color: '#25638f' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.delete}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(country)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          {countries.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Typography variant="body1" sx={{ py: 3, color: 'text.secondary' }}>
                  {translations.noCountriesFound || "Arama kriterlerinize uygun ülke bulunamadı."}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CountryTable;
