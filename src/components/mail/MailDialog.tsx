import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Box, 
  Typography, 
  IconButton, 
  Checkbox, 
  Tooltip, 

  InputBase,

} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,

  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon,
  Mail as MailIcon
} from '@mui/icons-material';

// Mail bileşenlerini import et
import MailSidebar from './MailSidebar';
import MailList from './MailList';
import MailDetail from './MailDetail';
import MailCompose from './MailCompose';
import MailSettings from './MailSettings';

// Mail tiplerini ve örnek verileri import et
import { Mail, MailFolder, dummyMails, folders, labels } from './types';

interface MailDialogProps {
  open: boolean;
  onClose: () => void;
}

const MailDialog: React.FC<MailDialogProps> = ({ open, onClose }) => {
  // State tanımlamaları
  const [mails, setMails] = useState<Mail[]>([]);
  const [filteredMails, setFilteredMails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [selectedMailIds, setSelectedMailIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState<MailFolder>('inbox');
  const [composeOpen, setComposeOpen] = useState(false);
  // Kullanılmayan state'ler yorum satırına alındı
  // const [replyOpen, setReplyOpen] = useState(false);
  // const [forwardOpen, setForwardOpen] = useState(false);
  const [mailDetailOpen, setMailDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  // Mail oluşturma modu: yeni, yanıtlama veya iletme
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'forward'>('compose');
  // Mail ayarları dialog'u için state
  const [settingsOpen, setSettingsOpen] = useState(false);
  
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
    
    setComposeOpen(false);
  };
  
  // Filtre panelini açma/kapatma işlevi
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  // Mail ayarları dialog'unu açma işlevi
  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };
  
  // Mail ayarları dialog'unu kapatma işlevi
  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: { 
          height: '85vh', 
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          m: 2,
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ p: 0, borderBottom: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailIcon sx={{ color: '#25638f' }} />
            E-posta
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
          {/* Sol Sidebar */}
          <MailSidebar 
            folders={folders}
            labels={labels}
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            onComposeClick={handleComposeOpen}
          />
          
          {/* Sağ İçerik */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            {/* Üst Araç Çubuğu */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1.5,
              borderBottom: '1px solid #e0e0e0',
              bgcolor: '#f9f9f9'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  indeterminate={selectedMailIds.length > 0 && selectedMailIds.length < filteredMails.length}
                  checked={selectedMailIds.length > 0 && selectedMailIds.length === filteredMails.length}
                  onChange={handleSelectAllMails}
                  size="small"
                />
                
                <Tooltip title="Yenile">
                  <IconButton size="small">
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                {selectedMailIds.length > 0 && (
                  <>
                    <Tooltip title="Sil">
                      <IconButton size="small" onClick={handleDeleteMails}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Arşivle">
                      <IconButton size="small">
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Etiketle">
                      <IconButton size="small">
                        <LabelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '50%', maxWidth: 500 }}>
                  <InputBase
                    placeholder="Mail Ara"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{
                      width: '100%',
                      bgcolor: '#fff',
                      borderRadius: 28,
                      pl: 5,
                      pr: 2,
                      py: 0.8,
                      border: '1px solid #e0e0e0',
                      fontSize: '0.875rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <SearchIcon sx={{ position: 'absolute', left: 16, top: 8, color: '#25638f', fontSize: '1.2rem' }} />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Filtrele">
                  <IconButton 
                    size="small" 
                    onClick={handleFilterToggle}
                    sx={{ 
                      bgcolor: filterOpen ? 'rgba(37, 99, 143, 0.1)' : 'transparent',
                      mr: 1,
                      '&:hover': { bgcolor: 'rgba(37, 99, 143, 0.1)' }
                    }}
                  >
                    <FilterListIcon fontSize="small" sx={{ color: filterOpen ? '#25638f' : 'inherit' }} />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="E-posta Ayarları">
                  <IconButton 
                    size="small" 
                    onClick={handleSettingsOpen}
                    sx={{ 
                      mr: 1,
                      '&:hover': { bgcolor: 'rgba(37, 99, 143, 0.1)' }
                    }}
                  >
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                
                <Typography variant="body2" sx={{ display: 'inline-block', mx: 1, bgcolor: 'rgba(0,0,0,0.05)', px: 1.5, py: 0.5, borderRadius: 10, fontSize: '0.75rem', fontWeight: 500 }}>
                  {`1-${filteredMails.length} / ${filteredMails.length}`}
                </Typography>
              </Box>
            </Box>
            
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
        </Box>
      </DialogContent>
      
      {/* Mail Oluşturma Dialog'u */}
      <MailCompose
        open={composeOpen}
        onClose={handleComposeClose}
        onSend={handleSendMail}
        replyTo={composeMode === 'reply' ? selectedMail : null}
        forwardFrom={composeMode === 'forward' ? selectedMail : null}
        mode={composeMode}
      />
      
      {/* Mail Ayarları Dialog'u */}
      <MailSettings
        open={settingsOpen}
        onClose={handleSettingsClose}
      />
    </Dialog>
  );
};

export default MailDialog;
