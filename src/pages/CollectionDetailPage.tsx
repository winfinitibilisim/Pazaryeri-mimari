import React, { useState, useMemo, useRef } from 'react';
import CollectionLines from '../components/CollectionLines';
import PrintableReceipt from '../components/PrintableReceipt'; // Import the new component
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Button, Breadcrumbs, Link, Tabs, Tab,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Dialog,
  DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText, IconButton, Menu, MenuItem
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import {
  Home as HomeIcon, Print as PrintIcon, Share as ShareIcon, Delete as DeleteIcon, Cancel as CancelIcon,
  History as HistoryIcon, Description as DescriptionIcon, Info as InfoIcon, CloudUpload as CloudUploadIcon,
  InsertDriveFile as InsertDriveFileIcon, Mail as MailIcon, WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Updated Mock Data to match the receipt
const customers = [
  { 
    code: 'C001', 
    name: 'Gelişim Zücc. A.Ş.', 
    taxId: '207777726064', 
    taxOffice: 'TOPÇUMEYDANI',
    address: 'Teknopark İstanbul', 
    phone: '2123455544', 
    fax: '2123788899',
    email: 'info@gelisimzucc.com.tr', 
    chCode: '816302' 
  },
];

const collectionData = {
  customerCode: 'C001',
  date: '28.06.2025',
  description: 'tahsilat',
  processedAccount: 'Ana Kasa',
  documentNumber: 'T-4'
};

const collectionLines = [
  { id: 1, paymentType: 'Nakit', checkOwner: '', dueDate: '', docNo: '', amount: 100.00, description: 'tahsilat' },
];

const transactionHistoryData = [
  { id: 1, description: 'İptal Edildi', date: '29.06.2025 08:21', salesperson: '', user: 'drm' },
  { id: 2, description: 'Oluşturuldu', date: '28.06.2025 15:04', salesperson: '', user: 'drm' },
];

const CollectionDetailPage: React.FC = () => {
  const [tabValue, setTabValue] = useState('1');
  const { transactionId } = useParams<{ transactionId: string }>();
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareMenuAnchorEl, setShareMenuAnchorEl] = useState<null | HTMLElement>(null);

  const customer = useMemo(() => customers.find(c => c.code === collectionData.customerCode), []);

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuAnchorEl(event.currentTarget);
  };

  const handleShareViaEmail = async () => {
    if (!receiptRef.current || !collectionData || !customer) return;

    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    const pdfBlob = pdf.output('blob');

    const subject = `Tahsilat Detayı: ${customer.name} - ${collectionData.date}`;
    const body = `Merhaba,\n\n${customer.name} ait ${collectionData.date} tarihli tahsilat detayı bilgisi ektedir.\n\nİyi çalışmalar dileriz.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');

    handleShareClose();
  };

  const handleShareViaWhatsapp = () => {
    if (!collectionData || !customer) return;
    const message = `Tahsilat Detayı: ${customer.name} - ${collectionData.date}. Detaylar: ${window.location.href}`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    handleShareClose();
  };

  const handleShareClose = () => {
    setShareMenuAnchorEl(null);
  };



  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileDelete = (fileToDelete: File) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };



  const handlePrint = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    setOpenPrintModal(true);
  };

  if (!collectionData || !customer) {
    return <Typography sx={{ p: 3 }}>Tahsilat detayı veya müşteri bulunamadı.</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Gelen Ödeme Detayı</Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" component={RouterLink} to="/"><HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />Ana Sayfa</Link>
            <Link underline="hover" color="inherit" component={RouterLink} to="/tahsilat-ve-odeme">Gelen Ödeme</Link>
            <Typography color="text.primary">Gelen Ödeme Detayı</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>Yazdır</Button>
          <>
          <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShareClick}>Paylaş</Button>
          <Menu
            anchorEl={shareMenuAnchorEl}
            open={Boolean(shareMenuAnchorEl)}
            onClose={handleShareClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleShareViaEmail}>
              <ListItemIcon>
                <MailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mail ile Paylaş</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareViaWhatsapp}>
              <ListItemIcon>
                <WhatsAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>WhatsApp ile Paylaş</ListItemText>
            </MenuItem>
          </Menu>
        </>
          <Button variant="outlined" color="error" startIcon={<CancelIcon />}>İptal Et</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Sil</Button>
        </Box>
      </Box>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="collection details tabs">
            <Tab label="İşlem Bilgileri" value="1" icon={<InfoIcon />} iconPosition="start" />
            <Tab label="İşlem Geçmişi" value="2" icon={<HistoryIcon />} iconPosition="start" />
            <Tab label="Dökümanlar" value="3" icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        <TabPanel value="1" sx={{ p: 0, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>İşlem Bilgileri</Typography>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Müşteri</TableCell>
                        <TableCell>Düzenleme Tarihi</TableCell>
                        <TableCell>İşlendiği Hesaplar</TableCell>
                        <TableCell>Açıklama</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Link component={RouterLink} to={`/account-details/${collectionData.customerCode}`}>{customer.name}</Link></TableCell>
                        <TableCell>{collectionData.date}</TableCell>
                        <TableCell>{collectionData.processedAccount}</TableCell>
                        <TableCell>{collectionData.description}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}><CollectionLines collectionLines={collectionLines} /></Grid>
          </Grid>
        </TabPanel>
        <TabPanel value="2">
          <Paper sx={{p: 2, mb: 2}}>
            <Typography variant="h6" sx={{mb: 2}}>İşlem Geçmişi</Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}><TableRow><TableCell>Açıklama</TableCell><TableCell>Tarih</TableCell><TableCell>Satış Elemanı</TableCell><TableCell>Kullanıcı</TableCell></TableRow></TableHead>
                <TableBody>
                  {transactionHistoryData.map((history) => (
                    <TableRow key={history.id}><TableCell>{history.description}</TableCell><TableCell>{history.date}</TableCell><TableCell>{history.salesperson}</TableCell><TableCell>{history.user}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        <TabPanel value="3">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Dökümanlar</Typography>
            <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 1, p: 4, textAlign: 'center', cursor: 'pointer', mb: 2 }} onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileSelect} />
              <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6">Dosyaları buraya sürükleyin veya tıklayın</Typography>
            </Box>
            {uploadedFiles.length > 0 && (
              <List>
                {uploadedFiles.map((file, index) => (
                  <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => handleFileDelete(file)}><DeleteIcon /></IconButton>}>
                    <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                    <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </TabPanel>
      </TabContext>

      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <PrintableReceipt ref={receiptRef} details={collectionData} customer={customer} lines={collectionLines} />
      </div>

      <Dialog open={openPrintModal} onClose={() => setOpenPrintModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Makbuz Önizleme</DialogTitle>
        <DialogContent sx={{ height: '80vh' }}>
          <iframe src={pdfUrl} width="100%" height="100%" style={{ border: 'none' }} title="Makbuz Önizleme"/>
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenPrintModal(false)}>Kapat</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionDetailPage;
