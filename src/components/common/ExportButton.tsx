import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ExportButtonProps extends ButtonProps {
  label?: string;
  customIcon?: React.ReactElement;
}

const ExportButton: React.FC<ExportButtonProps> = ({ label, customIcon, sx, ...props }) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="contained"
      startIcon={customIcon || <FileDownloadIcon />}
      sx={sx}
      {...props}
    >
      {label || t('export', 'Export')}
    </Button>
  );
};

export default ExportButton;
