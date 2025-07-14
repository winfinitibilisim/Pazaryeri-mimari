import React, { useState, ReactNode } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

export interface FilterFieldOption {
  value: string;
  label: string;
  translationKey?: string;
}

export interface FilterField {
  id: string;
  label: string;
  translationKey?: string;
  type: 'text' | 'select' | 'date' | 'number' | 'numberrange' | 'daterange' | 'custom';
  options?: FilterFieldOption[];
  component?: ReactNode;
}

interface AccordionFilterProps {
  title?: string;
  fields: FilterField[];
  onSearch: (filters: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  searchPlaceholder?: string;
  expanded?: boolean; // Controlled expanded state
  onExpandedChange?: (isExpanded: boolean) => void; // Callback for when expansion changes
}

/**
 * Aşağı açılır filtre bileşeni
 * İçinde farklı tipte filtreleme alanları barındırır
 */
const AccordionFilter: React.FC<AccordionFilterProps> = ({
  title = 'Arama yap',
  fields,
  onSearch,
  initialValues = {},
  searchPlaceholder = 'Arama yap...',
  expanded: controlledExpanded,
  onExpandedChange
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isControlled = controlledExpanded !== undefined;
  const currentExpanded = isControlled ? controlledExpanded : internalExpanded;

  // Arama kutusu kaldırıldı
  const [filters, setFilters] = useState<Record<string, any>>(initialValues);

  const handleAccordionMuiChange = (event: React.SyntheticEvent, newExpandedState: boolean) => {
    if (onExpandedChange) {
      onExpandedChange(newExpandedState);
    }
    if (!isControlled) {
      setInternalExpanded(newExpandedState);
    }
  };

  const handleFilterChange = (fieldId: string, value: any, part?: 'min' | 'max' | 'startDate' | 'endDate') => {
    setFilters(prev => {
      if (part) { // For numberrange
        const existingRange = prev[fieldId] || {};
        return {
          ...prev,
          [fieldId]: {
            ...existingRange,
            [part]: value
          }
        };
      }
      return {
        ...prev,
        [fieldId]: value
      };
    });
  };

  const handleSearch = () => {
    onSearch({
      ...filters
    });
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            value={filters[field.id] || ''}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            margin="dense"
          />
        );
      case 'select':
        return (
          <TextField
            select
            fullWidth
            size="small"
            label={field.label}
            value={filters[field.id] || ''}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            margin="dense"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Seçiniz</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        );
      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            type="date"
            value={filters[field.id] || ''}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            label={field.label}
            type="number"
            value={filters[field.id] || ''}
            onChange={(e) => handleFilterChange(field.id, e.target.value)}
            margin="dense"
          />
        );
      case 'custom':
        return field.component;
      case 'numberrange':
      case 'daterange': // Add rendering logic for daterange
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={`${field.label} (Min)`}
              type="number"
              value={filters[field.id]?.min || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value, 'min')}
              margin="dense"
            />
            <TextField
              fullWidth
              size="small"
              label={`${field.label} (Max)`}
              type="number"
              value={filters[field.id]?.max || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value, 'max')}
              margin="dense"
            />
          </Box>
        );
      case 'daterange':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={`${field.label} (Start)`} // Consider using t() here if translationKey is present
              type="date"
              value={filters[field.id]?.startDate || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value, 'startDate' as any)} // Cast to any for now, or update handleFilterChange
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              size="small"
              label={`${field.label} (End)`} // Consider using t() here if translationKey is present
              type="date"
              value={filters[field.id]?.endDate || ''}
              onChange={(e) => handleFilterChange(field.id, e.target.value, 'endDate' as any)} // Cast to any for now, or update handleFilterChange
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={0} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <Accordion 
        expanded={currentExpanded} 
        onChange={handleAccordionMuiChange}
        disableGutters
        elevation={0}
        sx={{ 
          '&:before': { display: 'none' },
          borderRadius: '8px',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-panel-content"
          id="filter-panel-header"
          sx={{ 
            backgroundColor: 'white',
            borderRadius: currentExpanded ? '8px 8px 0 0' : '8px',
            minHeight: '56px',
            p: 0,
            pl: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                {title}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2, pt: 1, backgroundColor: '#f9f9f9' }}>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
            {fields.map((field) => (
              <Box key={field.id} sx={{ minWidth: '200px', flexGrow: 1, maxWidth: '300px', mb: 1 }}>
                {renderField(field)}
              </Box>
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button variant="outlined" size="small" onClick={handleClear}>
              Temizle
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Ara
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default AccordionFilter;
