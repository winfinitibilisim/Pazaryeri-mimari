import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Checkbox, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Divider, 
  Collapse, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  InputBase
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon
} from '@mui/icons-material';

// Mail bileşenlerini import et
import MailSidebar from '../components/mail/MailSidebar';
import MailList from '../components/mail/MailList';
import MailDetail from '../components/mail/MailDetail';
import MailCompose from '../components/mail/MailCompose';

// Mail tiplerini ve örnek verileri import et
import { Mail, MailFolder, dummyMails, folders, labels } from '../components/mail/types';

const MailPage: React.FC = () => {
  // State tanımlamaları
  const [mails, setMails] = useState<Mail[]>([]);
  const [filteredMails, setFilteredMails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [selectedMailIds, setSelectedMailIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState<MailFolder>('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  const [mailDetailOpen, setMailDetailOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'forward'>('compose');
  
  // Mail verilerini yükle
  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilir
    setMails(dummyMails);
    setFilteredMails(dummyMails.filter(mail => mail.folder === currentFolder));
  }, [currentFolder]);
  
  // Mail seçme işlevi
  const handleMailSelect = (mail: Mail) => {
    setSelectedMail(mail);
    setMailDetailOpen(true);
    
    // Mail okundu olarak işaretle
    if (!mail.isRead) {
      const updatedMails = mails.map(m => 
        m.id === mail.id ? { ...m, isRead: true } : m
      );
      setMails(updatedMails);
      setFilteredMails(updatedMails.filter(m => m.folder === currentFolder));
    }
  };
  
  // Toplu mail seçme işlevi
  const handleMailCheckboxChange = (mailId: string) => {
    if (selectedMailIds.includes(mailId)) {
      setSelectedMailIds(selectedMailIds.filter(id => id !== mailId));
    } else {
      setSelectedMailIds([...selectedMailIds, mailId]);
    }
  };
  
  // Tüm mailleri seçme/seçimi kaldırma işlevi
  const handleSelectAllMails = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedMailIds(filteredMails.map(mail => mail.id));
    } else {
      setSelectedMailIds([]);
    }
  };
  
  // Arama işlevi
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    
    if (searchValue) {
      const filtered = mails.filter(mail => 
        mail.folder === currentFolder && 
        (mail.subject.toLowerCase().includes(searchValue.toLowerCase()) || 
         mail.from.name.toLowerCase().includes(searchValue.toLowerCase()) || 
         mail.content.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredMails(filtered);
    } else {
      setFilteredMails(mails.filter(mail => mail.folder === currentFolder));
    }
  };
  
  // Klasör değiştirme işlevi
  const handleFolderChange = (folderId: MailFolder) => {
    setCurrentFolder(folderId);
    setFilteredMails(mails.filter(mail => mail.folder === folderId));
    setSelectedMailIds([]);
    setMailDetailOpen(false);
    setSelectedMail(null);
  };
  
  // Yıldızlama işlevi
  const handleStarMail = (mailId: string) => {
    const updatedMails = mails.map(mail => 
      mail.id === mailId ? { ...mail, isStarred: !mail.isStarred } : mail
    );
    setMails(updatedMails);
    setFilteredMails(updatedMails.filter(mail => mail.folder === currentFolder));
  };
  
  // Mail silme işlevi
  const handleDeleteMails = () => {
    const updatedMails = mails.map(mail => 
      selectedMailIds.includes(mail.id) ? { ...mail, folder: 'trash' as MailFolder } : mail
    );
    setMails(updatedMails);
    setFilteredMails(updatedMails.filter(mail => mail.folder === currentFolder));
    setSelectedMailIds([]);
    
    if (selectedMail && selectedMailIds.includes(selectedMail.id)) {
      setMailDetailOpen(false);
      setSelectedMail(null);
    }
  };
  
  // Yeni mail oluşturma işlevi
  const handleComposeOpen = () => {
    setComposeMode('compose');
    setComposeOpen(true);
  };
  
  const handleComposeClose = () => {
    setComposeOpen(false);
  };
  
  // Yanıtlama işlevi
  const handleReplyOpen = () => {
    setComposeMode('reply');
    setComposeOpen(true);
  };
  
  // İletme işlevi
  const handleForwardOpen = () => {
    setComposeMode('forward');
    setComposeOpen(true);
  };
  
  // Mail detay kapatma işlevi
  const handleMailDetailClose = () => {
    setMailDetailOpen(false);
    setSelectedMail(null);
  };
  
  // Mail gönderme işlevi
  const handleSendMail = (mail: Partial<Mail>) => {
    // Gerçek uygulamada API'ye gönderilir
    console.log('Mail gönderildi:', mail);
    
    // Gönderilen klasörüne ekle
    const newMail: Mail = {
      id: `new-${Date.now()}`,
      from: {
        name: 'Ben',
        email: 'ben@example.com',
      },
      to: mail.to || [],
      subject: mail.subject || '',
      content: mail.content || '',
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isStarred: false,
      isImportant: false,
      labels: [],
      attachments: mail.attachments || [],
      folder: 'sent' as MailFolder, // Type assertion ile MailFolder tipine dönüştürüyoruz
    };
    
    // Tip güvenliği için mevcut mailleri kopyalayıp yeni maili ekleyelim
    setMails(prevMails => [...prevMails, newMail]);
    
    if (currentFolder === 'sent') {
      setFilteredMails(prevFiltered => [...prevFiltered, newMail]);
    }
  };
  
  // Menü işlemleri
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Filtre panelini açma/kapatma işlevi
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Sol Kenar Çubuğu */}
      <MailSidebar
        folders={folders}
        labels={labels}
        currentFolder={currentFolder}
        onFolderChange={handleFolderChange}
        onComposeClick={handleComposeOpen}
      />
      
      {/* Ana İçerik */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Üst Araç Çubuğu */}
        <Box
          sx={{
            p: 1,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              indeterminate={selectedMailIds.length > 0 && selectedMailIds.length < filteredMails.length}
              checked={selectedMailIds.length > 0 && selectedMailIds.length === filteredMails.length}
              onChange={handleSelectAllMails}
              sx={{ ml: 1 }}
            />
            <Tooltip title="Yenile">
              <IconButton>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {selectedMailIds.length > 0 && (
              <>
                <Tooltip title="Sil">
                  <IconButton onClick={handleDeleteMails}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Arşivle">
                  <IconButton>
                    <ArchiveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Etiketle">
                  <IconButton>
                    <LabelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                backgroundColor: '#f5f5f5',
                borderRadius: '24px',
                px: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              <InputBase
                placeholder="E-postaları ara..."
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                sx={{ py: 1 }}
              />
            </Box>
          </Box>
          
          <Box>
            <Tooltip title="Filtrele">
              <IconButton onClick={handleFilterToggle}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Daha Fazla">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Tümünü Okundu İşaretle</MenuItem>
              <MenuItem onClick={handleMenuClose}>Sıralama Seçenekleri</MenuItem>
              <Divider />
              <MenuItem onClick={handleMenuClose}>Ayarlar</MenuItem>
              <MenuItem onClick={handleMenuClose}>Yardım</MenuItem>
            </Menu>
          </Box>
        </Box>
        
        {/* Filtre Paneli */}
        <Collapse in={filterOpen}>
          <Paper sx={{ p: 2, m: 1, borderRadius: '8px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Gelişmiş Filtreler
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Gönderen"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Konu İçeriği"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tarih Aralığı"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleFilterToggle}
                    sx={{ mr: 1 }}
                  >
                    İptal
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleFilterToggle}
                    sx={{ bgcolor: '#25638f', '&:hover': { bgcolor: '#1e5172' } }}
                  >
                    Filtrele
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
        
        {/* İçerik Alanı */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Mail Listesi */}
          <Box
            sx={{
              width: mailDetailOpen ? '40%' : '100%',
              height: '100%',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9',
              transition: 'width 0.3s ease',
            }}
          >
            <MailList
              mails={filteredMails}
              selectedMailIds={selectedMailIds}
              onMailSelect={handleMailSelect}
              onMailCheckboxChange={handleMailCheckboxChange}
              onStarMail={handleStarMail}
            />
          </Box>
          
          {/* Mail Detayı */}
          {mailDetailOpen && (
            <Box
              sx={{
                width: '60%',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <MailDetail
                mail={selectedMail}
                onClose={handleMailDetailClose}
                onReply={handleReplyOpen}
                onForward={handleForwardOpen}
                onDelete={handleDeleteMails}
                onStar={handleStarMail}
              />
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Mail Oluşturma Dialog'u */}
      <MailCompose
        open={composeOpen}
        onClose={handleComposeClose}
        onSend={handleSendMail}
        replyTo={composeMode === 'reply' ? selectedMail : null}
        forwardFrom={composeMode === 'forward' ? selectedMail : null}
        mode={composeMode}
      />
    </Box>
  );
};

export default MailPage;
