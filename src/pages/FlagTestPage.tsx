import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomerFlagTest from '../components/customers/CustomerFlagTest';

const FlagTestPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Bayrak Testi
      </Typography>
      <CustomerFlagTest />
    </Box>
  );
};

export default FlagTestPage;
