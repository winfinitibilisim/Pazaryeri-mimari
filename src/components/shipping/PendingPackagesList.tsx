import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  TextFieldProps,
  InputAdornment,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, FilterList, Search, Visibility, MoreVert } from '@mui/icons-material';
import ExportButton from '../common/ExportButton';
import PrintButton from '../common/PrintButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

interface IPackage {
  id: number;
  plugNo: number;
  alici: string;
  satici: string;
  paket: number;
  tip: string;
  adet: number;
  kilo: number;
  hacim: number;
  fiyat: string;
  subeAdi: string;
  varisYeri: string;
  created: string;
  status: 'Bekliyor' | 'Gönderildi';
}

interface IPackageGroup {
  id: number;
  summary: {
    bekliyor: number;
    gonderildi: number;
  };
  packages: IPackage[];
}

const packageGroups: IPackageGroup[] = [
  {
    id: 1,
    summary: { bekliyor: 93, gonderildi: 8 },
    packages: [
      {
        id: 1,
        plugNo: 27,
        alici: 'Ahmet Durmaz TR-01',
        satici: 'Yiğit Kemal',
        paket: 20,
        tip: 'Tır',
        adet: 100,
        kilo: 20,
        hacim: 15,
        fiyat: '$1250.00',
        subeAdi: 'İstanbul Şubesi',
        varisYeri: 'Turkey',
        created: '12/04/2025 6:36',
        status: 'Bekliyor',
      },
    ],
  },
  {
    id: 2,
    summary: { bekliyor: 16, gonderildi: 5 },
    packages: [
      {
        id: 3,
        plugNo: 26,
        alici: 'Mirza SS-407',
        satici: 'Winfiniti Bilişim Promosyon Giyim ve Turizm A.Ş',
        paket: 21,
        tip: 'Tır',
        adet: 0,
        kilo: 0,
        hacim: 0,
        fiyat: '$0.00',
        subeAdi: 'Ankara Şubesi',
        varisYeri: 'Kyrgyzstan',
        created: '8/03/2025 9:31',
        status: 'Bekliyor',
      },
    ],
  },
];

