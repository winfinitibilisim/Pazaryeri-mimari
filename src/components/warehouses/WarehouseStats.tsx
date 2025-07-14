import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';

// Depo istatistikleri için tip tanımı
export interface WarehouseStats {
  totalWarehouses: number;
  totalCapacity: number;
  totalUsedCapacity: number;
  totalProducts: number;
  activeWarehouses: number;
  inactiveWarehouses: number;
  capacityUtilization: number;
  lowStockWarehouses: number;
}

interface WarehouseStatsProps {
  stats: WarehouseStats;
}

const WarehouseStats: React.FC<WarehouseStatsProps> = ({ stats }) => {
  const { translations } = useLanguage();

  // İstatistik kartları
  const statCards = [
    {
      title: translations.totalWarehouses || 'Toplam Depo',
      value: stats.totalWarehouses,
      subtitle: `${stats.activeWarehouses} ${translations.activeWarehouses || 'aktif'}, ${stats.inactiveWarehouses} ${translations.inactiveWarehouses || 'pasif'}`,
      color: '#3f51b5'
    },
    {
      title: translations.capacity || 'Kapasite',
      value: `${stats.totalCapacity.toLocaleString()} m²`,
      subtitle: `${translations.usedCapacity || 'Kullanılan'}: ${stats.totalUsedCapacity.toLocaleString()} m²`,
      color: '#2196f3'
    },
    {
      title: translations.fillRate || 'Doluluk Oranı',
      value: `${stats.capacityUtilization.toFixed(0)}%`,
      subtitle: `${stats.totalProducts.toLocaleString()} ${translations.productCount || 'ürün'}`,
      color: stats.capacityUtilization > 90 ? '#f44336' : stats.capacityUtilization > 70 ? '#ff9800' : '#4caf50'
    },
    {
      title: translations.criticalStockProducts || 'Kritik Stok',
      value: stats.lowStockWarehouses,
      subtitle: translations.warehouseReport || 'Depo Raporu',
      color: '#f44336'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h3" sx={{ color: card.color }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WarehouseStats;
