import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  FilterList as FilterListIcon,
  ExpandLess,
  ExpandMore,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { CategoryItem } from './CategoryFilter';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: FilterOption[];
  placeholder?: string;
}

interface DetailedFilterProps {
  onSearch: (filters: Record<string, any>) => void;
  onClear?: () => void;
  fields: FilterField[];
  categories?: CategoryItem[];
  onCategorySelect?: (categoryId: string, categoryName: string) => void;
  selectedCategoryId?: string;
}

const DetailedFilter: React.FC<DetailedFilterProps> = ({
  onSearch,
  onClear,
  fields,
  categories = [],
  onCategorySelect,
  selectedCategoryId = 'all'
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Kategori filtresi için
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Kategori');

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  
  // Kategori menüsünü açma/kapama
  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
  };
  
  // Kategori açılır/kapanır durumu
  const handleToggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Kategori seçimi
  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
    if (onCategorySelect) {
      onCategorySelect(categoryId, categoryName);
    }
    handleCategoryClose();
  };
  
  const open = Boolean(anchorEl);

  const handleInputChange = (fieldId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSearch = () => {
    onSearch({
      ...filters,
      searchTerm
    });
  };

  const handleClear = () => {
    setFilters({});
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCategoryName('Kategori');
    if (onClear) {
      onClear();
    }
  };

  // Kategori öğesini render etme
  const renderCategoryItem = (category: CategoryItem, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = openCategories[category.id] || false;
    const isSelected = selectedCategory === category.id;
    const isMainCategory = category.isMainCategory || level === 0;

    return (
      <React.Fragment key={category.id}>
        {isMainCategory ? (
          // Ana kategori başlığı
          <>
            <ListItem 
              disablePadding 
              sx={{ 
                bgcolor: '#4285f4',
                color: 'white',
              }}
            >
              <ListItemButton 
                onClick={() => {
                  handleToggleCategory(category.id);
                  handleSelectCategory(category.id, category.name);
                }}
                dense
                sx={{
                  py: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 24, color: 'white' }}>
                  {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemIcon>
                <ListItemText 
                  primary={category.name} 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: 600,
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            {hasChildren && category.children && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.children.map(child => renderCategoryItem(child, level + 1))}
                </List>
              </Collapse>
            )}
          </>
        ) : (
          // Alt kategori öğesi
          <>
            <ListItem 
              disablePadding 
              sx={{ 
                pl: level * 1.5,
                bgcolor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              }}
            >
              <ListItemButton 
                onClick={() => handleSelectCategory(category.id, category.name)}
                dense
                sx={{
                  py: 0.5,
                  pl: 1,
                }}
              >
                {hasChildren ? (
                  <ListItemIcon 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCategory(category.id);
                    }}
                    sx={{ minWidth: 24 }}
                  >
                    {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </ListItemIcon>
                ) : (
                  <Box sx={{ width: 24, display: 'inline-block' }} />
                )}
                <ListItemText 
                  primary={category.name} 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: isSelected ? 600 : 400,
                  }} 
                />
              </ListItemButton>
            </ListItem>
            
            {hasChildren && category.children && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.children.map(child => renderCategoryItem(child, level + 1))}
                </List>
              </Collapse>
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 1 }}>
      {/* Üst Arama Alanı */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ mr: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Kategori Filtresi Butonu */}
          {categories && categories.length > 0 && (
            <TextField
              select
              label="Kategori"
              value={selectedCategory}
              onClick={handleCategoryClick}
              size="small"
              sx={{ width: 200 }}
              InputProps={{
                readOnly: true,
              }}
            >
              <MenuItem value={selectedCategory}>{selectedCategoryName}</MenuItem>
            </TextField>
          )}
          
          <Button 
            variant="text" 
            onClick={handleToggleExpand}
            endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Filtreler
          </Button>
          
          {/* Kategori Popup Menüsü */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleCategoryClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: { 
                width: 280, 
                maxHeight: 400, 
                overflow: 'auto',
                mt: 0.5,
                border: '1px solid #e0e0e0',
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <List
              sx={{ 
                width: '100%', 
                bgcolor: 'background.paper',
                py: 0,
                '& .MuiListItemButton-root': {
                  transition: 'all 0.2s'
                }
              }}
              component="nav"
              dense
            >

              {categories.map(category => renderCategoryItem(category))}
            </List>
          </Popover>
        </Box>
      </Box>

      {/* Genişletilmiş Filtre Alanları */}
      {expanded && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={field.id}>
                {field.type === 'select' ? (
                  <FormControl fullWidth size="small">
                    <Select
                      displayEmpty
                      value={filters[field.id] || ''}
                      onChange={(e: SelectChangeEvent) => handleInputChange(field.id, e.target.value)}
                    >
                      <MenuItem value="">{field.label}</MenuItem>
                      {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    placeholder={field.placeholder}
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={filters[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleClear}
              sx={{ mr: 1 }}
            >
              Temizle
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Ara
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default DetailedFilter;
