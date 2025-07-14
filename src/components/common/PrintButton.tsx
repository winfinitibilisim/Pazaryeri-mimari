import React from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PrintButtonProps extends Omit<ButtonProps, 'variant' | 'startIcon'> {
  label?: string;
  customIcon?: React.ReactNode;
  outlined?: boolean;
  iconColor?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  label,
  customIcon,
  sx,
  outlined = false,
  iconColor,
  ...rest
}) => {
  const { t } = useTranslation();

  const defaultStyles: SxProps<Theme> = (theme) => ({
    ...(outlined
      ? {
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: 'rgba(0, 123, 255, 0.04)',
          },
        }
      : {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
  });

  const iconStyles: SxProps<Theme> = (theme) => ({
    color: outlined ? (iconColor || theme.palette.error.main) : 'white',
  });

  return (
    <Button
      variant={outlined ? 'outlined' : 'contained'}
      startIcon={customIcon || <PrintIcon sx={iconStyles} />}
      sx={[defaultStyles, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...rest}
    >
      {label || t('print')}
    </Button>
  );
};

export default PrintButton;
