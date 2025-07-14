import React, { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import AccordionFilter, { FilterField } from '../common/AccordionFilter';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

const AccordionFilterExample: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredData, setFilteredData] = useState<Product[] | null>(null);

  // Örnek veri
  const sampleData: Product[] = [
    { id: 1, name: 'Laptop', category: 'Elektronik', price: 5000, stock: 10, createdAt: '2025-01-15' },
    { id: 2, name: 'Telefon', category: 'Elektronik', price: 3000, stock: 20, createdAt: '2025-02-20' },
    { id: 3, name: 'Masa', category: 'Mobilya', price: 1200, stock: 5, createdAt: '2025-03-10' },
    { id: 4, name: 'Sandalye', category: 'Mobilya', price: 500, stock: 15, createdAt: '2025-03-15' },
    { id: 5, name: 'Kitap', category: 'Kırtasiye', price: 50, stock: 100, createdAt: '2025-04-01' },
    { id: 6, name: 'Kalem', category: 'Kırtasiye', price: 10, stock: 200, createdAt: '2025-04-05' },
  ];

  // Filtre alanları
  const filterFields: FilterField[] = [
    { id: 'name', label: 'Ürün Adı', type: 'text' },
    { 
      id: 'category', 
      label: 'Kategori', 
      type: 'select',
      options: [
        { value: 'Elektronik', label: 'Elektronik' },
        { value: 'Mobilya', label: 'Mobilya' },
        { value: 'Kırtasiye', label: 'Kırtasiye' },
      ]
    },
    { id: 'minPrice', label: 'Min Fiyat', type: 'number' },
    { id: 'maxPrice', label: 'Max Fiyat', type: 'number' },
    { id: 'createdAt', label: 'Oluşturma Tarihi', type: 'date' },
  ];

  // Filtreleme işlemi
  const handleSearch = (searchFilters: Record<string, any>) => {
    console.log('Uygulanan filtreler:', searchFilters);
    setFilters(searchFilters);

    // Filtreleme mantığı
    let filtered = [...sampleData];

    // Arama terimi ile filtreleme
    if (searchFilters.searchTerm) {
      const searchTerm = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Ürün adı ile filtreleme
    if (searchFilters.name) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }

    // Kategori ile filtreleme
    if (searchFilters.category) {
      filtered = filtered.filter(item => item.category === searchFilters.category);
    }

    // Fiyat aralığı ile filtreleme
    if (searchFilters.minPrice) {
      filtered = filtered.filter(item => item.price >= Number(searchFilters.minPrice));
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(item => item.price <= Number(searchFilters.maxPrice));
    }

    // Tarih ile filtreleme
    if (searchFilters.createdAt) {
      filtered = filtered.filter(item => item.createdAt === searchFilters.createdAt);
    }

    setFilteredData(filtered);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Accordion Filtre Örneği
      </Typography>

      {/* Accordion Filtre Bileşeni */}
      <AccordionFilter
        title="Ürün Arama"
        fields={filterFields}
        onSearch={handleSearch}
        searchPlaceholder="Ürün adı, kategori..."
      />

      {/* Filtrelenmiş Sonuçlar */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtrelenmiş Sonuçlar
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {filteredData === null ? (
          <Typography variant="body2" color="text.secondary">
            Arama yapmak için filtreleri kullanın.
          </Typography>
        ) : filteredData.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sonuç bulunamadı.
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Ürün Adı</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Kategori</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Fiyat</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Stok</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.name}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.category}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.price} ₺</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.stock}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}

        {filteredData !== null && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Toplam {filteredData.length} sonuç bulundu.
          </Typography>
        )}
      </Paper>

      {/* Uygulanan Filtreler */}
      {Object.keys(filters).length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Uygulanan Filtreler
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <pre style={{ margin: 0, overflow: 'auto' }}>
            {JSON.stringify(filters, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
};

export default AccordionFilterExample;
