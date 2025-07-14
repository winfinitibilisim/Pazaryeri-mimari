import React, { useMemo } from 'react';
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormHelperText,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNotifications } from '../../contexts/NotificationContext';
import { FormField, ValidationPatterns } from '../../types/FormField';
import './HookForm.css';

// Yup şeması oluşturan yardımcı fonksiyon
const createYupSchema = (fields: FormField[]) => {
  const schemaFields: Record<string, any> = {};
  
  fields.forEach(field => {
    const { name, label, type, required, validation } = field;
    
    // Alan tipine göre şema oluştur
    let fieldSchema: any;
    
    switch (type) {
      case 'email':
        fieldSchema = yup.string().trim().email(ValidationPatterns.EMAIL.message);
        break;
      case 'tel':
        fieldSchema = yup.string().trim().matches(
          ValidationPatterns.PHONE.pattern,
          ValidationPatterns.PHONE.message
        );
        break;
      case 'number':
        fieldSchema = yup.number().typeError('Geçerli bir sayı giriniz');
        break;
      case 'checkbox':
      case 'switch':
        fieldSchema = yup.boolean();
        break;
      case 'date':
        fieldSchema = yup.date().typeError('Geçerli bir tarih giriniz');
        break;
      default:
        // Varsayılan olarak string tipi kullan
        fieldSchema = yup.string().trim();
    }
    
    // Özel doğrulama kuralı varsa ekle (sadece string tipler için)
    if (validation?.pattern && (type === 'text' || type === 'email' || type === 'tel' || !type)) {
      fieldSchema = fieldSchema.matches(
        validation.pattern,
        validation.message || 'Geçersiz format'
      );
    }
    
    // Zorunlu alan kontrolü
    if (required) {
      fieldSchema = fieldSchema.required(`${label} alanı zorunludur`);
    }
    
    // Şema nesnesine ekle
    schemaFields[name] = fieldSchema;
  });
  
  return yup.object().shape(schemaFields);
};

export interface HookFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit: (data: FieldValues) => void;
  title?: string;
  submitButtonText?: string;
  submitText?: string; // Alternatif gönderme butonu metni
  fields: FormField[];
  defaultValues?: Record<string, any>;
  showResetButton?: boolean;
  // Grid düzeni için
  useGrid?: boolean;
}

