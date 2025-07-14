import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    } else {
      newErrors.email = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    } else {
      newErrors.password = '';
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validate()) {
      // For demo purposes, hardcoded credentials
      if (formData.email === 'admin@example.com' && formData.password === 'password') {
        // Call the onLogin function passed as prop
        onLogin();
        navigate('/dashboard');
      } else {
        setErrors({
          ...errors,
          password: 'Invalid email or password',
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 800,
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Left side - Image or color block */}
        {!isMobile && (
          <Box
            sx={{
              flex: '1 1 40%',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              React Admin Panel
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 4 }}>
              A comprehensive solution for managing your application.
            </Typography>
            <Box
              component="img"
              src="https://via.placeholder.com/300x200?text=Dashboard+Preview"
              alt="Dashboard Preview"
              sx={{
                maxWidth: '100%',
                borderRadius: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        )}
        
        {/* Right side - Login form */}
        <Box
          sx={{
            flex: '1 1 60%',
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Login to Admin Panel
          </Typography>
          
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2, mb: 1 }}
            >
              Sign In
            </Button>
            
            {/* Otomatik giriş butonu - Sadece geliştirme sürecinde */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{ mt: 1, mb: 3 }}
              onClick={() => {
                onLogin();
                const lastVisitedPage = localStorage.getItem('lastVisitedPage') || '/dashboard';
                navigate(lastVisitedPage);
              }}
            >
              Otomatik Giriş
            </Button>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Credentials
              </Typography>
            </Divider>
            
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Email: admin@example.com
                </Typography>
                <Typography variant="body2">
                  Password: password
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 