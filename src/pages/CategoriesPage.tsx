import React, { useState, Fragment, FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    IconButton,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {
    Add,
    CheckCircle,
    Delete,
    Edit,
    Folder,
    KeyboardArrowDown,
    KeyboardArrowRight,
    RadioButtonUnchecked
} from '@mui/icons-material';
import AddCategoryDialog from '../components/AddCategoryDialog';

interface Category {
  id: string;
  name: string;
  productCount: number;
  isActive: boolean;
  children?: Category[];
}

// Örnek Hiyerarşik Kategori Verisi
const hierarchicalCategories: Category[] = [
    {
      id: 'kadin-giyim',
      name: 'Kadın Giyim',
      productCount: 12,
      isActive: true,
      children: [
        {
          id: 'elbise',
          name: 'Elbise',
          productCount: 12,
          isActive: true,
        },
        {
          id: 'alt-giyim',
          name: 'Alt Giyim',
          productCount: 12,
          isActive: false,
        },
      ]
    },
    {
        id: 'erkek-giyim',
        name: 'Erkek Giyim',
        productCount: 12,
        isActive: true,
    },
    {
        id: 'anne-cocuk',
        name: 'Anne, Çocuk & Oyuncak',
        productCount: 12,
        isActive: false,
    }
  ];

const CategoryRow: React.FC<{ 
    category: Category;
    level: number;
    onToggle: (id: string) => void;
    isExpanded: boolean;
    onAddSubCategory: (parentCategory: Category) => void;
}> = ({ category, level, onToggle, isExpanded, onAddSubCategory }) => {
    const navigate = useNavigate();
    const hasChildren = category.children && category.children.length > 0;

    return (
        <TableRow hover>
            <TableCell style={{ paddingLeft: level * 24 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                        aria-label="expand row" 
                        size="small" 
                        onClick={() => onToggle(category.id)} 
                        style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
                    >
                        {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                    </IconButton>
                    <Folder sx={{ mr: 1, color: hasChildren ? '#FFC107' : '#9e9e9e' }} />
                    {category.name}
                </Box>
            </TableCell>
            <TableCell align="center">
                <Link 
                    component="button"
                    variant="body2"
                    onClick={() => navigate(`/products?categoryId=${category.id}`)}
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {category.productCount}
                </Link>
            </TableCell>
            <TableCell align="center">
                {category.isActive ? <CheckCircle color="success" /> : <RadioButtonUnchecked color="disabled" />}
            </TableCell>
                        <TableCell align="right">
                <IconButton size="small" title="Alt Kategori Ekle" color="primary" onClick={() => onAddSubCategory(category)}><Add /></IconButton>
                <IconButton size="small" title="Düzenle" color="secondary"><Edit /></IconButton>
                <IconButton size="small" title="Sil" color="error"><Delete /></IconButton>
            </TableCell>
        </TableRow>
    );
};

const CategoriesPage: FC = () => {
    const [expanded, setExpanded] = useState(new Map<string, boolean>());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [parentCategory, setParentCategory] = useState<Category | null>(null);

    const handleToggle = (id: string) => {
        setExpanded(prev => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    const handleOpenAddDialog = (parent: Category | null) => {
        setParentCategory(parent);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setParentCategory(null);
    };

    const handleAddCategory = (names: { lang: string; name: string }[]) => {
        console.log('Adding category with names:', names);
        console.log('Parent category:', parentCategory);
        // Burada API'ye gönderme veya state'i güncelleme işlemleri yapılacak.
    };

    const renderCategories = (categories: Category[], level: number): React.ReactNode[] => {
        return categories.flatMap(category => {
            const isExpanded = expanded.get(category.id) || false;
            const hasChildren = category.children && category.children.length > 0;

            const row = (
                <CategoryRow 
                    key={category.id} 
                    category={category} 
                    level={level} 
                    onToggle={handleToggle} 
                    isExpanded={isExpanded} 
                    onAddSubCategory={handleOpenAddDialog}
                />
            );

            const children = hasChildren && isExpanded
                ? renderCategories(category.children!, level + 1)
                : [];

            return [row, ...children];
        });
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom component="div">
                    Kategoriler
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpenAddDialog(null)}
                >
                    Yeni Kategori Ekle
                </Button>
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table aria-label="hierarchical table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad</TableCell>
                            <TableCell align="center">Ürünler</TableCell>
                            <TableCell align="center">Aktif</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderCategories(hierarchicalCategories, 1)}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddCategoryDialog 
                open={dialogOpen}
                onClose={handleCloseDialog}
                onAddCategory={handleAddCategory}
                parentCategoryName={parentCategory?.name}
            />
        </Paper>
    );
};

export default CategoriesPage;
