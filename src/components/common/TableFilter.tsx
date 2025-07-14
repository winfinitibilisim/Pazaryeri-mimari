import React, { useState } from 'react';
import {
  Button,
  Popover,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import LoginIcon from '@mui/icons-material/Login';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Filtre seçeneği tipi
export interface FilterOption {
  id: string;
  label: string;
  color: string;
  icon?: React.ReactNode;
  backgroundColor: string;
}

// TableFilter bileşeni props tipi
interface TableFilterProps {
  title?: string;
  options: FilterOption[];
  onFilterChange: (selectedFilters: string[]) => void;
  initialFilters?: string[];
}

const TableFilter: React.FC<TableFilterProps> = ({
  title = 'İşlem Türü',
  options,
  onFilterChange,
  initialFilters = []
}) => {
  // Popover açılma durumu
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // Seçili filtreler
  const [selectedFilters, setSelectedFilters] = useState<string[]>(initialFilters);

  // Popover açma fonksiyonu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Popover kapatma fonksiyonu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Filtre seçme/kaldırma fonksiyonu
  const handleFilterToggle = (filterId: string) => {
    const newSelectedFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(id => id !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newSelectedFilters);
    onFilterChange(newSelectedFilters);
  };

  // Popover açık mı?
  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleClick}
        aria-describedby={id}
        sx={{
          borderRadius: 2,
          borderColor: '#ccc',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }
        }}
      >
        Filtrele
        {selectedFilters.length > 0 && (
          <Chip 
            size="small" 
            label={selectedFilters.length} 
            color="primary" 
            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
          />
        )}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
            mt: 1
          }
        }}
      >
        <Paper sx={{ width: 280, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            {title}
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Stack spacing={1.5}>
            {options.map((option) => (
              <Button
                key={option.id}
                variant="contained"
                startIcon={option.icon}
                onClick={() => handleFilterToggle(option.id)}
                sx={{
                  backgroundColor: option.backgroundColor,
                  color: option.color,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: option.backgroundColor,
                    opacity: 0.9,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  },
                  border: selectedFilters.includes(option.id) ? '2px solid #333' : 'none',
                }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Popover>
    </>
  );
};

// Örnek kullanım için varsayılan filtre seçenekleri
export const defaultFilterOptions: FilterOption[] = [
  {
    id: 'login',
    label: 'Giriş yapıldı',
    color: '#ffffff',
    backgroundColor: '#2196f3',
    icon: <LoginIcon />
  },
  {
    id: 'product_added',
    label: 'Ürün eklendi',
    color: '#ffffff',
    backgroundColor: '#4caf50',
    icon: <AddCircleIcon />
  },
  {
    id: 'code_updated',
    label: 'Kod: A-98',
    color: '#ffffff',
    backgroundColor: '#ff9800',
    icon: <EditIcon />
  },
  {
    id: 'product_deleted',
    label: 'Ürün silindi',
    color: '#ffffff',
    backgroundColor: '#f50057',
    icon: <DeleteIcon />
  }
];

export default TableFilter;
