import React from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent } from '@mui/material';
import { Receipt as ReceiptIcon, TrendingUp as TrendingUpIcon, Assessment as AssessmentIcon, Add as AddIcon } from '@mui/icons-material';
import ExpenseReceiptList from '../components/expenseReceipt/ExpenseReceiptList';

const ExpenseReceiptsPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Modern Header with Gradient */}
      <Box sx={{
        background: 'linear-gradient(135deg, #25638f 0%, #1e4a6f 100%)',
        color: 'white',
        p: 4,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <ReceiptIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Gider Fişleri
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Harcama kayıtlarını yönetin ve takip edin
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Yeni Gider Fişi
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        {/* Quick Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <ReceiptIcon sx={{ fontSize: 48, color: '#25638f', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#25638f', mb: 1 }}>
                  156
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Gider Fişi
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#28a745', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#28a745', mb: 1 }}>
                  ₺45,280
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bu Ay Toplam
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <AssessmentIcon sx={{ fontSize: 48, color: '#fd7e14', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fd7e14', mb: 1 }}>
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bekleyen Onay
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper sx={{ 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          <ExpenseReceiptList />
        </Paper>
      </Box>
    </Box>
  );
};

export default ExpenseReceiptsPage;
