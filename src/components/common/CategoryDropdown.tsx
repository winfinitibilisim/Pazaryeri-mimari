import React, { useState, useEffect } from 'react';
import {
  TextField,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Search as SearchIcon
} from '@mui/icons-material';
import { CategoryItem } from './CategoryFilter';

interface CategoryDropdownProps {
  categories: CategoryItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string, categoryName: string) => void;
  label?: string;
  width?: number | string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  label = 'Kategori',
  width = 200
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Seçiniz');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
  
  const open = Boolean(anchorEl);

  // Başlangıçta seçili kategori adını bul
  useEffect(() => {
    if (selectedCategoryId === 'all') {
      setSelectedCategoryName('Tüm kategoriler');
      return;
    }

    const findCategoryName = (cats: CategoryItem[]): string | null => {
      for (const cat of cats) {
        if (cat.id === selectedCategoryId) {
          return cat.name;
        }
        if (cat.children && cat.children.length > 0) {
          const childResult = findCategoryName(cat.children);
          if (childResult) return childResult;
        }
      }
      return null;
    };

    const categoryName = findCategoryName(categories);
    if (categoryName) {
      setSelectedCategoryName(categoryName);
    } else {
      setSelectedCategoryName('Seçiniz');
    }
  }, [selectedCategoryId, categories]);

  // Kategorileri filtrele
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // Arama terimi değiştiğinde kategorileri filtrele
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredCategories(categories);
      return;
    }

    // Kategorileri ve alt kategorileri arama terimine göre filtrele
    const filterCategories = (cats: CategoryItem[]): CategoryItem[] => {
      return cats.filter(cat => {
        const nameMatch = cat.name.toLowerCase().includes(value);

        // Alt kategorileri filtrele
        let filteredChildren: CategoryItem[] = [];
        if (cat.children && cat.children.length > 0) {
          filteredChildren = filterCategories(cat.children);
        }

        // Eğer alt kategorilerde eşleşen varsa veya isim eşleşiyorsa kategoriyi göster
        return nameMatch || filteredChildren.length > 0;
      }).map(cat => {
        if (cat.children && cat.children.length > 0) {
          return {
            ...cat,
            children: filterCategories(cat.children)
          };
        }
        return cat;
      });
    };

    const filtered = filterCategories(categories);
    setFilteredCategories(filtered);

    // Filtreleme sonrası eşleşen kategorileri otomatik olarak aç
    if (value.trim()) {
      const newOpenCategories = { ...openCategories };

      const setOpenForMatches = (cats: CategoryItem[]) => {
        cats.forEach(cat => {
          if (cat.name.toLowerCase().includes(value)) {
            // Ana kategoriyi aç
            newOpenCategories[cat.id] = true;
          }

          if (cat.children && cat.children.length > 0) {
            // Alt kategorilerde arama yap
            const hasMatch = cat.children.some(child =>
              child.name.toLowerCase().includes(value) ||
              (child.children && child.children.some(c => c.name.toLowerCase().includes(value)))
            );

            if (hasMatch) {
              newOpenCategories[cat.id] = true;
            }

            setOpenForMatches(cat.children);
          }
        });
      };

      setOpenForMatches(filtered);
      setOpenCategories(newOpenCategories);
    }
  };

  // Kategori menüsünü açma/kapama
  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
    setFilteredCategories(categories);
  };
  
  // Kategori açılır/kapanır durumu
  const handleToggleCategory = (categoryId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Kategori seçimi
  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    onSelectCategory(categoryId, categoryName);
    setSelectedCategoryName(categoryName);
    handleCategoryClose();
  };
  
  // Kategori öğesini render etme
  const renderCategoryItem = (category: CategoryItem, level = 0) => {
    const isOpen = openCategories[category.id] || false;
    const isSelected = category.id === selectedCategoryId;
    const hasChildren = category.children && category.children.length > 0;
    const isMainCategory = level === 0;

    return (
      <React.Fragment key={category.id}>
        {isMainCategory ? (
          // Ana kategori başlığı
          <>
            <ListItem 
              disablePadding 
              sx={{ 
                bgcolor: 'transparent',
              }}
            >
              <ListItemButton 
                onClick={() => {
                  handleSelectCategory(category.id, category.name);
                  if (hasChildren) {
                    handleToggleCategory(category.id);
                  }
                }}
                dense
                sx={{
                  py: 0.5,
                }}
              >
                {hasChildren && (
                  <ListItemIcon 
                    onClick={(e) => {
                      handleToggleCategory(category.id, e);
                    }}
                    sx={{ minWidth: 24 }}
                  >
                    {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </ListItemIcon>
                )}
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
                      handleToggleCategory(category.id, e);
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
    <>
      <Box sx={{ position: 'relative' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', 
            top: -8, 
            left: 10, 
            bgcolor: 'white', 
            px: 0.5,
            fontSize: '0.7rem',
            color: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1
          }}
        >
          {label}
        </Typography>
        <TextField
          value={selectedCategoryName}
          onClick={handleCategoryClick}
          size="small"
          sx={{ 
            width: width,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
            },
          }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <ExpandMore fontSize="small" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 1,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }
          }}
        />
      </Box>
      
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
        {/* Kategori arama kutusu */}
        <Box sx={{ p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <TextField
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              sx: { fontSize: '0.875rem' }
            }}
          />
        </Box>
        
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
          {/* Tüm kategoriler başlığı - Mavi */}
          <ListItem 
            disablePadding 
            sx={{ 
              bgcolor: '#4285f4',
              color: 'white',
            }}
          >
            <ListItemButton 
              onClick={() => handleSelectCategory('all', 'Tüm kategoriler')}
              dense
              sx={{
                py: 0.75,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <ListItemText 
                primary="Tüm kategoriler" 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  fontWeight: 600,
                }} 
              />
            </ListItemButton>
          </ListItem>
          
          {/* Filtrelenmiş kategorileri göster */}
          {filteredCategories.map(category => renderCategoryItem(category))}
        </List>
      </Popover>
    </>
  );
};

export default CategoryDropdown;
