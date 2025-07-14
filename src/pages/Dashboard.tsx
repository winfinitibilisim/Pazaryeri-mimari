import React from 'react';
import { 
  Typography, 
  Box, 
  Container 
} from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      mt: -10 // Adjust this value to move the content up
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Lütfen yukarıdan bir kategori seçerek başlayın.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
