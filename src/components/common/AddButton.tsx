import React from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Standart mavi renk kodu (görseldeki renk)
export const ADD_BUTTON_COLOR = '#2a6496';

interface AddButtonProps extends Omit<ButtonProps, 'variant' | 'startIcon' | 'color'> {
  label?: string;
  customIcon?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
}

/**
 * Tüm menülerde tutarlı şekilde kullanılacak standart "Ekle" butonu
 * 
 * @param label Buton metni (varsayılan: "Yeni Ürün Ekle")
 * @param customIcon Özel ikon (varsayılan: AddIcon)
 * @param icon Özel ikon
 * @param sx Ek stil özellikleri
 * @param props Diğer Button bileşeni props'ları
 */
const AddButton: React.FC<AddButtonProps> = ({
  label = 'Yeni Ürün Ekle',
  customIcon,
  icon,
  sx,
  fullWidth = false,
  ...rest
}) => {
  const { t } = useTranslation();

  const defaultSx: SxProps<Theme> = {
    backgroundColor: ADD_BUTTON_COLOR,
    color: '#ffffff',
    borderRadius: '30px',
    padding: '10px 20px',
    textTransform: 'none',
    fontWeight: 500,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    '&:hover': {
      backgroundColor: '#1e4c70',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <Button
      variant="contained"
      startIcon={customIcon || icon || <AddIcon />}
      fullWidth={fullWidth}
      sx={{
        ...defaultSx,
        ...sx
      }}
    >
      {label}
    </Button>
  );
};

export default AddButton;
