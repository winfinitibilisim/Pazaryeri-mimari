import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  ArrowRight as ArrowRightIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

export interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
  isMainCategory?: boolean;
}

interface CategoryFilterProps {
  categories: CategoryItem[];
  onSelectCategory: (categoryId: string, categoryName: string) => void;
  selectedCategoryId?: string;
  title?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  onSelectCategory,
  selectedCategoryId,
  title = 'Kategoriler'
}) => {
  // Ana kategorileri varsayılan olarak açık tutmak için başlangıç durumu oluştur
  const initialOpenState: Record<string, boolean> = {};
  categories.forEach(cat => {
    if (cat.isMainCategory) {
      initialOpenState[cat.id] = true;
    }
  });
  
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(initialOpenState);

  const handleToggle = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryItem = (category: CategoryItem, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = openCategories[category.id] || false;
    const isSelected = selectedCategoryId === category.id;
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
                borderTopLeftRadius: level === 0 ? 4 : 0,
                borderTopRightRadius: level === 0 ? 4 : 0,
              }}
            >
              <ListItemButton 
                onClick={() => {
                  handleToggle(category.id);
                  onSelectCategory(category.id, category.name);
                }}
                dense
                sx={{
                  py: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, color: 'white' }}>
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
                onClick={() => onSelectCategory(category.id, category.name)}
                dense
                sx={{
                  py: 0.75,
                  borderLeft: isSelected ? '3px solid #4285f4' : '3px solid transparent',
                  pl: 1,
                }}
              >
                {hasChildren ? (
                  <ListItemIcon 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(category.id);
                    }}
                    sx={{ minWidth: 30 }}
                  >
                    {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </ListItemIcon>
                ) : (
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <KeyboardArrowRightIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={category.name} 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#4285f4' : 'text.primary'
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
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: 360,
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        overflow: 'hidden',
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
    </Box>
  );
};

export default CategoryFilter;
