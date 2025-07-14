import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Box, 
  Typography, 
  Button, 
  // Grid, // şu anda kullanılmıyor
  Paper, 
  // TextField, // şu anda kullanılmıyor
  // Avatar, // şu anda kullanılmıyor
  IconButton, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddButton from '../components/common/AddButton';
import HookForm from '../components/form/HookForm';
// Örnek kullanıcı verileri
// Kullanıcı tipi tanımı
interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const initialUsers: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    fullName: 'Admin User', 
    email: 'admin@example.com', 
    role: 'Admin',
    status: 'Aktif',
    lastLogin: '2025-05-26 18:30'
  },
  { 
    id: 2, 
    username: 'manager', 
    fullName: 'Ahmet Yılmaz', 
    email: 'ahmet@example.com', 
    role: 'Yönetici',
    status: 'Aktif',
    lastLogin: '2025-05-26 15:45'
  },
  { 
    id: 3, 
    username: 'user1', 
    fullName: 'Mehmet Demir', 
    email: 'mehmet@example.com', 
    role: 'Kullanıcı',
    status: 'Pasif',
    lastLogin: '2025-05-25 09:20'
  },
];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Sayfalama durumu
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sayfa değişimi
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Sayfa başına satır sayısı değişimi
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Sayfalanmış kullanıcılar
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Form alan tanımları artık HookForm içinde doğrudan tanımlandı

    // Tablo başlıkları
  const tableHeaders = [
    { id: 'username', label: 'Kullanıcı Adı' },
    { id: 'fullName', label: 'Ad Soyad' },
    { id: 'email', label: 'E-posta' },
    { id: 'role', label: 'Rol' },
    { id: 'status', label: 'Durum' },
    { id: 'lastLogin', label: 'Son Giriş' },
    { id: 'actions', label: 'İşlemler' }
  ];

  // Kullanıcı ekleme işlemi
  const handleAddUser = (formData: Record<string, any>) => {
    // Boş değerleri kontrol et
    const cleanedData: Record<string, string> = {};
    
    // Form verilerini temizle ve string olarak ayarla
    Object.entries(formData).forEach(([key, value]) => {
      cleanedData[key] = value === null || value === undefined ? '' : String(value);
    });
    
    // Yeni kullanıcı oluştur ve tüm gerekli alanların olduğundan emin ol
    const newUser: User = {
      id: users.length + 1,
      username: cleanedData.username || '',
      fullName: cleanedData.username || '', // Kullanıcı adını tam ad olarak da kullan
      email: cleanedData.email || '',
      role: cleanedData.role === 'admin' ? 'Admin' : cleanedData.role === 'editor' ? 'Editör' : 'Kullanıcı',
      status: cleanedData.status === 'active' ? 'Aktif' : 'Pasif',
      lastLogin: '-'
    };
    
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    
    // Başarılı ekleme bildirimi göster
    notifications.showCreateSuccess('Yeni kullanıcı başarıyla eklendi.');
  };

  // Kullanıcı düzenleme işlemi
  const handleEdit = (user: User) => {
    if (user) {
      // User nesnesini string kayıtlı bir nesneye dönüştür
      const userAsStringRecord: Record<string, string> = {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role === 'Admin' ? 'admin' : user.role === 'Yönetici' ? 'admin' : 'user',
        status: user.status === 'Aktif' ? 'active' : 'inactive',
        phone: '0555-555-5555' // Varsayılan telefon numarası
      };
      
      // Seçilen kullanıcının ID'sini de sakla
      setSelectedUser({...userAsStringRecord, id: user.id});
      setIsEditDialogOpen(true);
    }
  };

  // Kullanıcı düzenleme kaydetme
  const handleEditSave = (formData: Record<string, any>) => {
    // Boş değerleri kontrol et
    const cleanedData: Record<string, string> = {};
    
    // Form verilerini temizle ve string olarak ayarla
    Object.entries(formData).forEach(([key, value]) => {
      cleanedData[key] = value === null || value === undefined ? '' : String(value);
    });
    
    // selectedUser null değilse işleme devam et
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { 
          ...user, 
          username: cleanedData.username || user.username,
          fullName: cleanedData.fullName || user.fullName,
          email: cleanedData.email || user.email,
          role: cleanedData.role === 'admin' ? 'Admin' : cleanedData.role === 'editor' ? 'Editör' : 'Kullanıcı',
          status: cleanedData.status === 'active' ? 'Aktif' : 'Pasif'
        } : user
      );
      
      setUsers(updatedUsers);
      setIsEditDialogOpen(false);
      
      // Başarılı güncelleme bildirimi göster
      notifications.showUpdateSuccess('Kullanıcı bilgileri başarıyla güncellendi.');
    }
  };

  // Bildirim sistemini kullan
  const notifications = useNotifications();

  // Şifre sıfırlama işlemi
  const handleResetPassword = (userId: number) => {
    console.log('Şifre sıfırlama işlemi:', userId);
    
    // Kullanıcıyı bul
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Gerçek uygulamada API çağrısı yapılacak
    // Şimdi sadece bildirim gösteriyoruz
    setTimeout(() => {
      notifications.show(`${user.username} kullanıcısının şifresi başarıyla sıfırlandı. Yeni şifre e-posta adresine gönderildi.`, {
        severity: 'success',
        title: 'Şifre Sıfırlama Başarılı'
      });
    }, 1000); // 1 saniye gecikme ile sanki API çağrısı yapılmış gibi
  };

  // Kullanıcı detayları için dialog state'leri
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  
  // Kullanıcı detaylarını görüntüleme
  const handleViewDetails = (userId: number) => {
    console.log('Kullanıcı detayları:', userId);
    
    // Kullanıcıyı bul
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Kullanıcı detaylarını ayarla ve dialog'u aç
    setUserDetails(user);
    setDetailsDialogOpen(true);
    
    // Bildirim göster
    notifications.show(`${user.username} kullanıcısının detayları görüntüleniyor`, {
      severity: 'info',
      title: 'Kullanıcı Bilgileri'
    });
  };

  // Merkezi bildirim sistemini zaten kullanıyoruz
  // const notifications = useNotifications(); // Yukarıda tanımlandı

  // Kullanıcı silme işlemi için dialog state'leri
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Silme dialog'unu aç
  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Silme işlemini onayla
  const confirmDelete = () => {
    if (userToDelete !== null) {
      // Silme işlemini gerçekleştir
      const updatedUsers = users.filter(user => user.id !== userToDelete);
      setUsers(updatedUsers);
      
      // Dialog'u kapat
      setDeleteDialogOpen(false);
      
      // Başarılı silme bildirimi göster
      notifications.showDeleteSuccess('Kullanıcı başarıyla silindi.');
    }
  };

  // Silme işlemini iptal et
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  // Kullanıcı silme işlemi (eski fonksiyon)
  const handleDelete = (userId: number) => {
    handleDeleteClick(userId);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Silme Onay Dialog'u */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Dikkat!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu işlem geri alınamaz. Kullanıcı kalıcı olarak silinecektir.
            <br /><br />
            Seçilen kullanıcıyı silmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            İptal
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Kullanıcı Detayları Dialog'u */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        aria-labelledby="details-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="details-dialog-title">
          Kullanıcı Detayları
        </DialogTitle>
        <DialogContent>
          {userDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Kullanıcı Adı:</strong> {userDetails.username}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Ad Soyad:</strong> {userDetails.fullName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>E-posta:</strong> {userDetails.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Rol:</strong> {userDetails.role}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Durum:</strong> {userDetails.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Son Giriş:</strong> {userDetails.lastLogin}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Hesap Oluşturma:</strong> 2025-01-15
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Son Şifre Değişikliği:</strong> 2025-04-20
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          Kullanıcı Yönetimi
        </Typography>
        <AddButton 
          onClick={() => setIsAddDialogOpen(true)}
          label="Kullanıcı Ekle"
          icon={<PersonAddIcon />}
        />
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: { xs: 1, md: 3 } }}>
        <TableContainer sx={{ maxHeight: { xs: 350, sm: 400, md: 440 }, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="kullanıcı tablosu" size="small">
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => {
                  // Mobil cihazlarda bazı sütunları gizle
                  const isHiddenOnMobile = ['email', 'lastLogin'].includes(header.id);
                  const isHiddenOnSmall = ['lastLogin'].includes(header.id);
                  
                  return (
                    <TableCell 
                      key={header.id}
                      align={header.id === 'actions' ? 'center' : 'left'}
                      sx={{ 
                        fontWeight: 'bold',
                        display: {
                          xs: isHiddenOnMobile ? 'none' : 'table-cell',
                          sm: isHiddenOnSmall ? 'none' : 'table-cell',
                          md: 'table-cell'
                        },
                        padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' }
                      }}
                    >
                      {header.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                    {user.fullName}
                  </TableCell>
                  <TableCell sx={{ 
                    display: { xs: 'none', sm: 'table-cell', md: 'table-cell' },
                    padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' }
                  }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'Admin' ? 'error' : user.role === 'Yönetici' ? 'primary' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell sx={{ padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' } }}>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Aktif' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    display: { xs: 'none', sm: 'none', md: 'table-cell' },
                    padding: { xs: '8px 6px', sm: '16px 8px', md: '16px' }
                  }}>
                    {user.lastLogin}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: { xs: '8px 4px', sm: '16px 8px', md: '16px' } }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      <IconButton size="small" onClick={() => handleEdit(user)}>
                        <EditIcon fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleResetPassword(user.id)}>
                        <LockResetIcon fontSize="small" color="warning" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleViewDetails(user.id)}>
                        <VisibilityIcon fontSize="small" color="info" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(user.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
          sx={{
            '.MuiTablePagination-selectLabel': {
              display: { xs: 'none', sm: 'block' },
              margin: { xs: 0, sm: '0 10px' },
            },
            '.MuiTablePagination-displayedRows': {
              margin: { xs: '0 4px', sm: '0 10px' },
            },
            '.MuiTablePagination-select': {
              marginRight: { xs: '4px', sm: '8px' },
            },
          }}
        />
      </Paper>

      {/* Kullanıcı Ekleme Formu */}
      <HookForm
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Yeni Kullanıcı Ekle"
        onSubmit={handleAddUser}
        submitButtonText="Kaydet"
        fields={[
          {
            name: 'username',
            label: 'Kullanıcı Adı',
            type: 'text',
            required: true,
            placeholder: 'Kullanıcı adı giriniz'
          },
          {
            name: 'email',
            label: 'E-posta',
            type: 'email',
            required: true,
            placeholder: 'E-posta adresi giriniz'
          },
          {
            name: 'password',
            label: 'Şifre',
            type: 'password',
            required: true,
            placeholder: 'Şifre giriniz'
          },
          {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
              { value: 'admin', label: 'Yönetici' },
              { value: 'user', label: 'Kullanıcı' },
              { value: 'editor', label: 'Editör' }
            ]
          },
          {
            name: 'phone',
            label: 'Telefon',
            type: 'tel',
            placeholder: 'Telefon numarası giriniz'
          },
          {
            name: 'status',
            label: 'Durum',
            type: 'select',
            required: true,
            options: [
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Pasif' }
            ]
          }
        ]}
      />

      {/* Kullanıcı Düzenleme Formu */}
      <HookForm
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Kullanıcı Düzenle"
        defaultValues={selectedUser}
        onSubmit={handleEditSave}
        submitButtonText="Güncelle"
        fields={[
          {
            name: 'username',
            label: 'Kullanıcı Adı',
            type: 'text',
            required: true,
            placeholder: 'Kullanıcı adı giriniz'
          },
          {
            name: 'email',
            label: 'E-posta',
            type: 'email',
            required: true,
            placeholder: 'E-posta adresi giriniz'
          },
          {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            options: [
              { value: 'admin', label: 'Yönetici' },
              { value: 'user', label: 'Kullanıcı' },
              { value: 'editor', label: 'Editör' }
            ]
          },
          {
            name: 'phone',
            label: 'Telefon',
            type: 'tel',
            placeholder: 'Telefon numarası giriniz'
          },
          {
            name: 'status',
            label: 'Durum',
            type: 'select',
            required: true,
            options: [
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Pasif' }
            ]
          }
        ]}
      />
    </Box>
  );
};

export default UserManagementPage;