const PendingPackagesList: React.FC = () => {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(true);
  // DEBUG: Temporarily disable state and effects to isolate the render error
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('Tümü');
  const [creationDate, setCreationDate] = useState<Date | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IPackageGroup | null>(null);
  const [plugNoFilter, setPlugNoFilter] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<IPackageGroup[]>(packageGroups);

  /*
  const applyFilters = useCallback(() => {
    let tempGroups = packageGroups.map(group => ({
      ...group,
      packages: group.packages.filter(pkg => {
        const plugNoFilterLower = plugNoFilter.toLowerCase();
        const matchesPlugNo = plugNoFilter === '' || pkg.plugNo.toString().includes(plugNoFilterLower);
        const searchTextLower = searchText.toLowerCase();
        const matchesAlici = searchText === '' || pkg.alici.toLowerCase().includes(searchTextLower);
        let matchesDate = true;
        if (creationDate) {
          const pkgDate = new Date(pkg.created.split(' ')[0].split('/').reverse().join('-'));
          matchesDate = pkgDate.getFullYear() === creationDate.getFullYear() &&
                      pkgDate.getMonth() === creationDate.getMonth() &&
                      pkgDate.getDate() === creationDate.getDate();
        }
        const matchesStatus = status === 'Tümü' || pkg.status === status;
        return matchesPlugNo && matchesAlici && matchesDate && matchesStatus;
      })
    })).filter(group => group.packages.length > 0);
    setFilteredGroups(tempGroups);
  }, [packageGroups, searchText, creationDate, status, plugNoFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  */

  const handleExport = () => {
    // console.log('Dışa aktarılıyor...', filteredGroups);
  };

  const handlePrint = () => {
    // console.log('Yazdırılıyor...', filteredGroups);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatus('Tümü');
    setPlugNoFilter('');
    setCreationDate(null);
  };

  const handleOpenDetails = (group: IPackageGroup) => {
    setSelectedGroup(group);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedGroup(null);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, m: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bekleyen Paketler
          </Typography>
          <Box>
            <ExportButton onClick={handleExport} sx={{ mr: 1 }} />
            <PrintButton onClick={handlePrint} sx={{ mr: 1 }} />
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/shipping/pending-packages/create')}>
              Yeni Paket Ekle
            </Button>
          </Box>
        </Box>

        <Accordion expanded={filtersOpen} onChange={() => setFiltersOpen(!filtersOpen)} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<FilterList />}>
            <Typography>Filtrele</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Plug No ile Ara"
                  value={plugNoFilter}
                  onChange={(e) => setPlugNoFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Alıcı Adı ile Ara"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={status}
                    label="Durum"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Tümü">Tümü</MenuItem>
                    <MenuItem value="Bekliyor">Bekliyor</MenuItem>
                    <MenuItem value="Gönderildi">Gönderildi</MenuItem>
                    <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Oluşturma Tarihi"
                  value={creationDate}
                  onChange={(newValue: Date | null) => setCreationDate(newValue)}
                  renderInput={(params: TextFieldProps) => <TextField {...params} size="small" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleClearFilters}>Filtreleri Temizle</Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Box mt={3}>
          {filteredGroups.map((group) => (
            <Paper key={group.id} sx={{ mb: 3, overflow: 'hidden', border: '1px solid #eee' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: '#f9f9f9',
                  borderBottom: '1px solid #eee',
                }}
              >
                <Checkbox />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                  Bekliyor : {group.summary.bekliyor} | Gönderildi : {group.summary.gonderildi}
                </Typography>
                <IconButton size="small">
                  <Visibility />
                </IconButton>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
                <Button size="small" sx={{ ml: 1 }} onClick={() => handleOpenDetails(group)}>Detay</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Plug No</TableCell>
                      <TableCell>Alıcı</TableCell>
                      <TableCell>Paket</TableCell>
                      <TableCell>Tip</TableCell>
                      <TableCell>Adet</TableCell>
                      <TableCell>Kilo</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>{pkg.plugNo}</TableCell>
                        <TableCell>{pkg.alici}</TableCell>
                        <TableCell>{pkg.paket}</TableCell>
                        <TableCell>{pkg.tip}</TableCell>
                        <TableCell>{pkg.adet}</TableCell>
                        <TableCell>{pkg.kilo}</TableCell>
                        <TableCell>{pkg.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </Box>
      </Paper>

      {selectedGroup && (
        <Dialog open={!!selectedGroup && detailsOpen} onClose={handleCloseDetails} fullWidth maxWidth="lg">
          <DialogTitle>Grup Detayları: {selectedGroup.packages[0]?.alici}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plug No</TableCell>
                    <TableCell>Alıcı</TableCell>
                    <TableCell>Satıcı</TableCell>
                    <TableCell>Paket</TableCell>
                    <TableCell>Tip</TableCell>
                    <TableCell>Adet</TableCell>
                    <TableCell>Kilo</TableCell>
                    <TableCell>Hacim</TableCell>
                    <TableCell>Fiyat</TableCell>
                    <TableCell>Şube Adı</TableCell>
                    <TableCell>Varış Yeri</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedGroup.packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.plugNo}</TableCell>
                      <TableCell>{pkg.alici}</TableCell>
                      <TableCell>{pkg.satici}</TableCell>
                      <TableCell>{pkg.paket}</TableCell>
                      <TableCell>{pkg.tip}</TableCell>
                      <TableCell>{pkg.adet}</TableCell>
                      <TableCell>{pkg.kilo}</TableCell>
                      <TableCell>{pkg.hacim}</TableCell>
                      <TableCell>{pkg.fiyat}</TableCell>
                      <TableCell>{pkg.subeAdi}</TableCell>
                      <TableCell>{pkg.varisYeri}</TableCell>
                      <TableCell>{pkg.created}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Kapat</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PendingPackagesList;
