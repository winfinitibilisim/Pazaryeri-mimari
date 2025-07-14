import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const ReportsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="500" sx={{ mb: 3 }}>
        Raporlar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Raporlar Sayfası
            </Typography>
            <Typography variant="body1">
              Bu sayfa yakında kullanıma açılacaktır. Satış raporları, envanter analizi ve müşteri istatistikleri burada görüntülenecektir.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage; 