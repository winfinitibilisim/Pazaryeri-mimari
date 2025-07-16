import React from 'react';
import { Box, Typography } from '@mui/material';

const PendingPackagesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bekleyen Paketler
      </Typography>
      <Typography>
        Bu sayfa yapım aşamasındadır.
      </Typography>
    </Box>
  );
};

export default PendingPackagesPage;
