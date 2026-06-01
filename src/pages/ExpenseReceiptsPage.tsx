import React from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent } from '@mui/material';
import { Receipt as ReceiptIcon, TrendingUp as TrendingUpIcon, Assessment as AssessmentIcon, Add as AddIcon } from '@mui/icons-material';
import ExpenseReceiptList from '../components/expenseReceipt/ExpenseReceiptList';
import PageHeader from '../components/layout/PageHeader';

const ExpenseReceiptsPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Modern Header with PageHeader */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <PageHeader
          title="Gider Fişleri"
          actionButton={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#fff',
                color: '#3949ab',
                '&:hover': { bgcolor: '#f5f5f5' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none'
              }}
            >
              Yeni Gider Fişi
            </Button>
          }
        />
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
