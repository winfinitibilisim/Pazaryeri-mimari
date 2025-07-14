import React from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Box, Typography, Stack } from '@mui/material';

// Header rengiyle uyumlu toggle switch bileşeni
const HeaderColorSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2980b9', // Header rengi
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#2980b9', // Header rengi
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  '& .MuiSwitch-track': {
    borderRadius: 24 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  showLabels?: boolean;
}

/**
 * Aktif/Pasif durumu için kullanılabilecek toggle switch bileşeni
 * Header rengiyle uyumlu (#2980b9)
 * 
 * @param checked Aktif/pasif durumu
 * @param onChange Durum değiştiğinde çağrılacak fonksiyon
 * @param label Ana etiket (opsiyonel)
 * @param activeLabel Aktif durumu etiketi (varsayılan: "Aktif")
 * @param inactiveLabel Pasif durumu etiketi (varsayılan: "Pasif")
 * @param disabled Devre dışı bırakma (varsayılan: false)
 * @param size Boyut (varsayılan: "medium")
 * @param showLabels Aktif/Pasif etiketlerini göster (varsayılan: false)
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  activeLabel = 'Aktif',
  inactiveLabel = 'Pasif',
  disabled = false,
  size = 'medium',
  showLabels = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <Box>
      {label && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 0.5, fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
        >
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        {showLabels && (
          <Typography 
            variant="body2" 
            color={checked ? 'text.secondary' : 'text.primary'}
            sx={{ fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
          >
            {inactiveLabel}
          </Typography>
        )}
        <HeaderColorSwitch
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          size={size}
          inputProps={{ 'aria-label': 'toggle switch' }}
        />
        {showLabels && (
          <Typography 
            variant="body2" 
            color={checked ? 'text.primary' : 'text.secondary'}
            sx={{ fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
          >
            {activeLabel}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ToggleSwitch;
