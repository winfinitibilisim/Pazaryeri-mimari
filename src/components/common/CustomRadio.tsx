import React, { useState } from 'react';
import { 
  Radio, 
  RadioProps, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  RadioGroup,
  FormHelperText,
  Box,
  styled
} from '@mui/material';
import { orange, red } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

// Özel renkli radio butonu
const OrangeRedRadio = styled(Radio)(({ checked }) => ({
  color: red[400],
  '&.Mui-checked': {
    color: orange[500],
  },
}));

// Interface for individual radio option
export interface RadioOption {
  value: string;
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'default' | 'custom' | 'orange';
  customColor?: {
    default: string;
    checked: string;
  };
  disabled?: boolean;
}

// Interface for the CustomRadio component props
export interface CustomRadioProps {
  options: RadioOption[];
  name: string;
  label?: string;
  value?: string;
  row?: boolean;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  options,
  name,
  label,
  value: externalValue,
  row = false,
  onChange,
  required = false,
  error = false,
  helperText
}) => {
  const { t } = useTranslation();
  // Use internal state if no external value is provided
  const [internalValue, setInternalValue] = useState<string>(options[0]?.value || '');
  
  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;

  // Handle radio change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Helper function to get props for each radio button
  const getRadioProps = (option: RadioOption): RadioProps => {
    const baseProps: RadioProps = {
      value: option.value,
      disabled: option.disabled,
      checked: value === option.value
    };

    // Varsayılan olarak kırmızı rengi kullan, seçili olduğunda turuncu olacak
    if (!option.color || option.color === 'default') {
      return {
        ...baseProps,
        sx: {
          color: red[400],  // Pasif durumda kırmızı
          '&.Mui-checked': {
            color: orange[500],  // Aktif durumda turuncu
          },
        }
      };
    } else if (option.color === 'custom' && option.customColor) {
      return {
        ...baseProps,
        sx: {
          color: option.customColor.default,
          '&.Mui-checked': {
            color: option.customColor.checked,
          },
        }
      };
    } else if (option.color === 'orange') {
      return {
        ...baseProps,
        sx: {
          color: red[400],  // Pasif durumda kırmızı
          '&.Mui-checked': {
            color: orange[500],  // Aktif durumda turuncu
          },
        }
      };
    } else if (option.color && option.color !== 'custom') {
      return {
        ...baseProps,
        color: option.color
      };
    }

    return baseProps;
  };

  return (
    <FormControl 
      component="fieldset" 
      error={error} 
      required={required}
      sx={{ width: '100%' }}
    >
      {typeof label === 'string' && label && (
        <FormLabel component="legend" sx={{ mb: 1 }}>
          {t(label)}
        </FormLabel>
      )}
      
      <RadioGroup
        name={name}
        value={value}
        onChange={handleChange}
        row={row}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<OrangeRedRadio value={option.value} disabled={option.disabled} />}
            label={t(option.label)}
            sx={{ mr: row ? 4 : 0 }}
          />
        ))}
      </RadioGroup>
      
      {typeof helperText === 'string' && helperText && (
        <FormHelperText>{t(helperText)}</FormHelperText>
      )}
    </FormControl>
  );
};

// Example usage function to demonstrate how to use the component
export const RadioExamples: React.FC = () => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState('a');

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const basicOptions: RadioOption[] = [
    { value: 'a', label: 'option_a', color: 'primary' },
    { value: 'b', label: 'option_b', color: 'secondary' },
    { value: 'c', label: 'option_c', color: 'success' },
    { value: 'd', label: 'option_d', color: 'default' },
    { 
      value: 'e', 
      label: 'option_e', 
      color: 'orange'
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', my: 4 }}>
      <CustomRadio
        options={basicOptions}
        name="radio-buttons-example"
        label="Radio_Button_Options"
        value={selectedValue}
        onChange={handleChange}
        row={true}
      />
    </Box>
  );
};

export default CustomRadio;
