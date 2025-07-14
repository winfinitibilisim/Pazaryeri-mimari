import React from 'react';
import { IconButton, IconButtonProps, Tooltip, SxProps, Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Standart mavi renk kodu (görseldeki renk)
export const EDIT_BUTTON_COLOR = '#2a6496';

interface EditButtonProps extends Omit<IconButtonProps, 'color'> {
  tooltipTitle?: string;
  customIcon?: React.ReactNode;
  customSx?: SxProps<Theme>;
}

/**
 * Tüm admin panelinde tutarlı şekilde kullanılacak düzenleme butonu
 * 
 * @param tooltipTitle Tooltip metni (varsayılan: "Düzenle")
 * @param customIcon Özel ikon (varsayılan: EditIcon)
 * @param sx Ek stil özellikleri
 * @param props Diğer IconButton bileşeni props'ları
 */
const EditButton: React.FC<EditButtonProps> = ({
  tooltipTitle = 'Düzenle',
  customIcon,
  sx,
  ...props
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        size="small"
        {...props}
        sx={{
          color: '#fff',
          backgroundColor: EDIT_BUTTON_COLOR,
          padding: '6px',
          '&:hover': {
            backgroundColor: '#1e4c70',
          },
          ...sx
        }}
      >
        {customIcon || <EditIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default EditButton;
