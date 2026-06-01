import React from 'react';
import { Box, Typography, Paper, Grid, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  SettingsInputComponent as ErpIcon,
  ContactSupport as CrmIcon,
  ReceiptLong as AccountingIcon,
  Textsms as CommIcon,
  CheckCircle as SuccessIcon,
  ErrorOutline as WarningIcon
} from '@mui/icons-material';

const NAVY = '#1A237E';
const ORANGE = '#FF9800';
const RED = '#F44336';
const GREEN = '#4CAF50';

const ErpCrmDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const connections = [
    { name: 'Logo Tiger', type: 'ERP', status: 'Active' },
    { name: 'Salesforce', type: 'CRM', status: 'Active' },
    { name: 'Paraşüt (E-Fatura)', type: 'Muhasebe', status: 'Warning' },
    { name: 'Netgsm (SMS)', type: 'İletişim', status: 'Active' },
  ];

  const modules = [
    {
      title: 'ERP Entegrasyonları',
      description: 'Logo, SAP, Mikro, Netsis gibi köklü finans ve envanter sistemlerini bağlayın.',
      icon: <ErpIcon sx={{ fontSize: 40, color: NAVY }} />,
      route: '/erp-crm/erp-integrations',
      bgColor: '#1A237E10',
      btnColor: NAVY
    },
    {
      title: 'CRM Entegrasyonları',
      description: 'Salesforce, HubSpot, Zendesk gibi müşteri takip sistemlerinizi platformla eşleştirin.',
      icon: <CrmIcon sx={{ fontSize: 40, color: ORANGE }} />,
      route: '/erp-crm/crm-integrations',
      bgColor: '#FF980010',
      btnColor: ORANGE
    },
    {
      title: 'E-Fatura & Mali İşlemler',
      description: 'Uyumsoft, Paraşüt, KolayBi Vb. e-fatura/e-arşiv entegratörlerinizi yönetin.',
      icon: <AccountingIcon sx={{ fontSize: 40, color: NAVY }} />,
      route: '/erp-crm/accounting-automations',
      bgColor: '#1A237E10',
      btnColor: NAVY
    },
    {
      title: 'İletişim & Pazarlama Logları',
      description: 'Müşterilere veya satıcılara giden otomatik SMS ve Email akışlarının başarısını izleyin.',
      icon: <CommIcon sx={{ fontSize: 40, color: RED }} />,
      route: '/erp-crm/communication-logs',
      bgColor: '#F4433610',
      btnColor: RED
    }
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="600" color={NAVY} sx={{ mb: 1 }}>
        Kurumsal Entegrasyon Merkezi
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Dış sistemlerinizi pazaryeri yapılarına sorunsuz bağlayarak e-ihracat ve finans operasyonlarını otomatikleştirin.
      </Typography>

      {/* Active connections summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f9f9fc', border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Mevcut Aktif Bağlantılar</Typography>
        <Grid container spacing={2}>
          {connections.map((conn, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Avatar sx={{ bgcolor: conn.status === 'Active' ? `${GREEN}20` : `${ORANGE}20`, color: conn.status === 'Active' ? GREEN : ORANGE, mr: 2 }}>
                  {conn.status === 'Active' ? <SuccessIcon /> : <WarningIcon />}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="bold">{conn.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{conn.type}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Module Navigation */}
      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `1px solid ${module.btnColor}40`, 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: module.bgColor, mr: 2 }}>
                  {module.icon}
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" color={NAVY} sx={{ lineHeight: 1.2 }}>
                  {module.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3 }}>
                {module.description}
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate(module.route)}
                sx={{ borderRadius: 2, textTransform: 'none', color: module.btnColor, borderColor: module.btnColor, '&:hover': { borderColor: module.btnColor, bgcolor: module.bgColor } }}
              >
                Ayarlara Git
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ErpCrmDashboardPage;
