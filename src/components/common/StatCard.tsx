import React from 'react';
import { Card, CardContent, Typography, Box, SvgIconProps } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  color: string;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {change && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: change.isPositive ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {change.isPositive ? '↑' : '↓'} {change.value}
              </Typography>
            )}
          </Box>
          
          <Box 
            sx={{ 
              backgroundColor: `${color}20`, // Using alpha color
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { sx: { color: color, fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard; 