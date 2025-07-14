import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,

  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useMessage } from '../contexts/MessageContext';

// Rol arayüzü
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  status: 'active' | 'inactive';
}

// İzin arayüzü
interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

const RoleManagementPage: React.FC = () => {
  const { showMessage } = useMessage();
  
  // State tanımlamaları
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Tam yetkili sistem yöneticisi',
      permissions: ['users_view', 'users_create', 'users_edit', 'users_delete', 'roles_view', 'roles_create', 'roles_edit', 'roles_delete'],
      userCount: 3,
      createdAt: '2025-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Müşteri Yöneticisi',
      description: 'Müşteri bilgilerini yönetebilir',
      permissions: ['customers_view', 'customers_create', 'customers_edit'],
      userCount: 5,
      createdAt: '2025-02-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Satış Temsilcisi',
      description: 'Satış ve sipariş yönetimi yapabilir',
      permissions: ['orders_view', 'orders_create', 'products_view'],
      userCount: 12,
      createdAt: '2025-03-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'Raporlama',
      description: 'Sadece raporları görüntüleyebilir',
      permissions: ['reports_view'],
      userCount: 4,
      createdAt: '2025-04-05',
      status: 'inactive'
    }
  ]);
  
  // Tüm izinlerin listesi
  const [permissions, _setPermissions] = useState<Permission[]>([
    { id: 'users_view', name: 'Kullanıcıları Görüntüleme', description: 'Kullanıcı listesini görüntüleyebilir', module: 'Kullanıcı Yönetimi' },
    { id: 'users_create', name: 'Kullanıcı Oluşturma', description: 'Yeni kullanıcı ekleyebilir', module: 'Kullanıcı Yönetimi' },
    { id: 'users_edit', name: 'Kullanıcı Düzenleme', description: 'Mevcut kullanıcıları düzenleyebilir', module: 'Kullanıcı Yönetimi' },
    { id: 'users_delete', name: 'Kullanıcı Silme', description: 'Kullanıcıları silebilir', module: 'Kullanıcı Yönetimi' },
    { id: 'roles_view', name: 'Rolleri Görüntüleme', description: 'Rol listesini görüntüleyebilir', module: 'Rol Yönetimi' },
    { id: 'roles_create', name: 'Rol Oluşturma', description: 'Yeni rol ekleyebilir', module: 'Rol Yönetimi' },
    { id: 'roles_edit', name: 'Rol Düzenleme', description: 'Mevcut rolleri düzenleyebilir', module: 'Rol Yönetimi' },
    { id: 'roles_delete', name: 'Rol Silme', description: 'Rolleri silebilir', module: 'Rol Yönetimi' },
    { id: 'customers_view', name: 'Müşterileri Görüntüleme', description: 'Müşteri listesini görüntüleyebilir', module: 'Müşteri Yönetimi' },
    { id: 'customers_create', name: 'Müşteri Oluşturma', description: 'Yeni müşteri ekleyebilir', module: 'Müşteri Yönetimi' },
    { id: 'customers_edit', name: 'Müşteri Düzenleme', description: 'Mevcut müşterileri düzenleyebilir', module: 'Müşteri Yönetimi' },
    { id: 'customers_delete', name: 'Müşteri Silme', description: 'Müşterileri silebilir', module: 'Müşteri Yönetimi' },
    { id: 'products_view', name: 'Ürünleri Görüntüleme', description: 'Ürün listesini görüntüleyebilir', module: 'Ürün Yönetimi' },
    { id: 'products_create', name: 'Ürün Oluşturma', description: 'Yeni ürün ekleyebilir', module: 'Ürün Yönetimi' },
    { id: 'products_edit', name: 'Ürün Düzenleme', description: 'Mevcut ürünleri düzenleyebilir', module: 'Ürün Yönetimi' },
    { id: 'products_delete', name: 'Ürün Silme', description: 'Ürünleri silebilir', module: 'Ürün Yönetimi' },
    { id: 'orders_view', name: 'Siparişleri Görüntüleme', description: 'Sipariş listesini görüntüleyebilir', module: 'Sipariş Yönetimi' },
    { id: 'orders_create', name: 'Sipariş Oluşturma', description: 'Yeni sipariş ekleyebilir', module: 'Sipariş Yönetimi' },
    { id: 'orders_edit', name: 'Sipariş Düzenleme', description: 'Mevcut siparişleri düzenleyebilir', module: 'Sipariş Yönetimi' },
    { id: 'orders_delete', name: 'Sipariş Silme', description: 'Siparişleri silebilir', module: 'Sipariş Yönetimi' },
    { id: 'reports_view', name: 'Raporları Görüntüleme', description: 'Raporları görüntüleyebilir', module: 'Raporlama' },
    { id: 'reports_export', name: 'Rapor Dışa Aktarma', description: 'Raporları dışa aktarabilir', module: 'Raporlama' }
  ]);
  
  // Sayfalama için state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Dialog state'leri
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [newRoleStatus, setNewRoleStatus] = useState<'active' | 'inactive'>('active');
  
  // Sayfalama işleyicileri
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Rol dialog işleyicileri
  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      // Düzenleme modu
      setCurrentRole(role);
      setNewRoleName(role.name);
      setNewRoleDescription(role.description);
      setNewRolePermissions(role.permissions);
      setNewRoleStatus(role.status);
    } else {
      // Yeni rol ekleme modu
      setCurrentRole(null);
      setNewRoleName('');
      setNewRoleDescription('');
      setNewRolePermissions([]);
      setNewRoleStatus('active');
    }
    setOpenRoleDialog(true);
  };
  
  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };
  

  const handleSaveRole = () => {
    if (!newRoleName.trim()) {
      showMessage({
        title: 'Hata',
        message: 'Rol adı boş olamaz',
        type: 'error'
      });
      return;
    }
    
    if (currentRole) {
      // Mevcut rolü güncelle
      const updatedRoles = roles.map(role => 
        role.id === currentRole.id 
          ? { 
              ...role, 
              name: newRoleName, 
              description: newRoleDescription, 
              permissions: newRolePermissions,
              status: newRoleStatus
            } 
          : role
      );
      setRoles(updatedRoles);
      showMessage({
        title: 'Başarılı',
        message: 'Rol başarıyla güncellendi',
        type: 'success'
      });
    } else {
      // Yeni rol ekle
      const newRole: Role = {
        id: Math.random().toString(36).substr(2, 9),
        name: newRoleName,
        description: newRoleDescription,
        permissions: newRolePermissions,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        status: newRoleStatus
      };
      setRoles([...roles, newRole]);
      showMessage({
        title: 'Başarılı',
        message: 'Yeni rol başarıyla eklendi',
        type: 'success'
      });
    }
    
    handleCloseRoleDialog();
  };
  
  const handleDeleteRole = (roleId: string) => {
    showMessage({
      title: 'Dikkat',
      message: 'Bu rolü silmek istediğinizden emin misiniz?',
      secondaryMessage: 'Bu işlem geri alınamaz.',
      type: 'warning',
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      onConfirm: () => {
        const updatedRoles = roles.filter(role => role.id !== roleId);
        setRoles(updatedRoles);
        showMessage({
          title: 'Başarılı',
          message: 'Rol başarıyla silindi',
          type: 'success'
        });
      }
    });
  };
  
  // Modüllere göre izinleri grupla
  const permissionsByModule = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {});
  
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Rol Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenRoleDialog()}
          sx={{
            bgcolor: '#2a6496',
            '&:hover': { bgcolor: '#1e4c70' },
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Yeni Rol Ekle
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Rol Adı</TableCell>
                <TableCell>Açıklama</TableCell>
                <TableCell>İzinler</TableCell>
                <TableCell align="center">Kullanıcı Sayısı</TableCell>
                <TableCell align="center">Durum</TableCell>
                <TableCell align="center">Oluşturma Tarihi</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1" fontWeight={500}>
                          {role.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {role.permissions.length > 3 ? (
                          <>
                            {role.permissions.slice(0, 2).map(permId => {
                              const perm = permissions.find(p => p.id === permId);
                              return (
                                <Chip 
                                  key={permId} 
                                  label={perm?.name || permId} 
                                  size="small" 
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              );
                            })}
                            <Chip 
                              label={`+${role.permissions.length - 2} daha`} 
                              size="small" 
                              sx={{ fontSize: '0.7rem', bgcolor: 'rgba(0, 0, 0, 0.08)' }}
                            />
                          </>
                        ) : (
                          role.permissions.map(permId => {
                            const perm = permissions.find(p => p.id === permId);
                            return (
                              <Chip 
                                key={permId} 
                                label={perm?.name || permId} 
                                size="small" 
                                sx={{ fontSize: '0.7rem' }}
                              />
                            );
                          })
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{role.userCount}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={role.status === 'active' ? 'Aktif' : 'Pasif'} 
                        size="small" 
                        color={role.status === 'active' ? 'success' : 'default'}
                        sx={{ 
                          fontWeight: 500,
                          bgcolor: role.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                          color: role.status === 'active' ? '#2e7d32' : '#616161'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{role.createdAt}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton 
                          size="small" 
                          sx={{ mr: 1 }} 
                          color="primary"
                          onClick={() => handleOpenRoleDialog(role)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={roles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
      
      {/* Rol Ekleme/Düzenleme Dialog */}
      <Dialog 
        open={openRoleDialog} 
        onClose={handleCloseRoleDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentRole ? 'Rol Düzenle' : 'Yeni Rol Ekle'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Rol Adı"
                type="text"
                fullWidth
                variant="outlined"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Durum</InputLabel>
                <Select
                  value={newRoleStatus}
                  label="Durum"
                  onChange={(e) => setNewRoleStatus(e.target.value as 'active' | 'inactive')}
                >
                  <MenuItem value="active">Aktif</MenuItem>
                  <MenuItem value="inactive">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Açıklama"
                type="text"
                fullWidth
                variant="outlined"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                İzinler
              </Typography>
              
              {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                <Box key={module} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    {module}
                  </Typography>
                  <Grid container spacing={1}>
                    {modulePermissions.map(permission => (
                      <Grid item xs={12} sm={6} md={4} key={permission.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newRolePermissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRolePermissions([...newRolePermissions, permission.id]);
                                } else {
                                  setNewRolePermissions(newRolePermissions.filter(id => id !== permission.id));
                                }
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">{permission.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {permission.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>İptal</Button>
          <Button 
            onClick={handleSaveRole} 
            variant="contained" 
            color="primary"
          >
            {currentRole ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagementPage;