const HookForm: React.FC<HookFormProps> = ({
  open = true,
  onClose,
  onSubmit,
  title = '',
  submitButtonText,
  submitText,
  fields,
  defaultValues = {},
  showResetButton = false,
  useGrid = false
}) => {
  // Form alanlarından Yup şeması oluştur
  const validationSchema = useMemo(() => createYupSchema(fields), [fields]);
  
  // React Hook Form kullanımı
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    // setValue ve watch şu anda kullanılmıyor, gerektiğinde yorum satırını kaldırın
    // setValue,
    // watch
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onChange' // Değişiklik olduğunda doğrulama yap
  });

  // Bildirim sistemi
  const notifications = useNotifications();

  // Form gönderildiğinde
  const onFormSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log('Form gönderildi:', data);
    try {
      // Form verilerini gönder
      onSubmit(data);
      
      // Form başarıyla gönderildiğinde dialog'u kapat
      if (onClose) {
        onClose();
      }
      
      // Başarı bildirimi göster
      notifications.showSuccess('Form başarıyla gönderildi', 'save');
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      notifications.showError('Form gönderilirken bir hata oluştu');
    }
  };

  // Form sıfırlama
  const handleReset = () => {
    reset(defaultValues);
  };

  // Dialog kapandığında formu sıfırla
  const handleClose = () => {
    console.log('Dialog kapatma fonksiyonu çağrıldı');
    // Formu sıfırla
    handleReset();
    
    // onClose fonksiyonu tanımlanmışsa çağır
    if (onClose) {
      console.log('onClose fonksiyonu çağrılıyor');
      onClose();
    }
  };

  // Form alanlarını gruplandır
  const getGroupedFields = () => {
    const groupedFields: Record<string, FormField[]> = {};
    
    fields.forEach(field => {
      const section = field.section || 'Genel';
      if (!groupedFields[section]) {
        groupedFields[section] = [];
      }
      groupedFields[section].push(field);
    });
    
    return groupedFields;
  };

  // Form alanlarını render et
  const renderFormFields = () => {
    const groupedFields = getGroupedFields();
    
    return (
      <>
        {Object.entries(groupedFields).map(([section, sectionFields]) => (
          <Box key={section} className="form-section">
            {section !== 'Genel' && (
              <Typography variant="h6" className="section-title">{section}</Typography>
            )}
            
            {sectionFields.map(field => {
              const fieldId = `field-${field.name}`;
              const isRequired = field.required !== false;
              const hasError = !!errors[field.name];
              const errorMessage = errors[field.name]?.message as string;
              
              return (
                <Box 
                  key={fieldId} 
                  className={`form-group ${field.fullWidth ? 'full-width' : ''}`}
                  sx={{ mb: 2 }}
                >
                  {/* Text, Email, Password, Tel Input */}
                  {['text', 'email', 'password'].includes(field.type) && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          id={fieldId}
                          label={field.label}
                          type={field.type}
                          value={value || ''}
                          onChange={onChange}
                          onBlur={onBlur}
                          inputRef={ref}
                          fullWidth
                          error={hasError}
                          helperText={hasError ? errorMessage : field.helperText}
                          required={isRequired}
                          placeholder={field.placeholder}
                          InputProps={{
                            startAdornment: field.icon ? (
                              <InputAdornment position="start">{field.icon}</InputAdornment>
                            ) : null
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: 1
                            }
                          }}
                        />
                      )}
                    />
                  )}
                  
                  {field.type === 'tel' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            {field.label}{isRequired && <span className="required-star">*</span>}
                          </Typography>
                          <PhoneInput
                            country={'tr'} // Varsayılan ülke kodu (Türkiye)
                            value={value || ''}
                            onChange={(phone) => onChange(phone)}
                            onBlur={onBlur}
                            inputProps={{
                              name: field.name,
                              required: isRequired,
                              autoFocus: false,
                            }}
                            containerStyle={{
                              width: '100%',
                            }}
                            inputStyle={{
                              width: '100%',
                              height: '56px',
                              fontSize: '16px',
                              borderRadius: '4px',
                              borderColor: hasError ? '#d32f2f' : '#ccc',
                            }}
                            buttonStyle={{
                              borderColor: hasError ? '#d32f2f' : '#ccc',
                              borderTopLeftRadius: '4px',
                              borderBottomLeftRadius: '4px',
                            }}
                            dropdownStyle={{
                              width: '300px',
                            }}
                            enableSearch={true}
                            searchPlaceholder="Ülke ara..."
                            searchNotFound="Ülke bulunamadı"
                            preferredCountries={['tr', 'us', 'gb', 'de', 'fr']}
                          />
                          {hasError && (
                            <FormHelperText error>{errorMessage}</FormHelperText>
                          )}
                          {!hasError && field.helperText && (
                            <FormHelperText>{field.helperText}</FormHelperText>
                          )}
                        </Box>
                      )}
                    />
                  )}
                  
                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          id={fieldId}
                          label={field.label}
                          multiline
                          rows={4}
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value || ''}
                          required={isRequired}
                          placeholder={field.placeholder}
                          error={hasError}
                          helperText={errorMessage || field.helperText}
                          fullWidth
                        />
                      )}
                    />
                  )}
                  
                  {/* Select */}
                  {field.type === 'select' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <FormControl fullWidth error={hasError}>
                          <InputLabel id={`${fieldId}-label`}>{field.label}</InputLabel>
                          <Select
                            labelId={`${fieldId}-label`}
                            id={fieldId}
                            value={value || ''}
                            onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
                            onBlur={onBlur}
                            label={field.label}
                            required={isRequired}
                          >
                            <MenuItem value="">
                              <em>{field.placeholder || 'Seçiniz...'}</em>
                            </MenuItem>
                            {field.options?.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {(hasError || field.helperText) && (
                            <FormHelperText>{errorMessage || field.helperText}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                  
                  {/* Checkbox */}
                  {field.type === 'checkbox' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <FormControl error={hasError} fullWidth>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!value}
                                onChange={onChange}
                                onBlur={onBlur}
                                inputRef={ref}
                              />
                            }
                            label={field.label}
                          />
                          {(hasError || field.helperText) && (
                            <FormHelperText>{errorMessage || field.helperText}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                  
                  {/* Switch */}
                  {field.type === 'switch' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <FormControl error={hasError} fullWidth>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!value}
                                onChange={onChange}
                                onBlur={onBlur}
                                inputRef={ref}
                              />
                            }
                            label={field.label}
                          />
                          {(hasError || field.helperText) && (
                            <FormHelperText>{errorMessage || field.helperText}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                  
                  {/* Radio Group */}
                  {field.type === 'radio' && (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <FormControl error={hasError} fullWidth>
                          <FormLabel component="legend">{field.label}</FormLabel>
                          <RadioGroup
                            value={value || ''}
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            {field.options?.map(option => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                              />
                            ))}
                          </RadioGroup>
                          {(hasError || field.helperText) && (
                            <FormHelperText>{errorMessage || field.helperText}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </>
    );
  };

  // Form render fonksiyonu
  const renderForm = () => {
    return (
      <form 
        onSubmit={handleSubmit(onFormSubmit)} 
        className="hook-form"
        noValidate
      >
        {renderFormFields()}
        <DialogActions>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }} 
            color="primary"
            type="button"
          >
            İptal
          </Button>
          {showResetButton && (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }} 
              color="secondary"
              type="button"
            >
              Sıfırla
            </Button>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
          >
            {submitText || submitButtonText || 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    );
  };

  // BranchesPage için özel durum: Dialog içinde zaten olduğumuzdan sadece form içeriğini döndür
  if (typeof open === 'undefined') {
    return renderForm();
  }
  
  // Normal dialog kullanımı
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form 
        onSubmit={handleSubmit(onFormSubmit)} 
        className="hook-form"
        noValidate
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Kapat butonu tıklandı');
                handleClose();
              }}
              type="button"
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {renderFormFields()}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }} 
            color="primary"
            type="button"
          >
            İptal
          </Button>
          {showResetButton && (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleReset();
              }} 
              color="secondary"
              type="button"
            >
              Sıfırla
            </Button>
          )}
          <Button 
            type="button" 
            color="primary" 
            variant="contained"
            onClick={() => {
              console.log('Kaydet butonuna tıklandı');
              // Form submit olayını manuel olarak tetikle
              handleSubmit(onFormSubmit)();
            }}
          >
            {submitText || submitButtonText || 'Kaydet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default HookForm;
