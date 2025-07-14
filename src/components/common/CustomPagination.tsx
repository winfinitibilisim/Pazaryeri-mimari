import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface CustomPaginationProps {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (event: React.ChangeEvent<unknown> | null, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<string>) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, mb: 2, bgcolor: '#f9f9f9', py: 2, borderRadius: 1 }}>
      <Typography variant="body2" sx={{ mr: 2, color: '#555' }}>Sayfa başına satır:</Typography>
      <Select
        value={rowsPerPage.toString()}
        onChange={onRowsPerPageChange}
        size="small"
        sx={{ mr: 2, minWidth: 80 }}
      >
        <MenuItem value="5">5</MenuItem>
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="20">20</MenuItem>
      </Select>
      <Typography variant="body2" sx={{ mx: 2, color: '#555' }}>
        {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalItems)} / {totalItems}
      </Typography>
      <IconButton 
        disabled={page === 0}
        onClick={(e) => onPageChange(e, page - 1)}
        sx={{ color: page === 0 ? '#ccc' : '#25638f' }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton 
        disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}
        onClick={(e) => onPageChange(e, page + 1)}
        sx={{ color: page >= Math.ceil(totalItems / rowsPerPage) - 1 ? '#ccc' : '#25638f' }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default CustomPagination;
