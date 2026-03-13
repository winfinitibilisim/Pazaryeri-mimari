import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemButton,
    Box,
    Grid,
    Typography,
    Paper,
    Avatar,
    Chip
} from '@mui/material';
import {
    Close as CloseIcon,
    Class as ClassIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface CustomerGroupSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (groups: CustomerGroupItem[]) => void;
    initialSelected?: CustomerGroupItem[];
}

export interface CustomerGroupItem {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    discountRate: number; // Var olan genel indirim oranı
}

// Mock Customer Groups Data
const mockGroups: CustomerGroupItem[] = [
    { id: '1', name: 'VIP Müşteriler', description: 'Yüksek hacimli alışveriş yapan bireysel müşteriler', memberCount: 154, discountRate: 10 },
    { id: '2', name: 'Standart', description: 'Sisteme kayıtlı standart bireysel müşteriler', memberCount: 12500, discountRate: 0 },
    { id: '3', name: 'Potansiyel', description: 'Henüz alışveriş yapmamış ama sepetinde ürün olanlar', memberCount: 340, discountRate: 0 },
    { id: '4', name: 'Toptancı', description: 'Toplu alım yapan kurumsal firmalar', memberCount: 45, discountRate: 15 },
    { id: '5', name: 'Bayi', description: 'Resmi bayilik sözleşmesi olan kurumsal firmalar', memberCount: 28, discountRate: 20 },
    { id: '6', name: 'Sadık Müşteriler', description: 'Son 6 ayda en az 5 sipariş verenmüşteriler', memberCount: 890, discountRate: 5 },
    { id: '7', name: 'Personel', description: 'Şirket çalışanları indirim grubu', memberCount: 120, discountRate: 25 },
];

const CustomerGroupSelectionModal: React.FC<CustomerGroupSelectionModalProps> = ({ open, onClose, onSelect, initialSelected = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<CustomerGroupItem[]>(initialSelected);

    const handleGroupSelect = (group: CustomerGroupItem) => {
        setSelectedGroups(prev => {
            const isSelected = prev.find(p => p.id === group.id);
            if (isSelected) {
                return prev.filter(p => p.id !== group.id);
            } else {
                return [...prev, group];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedGroups.length === filteredGroups.length) {
            setSelectedGroups([]);
        } else {
            setSelectedGroups(filteredGroups);
        }
    };

    const handleSave = () => {
        onSelect(selectedGroups);
        onClose();
    };

    const handleRemoveSelected = (groupId: string) => {
        setSelectedGroups(prev => prev.filter(p => p.id !== groupId));
    };

    const filteredGroups = mockGroups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <ClassIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Müşteri Grubu Seçimi
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: '500px' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sol Sidebar - Grup Listesi */}
                    <Grid item xs={12} md={7} sx={{
                        borderRight: '1px solid #e0e0e0',
                        bgcolor: '#f8f9fa',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Grup adı veya açıklama ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam {filteredGroups.length} grup bulundu
                                </Typography>
                                <Button size="small" onClick={handleSelectAll}>
                                    {selectedGroups.length === filteredGroups.length && filteredGroups.length > 0 ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}
                                </Button>
                            </Box>
                        </Box>

                        <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                            {filteredGroups.map((group) => {
                                const isSelected = selectedGroups.some(p => p.id === group.id);
                                return (
                                    <ListItemButton
                                        key={group.id}
                                        onClick={() => handleGroupSelect(group)}
                                        sx={{
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: isSelected ? '#f3e5f5' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isSelected ? '#e1bee7' : '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {isSelected ? <CheckCircleIcon color="secondary" /> : <RadioButtonUncheckedIcon color="action" />}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#4a148c' }}>
                                                    {group.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {group.description}
                                                </Typography>
                                            }
                                        />
                                        <Box sx={{ textAlign: 'right', ml: 2 }}>
                                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                                <b>{group.memberCount}</b> Üye
                                            </Typography>
                                            {group.discountRate > 0 && (
                                                <Chip size="small" label={`%${group.discountRate} İndirimli`} color="secondary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                            )}
                                        </Box>
                                    </ListItemButton>
                                );
                            })}
                            {filteredGroups.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Arama kriterlerine uygun grup bulunamadı.</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Sağ İçerik Alanı - Seçilenler */}
                    <Grid item xs={12} md={5} sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <ClassIcon sx={{ color: '#7b1fa2', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#7b1fa2', fontWeight: 600 }}>
                                        Seçilen Gruplar
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedGroups.length} grup seçildi
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedGroups.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {selectedGroups.map((group) => (
                                        <Paper key={group.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: '#8e24aa' }}>
                                                    {group.name.substring(0, 2).toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                        {group.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {group.memberCount} Müşteri
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton size="small" color="error" onClick={() => handleRemoveSelected(group.id)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    ))}

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f3e5f5', borderRadius: 1, border: '1px solid #e1bee7' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası sağ tarafta listelenen <b>{selectedGroups.length}</b> gruptaki toplam <b>{selectedGroups.reduce((acc, curr) => acc + curr.memberCount, 0)}</b> müşteri için geçerli olacaktır.
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '250px',
                                    textAlign: 'center',
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Henüz grup seçilmedi.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                                        Sol taraftan kampanyanın geçerli olacağı müşteri gruplarını seçin.
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} color="error" variant="outlined">
                    İptal
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={selectedGroups.length === 0}
                    sx={{
                        bgcolor: '#7b1fa2',
                        '&:hover': {
                            bgcolor: '#4a148c'
                        }
                    }}
                >
                    Grupları Seç ({selectedGroups.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerGroupSelectionModal;
