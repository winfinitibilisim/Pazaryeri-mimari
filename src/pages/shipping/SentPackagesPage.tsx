import React from 'react';
import { Box, Typography } from '@mui/material';

const SentPackagesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gönderilen Paketler
      </Typography>
      <Typography>
        Bu sayfa yapım aşamasındadır.
      </Typography>
    </Box>
  );
};

export default SentPackagesPage;
