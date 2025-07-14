import React from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Ülke bayrakları ve alan kodlarını içeren telefon giriş bileşeni
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  error,
  required,
  helperText,
  placeholder = '+90 555 123 4567',
  disabled = false
}) => {
  return (
    <FormControl fullWidth error={!!error} required={required}>
      {label && (
        <InputLabel 
          shrink 
          htmlFor="phone-input" 
          sx={{ 
            position: 'relative', 
            transform: 'none',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: error ? 'error.main' : 'text.secondary',
            mb: 0.5
          }}
        >
          {label}{required && <span> *</span>}
        </InputLabel>
      )}
      
      <ReactPhoneInput
        country={'tr'}
        value={value || ''}
        onChange={onChange}
        inputProps={{
          name: 'phone',
          id: 'phone-input',
          required,
          disabled
        }}
        containerStyle={{
          width: '100%'
        }}
        inputStyle={{
          width: '100%',
          height: '40px',
          fontSize: '14px',
          borderRadius: '4px',
          border: error ? '1px solid #d32f2f' : '1px solid #c4c4c4'
        }}
        buttonStyle={{
          border: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          backgroundColor: '#f5f5f5'
        }}
        dropdownStyle={{
          width: '300px',
          maxHeight: '300px',
          overflow: 'auto'
        }}
        enableSearch={true}
        disableSearchIcon={false}
        searchPlaceholder="Ülke ara..."
        placeholder={placeholder}
      />
      
      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PhoneInput;
