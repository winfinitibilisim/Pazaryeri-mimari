import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VpnKey as PasswordIcon
} from '@mui/icons-material';

interface PasswordChangeDialogProps {
  open: boolean;
  onClose: () => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = () => {
    // Reset previous states
    setError('');
    setSuccess(false);

    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifre ve şifre tekrarı eşleşmiyor.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }

    // Here you would typically make an API call to change the password
    console.log('Changing password...');
    console.log('Current password:', currentPassword);
    console.log('New password:', newPassword);

    // Simulate success
    setSuccess(true);

    // Reset form after 2 seconds and close dialog
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PasswordIcon sx={{ mr: 1, color: '#ff1744' }} />
            <Typography variant="h6">Şifre Değiştir</Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Şifreniz başarıyla değiştirildi!
          </Alert>
        )}

        <TextField
          margin="dense"
          label="Mevcut Şifre"
          type={showCurrentPassword ? 'text' : 'password'}
          fullWidth
          required
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleCurrentPasswordVisibility}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Yeni Şifre"
          type={showNewPassword ? 'text' : 'password'}
          fullWidth
          required
          value={newPassword}
          onChange={handleNewPasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleNewPasswordVisibility}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          margin="dense"
          label="Yeni Şifre (Tekrar)"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleConfirmPasswordVisibility}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Şifreniz en az 8 karakter uzunluğunda olmalıdır. Güvenlik için büyük harf, küçük harf, rakam ve özel karakter içermesi tavsiye edilir.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          İptal
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#ff1744', '&:hover': { bgcolor: '#d81b60' } }}
          disabled={success}
        >
          {success ? 'Şifre Değiştirildi' : 'Şifreyi Değiştir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog; 