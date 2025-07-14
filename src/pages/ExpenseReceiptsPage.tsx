import React from 'react';
import { Box } from '@mui/material';
import ExpenseReceiptList from '../components/expenseReceipt/ExpenseReceiptList';

const ExpenseReceiptsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ExpenseReceiptList />
    </Box>
  );
};

export default ExpenseReceiptsPage;
