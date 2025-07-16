import React, { useState, FC } from 'react';
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
    RadioButtonUnchecked
} from '@mui/icons-material';
import AddBrandDialog from '../components/AddBrandDialog';

interface Brand {
  id: string;
  logo: string;
  name: string;
  productCount: number;
  isActive: boolean;
}

const sampleBrands: Brand[] = [
    {
        id: '1',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
        name: 'Apple',
        productCount: 125,
        isActive: true,
    },
    {
        id: '2',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
        name: 'Samsung',
        productCount: 89,
        isActive: true,
    },
    {
        id: '3',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
        name: 'Xiaomi',
        productCount: 72,
        isActive: false,
    }
];

const BrandRow: React.FC<{ brand: Brand; }> = ({ brand }) => {
    const navigate = useNavigate();

    return (
        <TableRow hover>
            <TableCell>{brand.name}</TableCell>
            <TableCell align="center">
                <Link 
                    component="button"
                    variant="body2"
                    onClick={() => navigate(`/products?brandId=${brand.id}`)}
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {brand.productCount}
                </Link>
            </TableCell>
            <TableCell align="center">
                {brand.isActive ? <CheckCircle color="success" /> : <RadioButtonUnchecked color="disabled" />}
            </TableCell>
            <TableCell align="right">
                <IconButton size="small" title="Düzenle" color="secondary"><Edit /></IconButton>
                <IconButton size="small" title="Sil" color="error"><Delete /></IconButton>
            </TableCell>
        </TableRow>
    );
};

const BrandsPage: FC = () => {
    const [brands, setBrands] = useState(sampleBrands);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenAddDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

            const handleAddBrand = (newBrandData: { names: { lang: string; name: string }[], website: string, description: string, image: File | null }) => {
        const newBrand: Brand = {
            id: (brands.length + 1).toString(),
            logo: newBrandData.image ? URL.createObjectURL(newBrandData.image) : '',
            name: newBrandData.names.find(n => n.lang === 'tr')?.name || newBrandData.names[0]?.name || 'N/A',
            productCount: 0,
            isActive: true,
        };

        setBrands(prevBrands => [...prevBrands, newBrand]);
        console.log('Adding brand:', newBrand);
    };
    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" gutterBottom component="div">
                    Markalar
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />} onClick={handleOpenAddDialog}
                >
                    Yeni Marka Ekle
                </Button>
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table aria-label="brands table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad</TableCell>
                            <TableCell align="center">Ürünler</TableCell>
                            <TableCell align="center">Aktif</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brands.map(brand => (
                            <BrandRow key={brand.id} brand={brand} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddBrandDialog 
                open={dialogOpen}
                onClose={handleCloseDialog}
                onAddBrand={handleAddBrand}
            />
        </Paper>
    );
};

export default BrandsPage;
