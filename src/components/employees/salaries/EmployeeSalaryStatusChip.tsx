import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmployeeSalaryStatusChipProps {
  status: 'Paid' | 'Pending' | 'Overdue';
}

const EmployeeSalaryStatusChip: React.FC<EmployeeSalaryStatusChipProps> = ({ status }) => {
  const { t } = useTranslation();

  const statusStyles = {
    Paid: {
      backgroundColor: '#2e7d32', // green
      color: 'white',
    },
    Pending: {
      backgroundColor: '#ed6c02', // orange
      color: 'white',
    },
    Overdue: {
      backgroundColor: '#d32f2f', // red
      color: 'white',
    },
  };

  const style = statusStyles[status];

  return (
    <Chip
      label={t(status.toLowerCase())}
      size="small"
      sx={{
        ...style,
        fontWeight: 600,
        borderRadius: '16px',
      }}
    />
  );
};

export default EmployeeSalaryStatusChip;
