import React from 'react';
import { Box, Typography, Container, Link, Divider, IconButton } from '@mui/material';
import { 
  LinkedIn as LinkedInIcon, 
  Twitter as TwitterIcon, 
  GitHub as GitHubIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { colors } from '../../theme/colors';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 1,
        mt: 'auto',
        backgroundColor: colors.grey100,
        borderTop: `1px solid ${colors.grey300}`,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 1.5,
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              <span style={{ color: colors.primary }}>W</span>infiniti
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yönetim paneli çözümü
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 3 },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.primary" gutterBottom>
                Linkler
              </Typography>
              <Link href="#" underline="hover" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Ana Sayfa
              </Link>
              <Link href="#" underline="hover" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Hakkında
              </Link>
              <Link href="#" underline="hover" color="text.secondary" display="block">
                İletişim
              </Link>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.primary" gutterBottom>
                Destek
              </Typography>
              <Link href="#" underline="hover" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Yardım Merkezi
              </Link>
              <Link href="#" underline="hover" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Dokümantasyon
              </Link>
              <Link href="#" underline="hover" color="text.secondary" display="block">
                SSS
              </Link>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Winfiniti. Tüm hakları saklıdır.
          </Typography>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <IconButton size="small" aria-label="LinkedIn" sx={{ color: colors.primary }}>
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Twitter" sx={{ color: colors.primary }}>
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="GitHub" sx={{ color: colors.primary }}>
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="Facebook" sx={{ color: colors.primary }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 