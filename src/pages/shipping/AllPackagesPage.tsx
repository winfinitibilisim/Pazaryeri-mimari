import React from 'react';
import { Box, Typography } from '@mui/material';

const AllPackagesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tüm Paketler
      </Typography>
      <Typography>
        Bu sayfa yapım aşamasındadır.
      </Typography>
    </Box>
  );
};

export default AllPackagesPage;
