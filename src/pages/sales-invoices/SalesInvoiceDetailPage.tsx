import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const SalesInvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">
        Yeni Tasarım Bekleniyor - {id}
      </Typography>
    </Box>
  );
};

export default SalesInvoiceDetailPage;
