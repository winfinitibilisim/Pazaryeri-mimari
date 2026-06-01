import React from 'react';
import { Box, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  actionButton?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actionButton }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#3949ab', // Dark blue background similar to the image
        color: '#fff',
        px: 3,
        py: 2,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 0, // No margin bottom to connect with the content below seamlessly
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {actionButton && (
        <Box>
          {actionButton}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
