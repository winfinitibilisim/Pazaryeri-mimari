import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Transform as TransformIcon,
  List as ListIcon
} from '@mui/icons-material';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';

const SuperXmlDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'XML İçe Aktar (Import)',
      description: 'Satıcı stok, fiyat ve ürün güncellemelerini dışarıdan içeri alın.',
      icon: <CloudUploadIcon sx={{ fontSize: 48, color: NAVY }} />,
      route: '/xml-transfer/import',
      color: 'rgba(26, 35, 126, 0.1)',
      btnBg: NAVY
    },
    {
      title: 'XML Dışa Aktar (Export)',
      description: 'Ürünlerinizi Google Merchant, Facebook vb. mecralar için XML feed olarak gönderin.',
      icon: <CloudDownloadIcon sx={{ fontSize: 48, color: ORANGE }} />,
      route: '/xml-transfer/export',
      color: 'rgba(255, 152, 0, 0.1)',
      btnBg: ORANGE
    },
    {
      title: 'Eşleştirme ve Şablonlar',
      description: 'Gelen/Giden XML etiketlerini sistem değişkenleriyle yapılandırın.',
      icon: <TransformIcon sx={{ fontSize: 48, color: NAVY }} />,
      route: '/xml-transfer/mappings',
      color: 'rgba(26, 35, 126, 0.1)',
      btnBg: NAVY
    },
    {
      title: 'Geçmiş & Loglar',
      description: 'Gerçekleşen XML senkronizasyonlarının başarı/hata kayıtlarını inceleyin.',
      icon: <ListIcon sx={{ fontSize: 48, color: RED }} />,
      route: '/xml-transfer/logs',
      color: 'rgba(244, 67, 54, 0.1)',
      btnBg: RED
    }
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 1 }}>
        Süper XML Aktar Merkezi
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Pazaryeri entegrasyonlarınız için kapsamlı XML içe/dışa aktarım ve eşleştirme merkezi.
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                border: `1px solid ${module.btnBg}40`, 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${module.btnBg}30`,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    backgroundColor: module.color, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {module.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color={NAVY} sx={{ fontSize: '1rem', lineHeight: 1.2, mb: 0.5 }}>
                    {module.title}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3 }}>
                {module.description}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
                <Button 
                  variant="contained" 
                  disableElevation
                  fullWidth
                  onClick={() => navigate(module.route)}
                  sx={{ borderRadius: 2, textTransform: 'none', backgroundColor: module.btnBg, '&:hover': { backgroundColor: module.btnBg, opacity: 0.9 } }}
                >
                  Yönetime Git
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SuperXmlDashboardPage;
