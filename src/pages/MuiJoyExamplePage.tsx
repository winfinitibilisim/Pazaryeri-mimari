import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const MuiJoyExamplePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        MUI Joy Örneği
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              MUI Joy Bileşenleri
            </Typography>
            <Typography variant="body1" paragraph>
              Bu sayfa MUI Joy bileşenlerinin önizlemesini gösterecektir. MUI Joy, MUI'nin daha yeni ve daha görsel odaklı bir alternatifidir.
            </Typography>
            <Typography variant="body1">
              Not: Bu sayfa şu anda yapım aşamasındadır ve yakında güncellenecektir.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MuiJoyExamplePage; 