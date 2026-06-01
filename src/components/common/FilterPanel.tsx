import React, { useState, ReactNode } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
  Stack,
  Divider,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';

export interface FilterFieldOption {
  value: string | number;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'numberrange' | 'daterange' | 'custom';
  options?: FilterFieldOption[];
  component?: ReactNode;
  placeholder?: string;
}

interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  
  fields?: FilterField[];
  onAdvancedSearch?: (filters: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  
  // Custom action buttons like Export can be passed here
  actionButtons?: ReactNode;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Ara...',
  fields = [],
  onAdvancedSearch,
  initialValues = {},
  actionButtons
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>(initialValues);

  const hasAdvancedFilters = fields.length > 0;

  const handleFilterChange = (fieldId: string, value: any, part?: 'min' | 'max' | 'startDate' | 'endDate') => {
    setFilters(prev => {
      if (part) {
        const existingRange = prev[fieldId] || {};
        return {
          ...prev,
          [fieldId]: { ...existingRange, [part]: value }
        };
      }
      return { ...prev, [fieldId]: value };
    });
  };

  const handleApply = () => {
    if (onAdvancedSearch) {
      onAdvancedSearch(filters);
    }
  };

  const handleReset = () => {
    setFilters({});
    if (onAdvancedSearch) {
      onAdvancedSearch({});
    }
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder={field.placeholder || ''}
              value={filters[field.id] || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        );
      case 'select':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={filters[field.id] || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <option value="">{field.placeholder || 'Seçiniz'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
        );
      case 'date':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={filters[field.id] || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        );
      case 'number':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder={field.placeholder || ''}
              value={filters[field.id] || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        );
      case 'custom':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            {field.component}
          </Box>
        );
      case 'numberrange':
      case 'daterange':
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>{field.label}</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={field.type === 'numberrange' ? 'Min' : 'Başlangıç'}
                type={field.type === 'numberrange' ? 'number' : 'date'}
                value={filters[field.id]?.[field.type === 'numberrange' ? 'min' : 'startDate'] || ''}
                onChange={(e) => handleFilterChange(field.id, e.target.value, field.type === 'numberrange' ? 'min' : 'startDate')}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder={field.type === 'numberrange' ? 'Max' : 'Bitiş'}
                type={field.type === 'numberrange' ? 'number' : 'date'}
                value={filters[field.id]?.[field.type === 'numberrange' ? 'max' : 'endDate'] || ''}
                onChange={(e) => handleFilterChange(field.id, e.target.value, field.type === 'numberrange' ? 'max' : 'endDate')}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mb: 3, 
        p: 2, 
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0, 
        borderBottomLeftRadius: 8, 
        borderBottomRightRadius: 8, 
        width: '100%', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #e0e0e0',
        borderTop: 'none' 
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder={searchPlaceholder}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={onSearchChange}
          sx={{
            flex: { xs: 1, md: 1 },
            width: { xs: '100%', md: 'auto' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3949ab',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: { xs: 'flex-end', md: 'flex-end' }, width: { xs: '100%', md: 'auto' } }}>
          {actionButtons}
          
          {hasAdvancedFilters && (
            <IconButton
              onClick={() => setFilterOpen(!filterOpen)}
              size="small"
              sx={{ 
                bgcolor: filterOpen ? '#1b2f5c' : '#3949ab',
                color: '#fff',
                p: 1, 
                borderRadius: '8px',
                '&:hover': {
                  bgcolor: filterOpen ? '#112240' : '#303f9f',
                }
              }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {hasAdvancedFilters && (
        <Collapse in={filterOpen}>
          <Box sx={{ pt: 3, pb: 1 }}>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
              {fields.map((field) => (
                <Box key={field.id} sx={{ minWidth: '200px', flexGrow: 1, maxWidth: '300px' }}>
                  {renderField(field)}
                </Box>
              ))}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
               <Button 
                 variant="outlined" 
                 startIcon={<ResetIcon />} 
                 onClick={handleReset} 
                 sx={{ 
                   color: '#555', 
                   borderColor: '#ccc', 
                   textTransform: 'none', 
                   fontWeight: 600,
                   borderRadius: '8px',
                   px: 3
                 }}
               >
                 Sıfırla
               </Button>
               <Button 
                 variant="contained" 
                 startIcon={<SearchIcon />} 
                 onClick={handleApply} 
                 sx={{ 
                   bgcolor: '#1b2f5c', 
                   textTransform: 'none', 
                   fontWeight: 600, 
                   boxShadow: 'none',
                   borderRadius: '8px',
                   px: 3,
                   '&:hover': {
                     bgcolor: '#112240',
                   }
                 }}
               >
                 Filtrele
               </Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </Paper>
  );
};

export default FilterPanel;
