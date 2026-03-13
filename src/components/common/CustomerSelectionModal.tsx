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
    Avatar
} from '@mui/material';
import {
    Close as CloseIcon,
    Groups as GroupsIcon,
    Search as SearchIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';

interface CustomerSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (customers: CustomerItem[]) => void;
    initialSelected?: CustomerItem[];
}

export interface CustomerItem {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    group: string;
    avatar?: string;
}

// Mock Customers Data (Simplified version of what might be in CustomersPage)
const mockCustomers: CustomerItem[] = [
    { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet.yilmaz@example.com', phone: '+90 532 123 4567', type: 'Bireysel', group: 'VIP Müşteriler', avatar: 'A' },
    { id: '2', name: 'Ayşe Demir', email: 'ayse.demir@example.com', phone: '+90 533 987 6543', type: 'Bireysel', group: 'Standart', avatar: 'A' },
    { id: '3', name: 'Mehmet Kaya', email: 'mehmet.kaya@example.com', phone: '+90 544 111 2233', type: 'Bireysel', group: 'Potansiyel', avatar: 'M' },
    { id: '4', name: 'XYZ Bilişim Ltd. Şti.', email: 'info@xyzbilisim.com', phone: '+90 212 555 4433', type: 'Kurumsal', group: 'Toptancı', avatar: 'X' },
    { id: '5', name: 'Zeynep Çelik', email: 'zeynep.celik@example.com', phone: '+90 535 777 8899', type: 'Bireysel', group: 'VIP Müşteriler', avatar: 'Z' },
    { id: '6', name: 'ABC Tekstil A.Ş.', email: 'satis@abctekstil.com.tr', phone: '+90 216 333 2211', type: 'Kurumsal', group: 'Bayi', avatar: 'A' },
    { id: '7', name: 'Can Özkan', email: 'can.ozkan@example.com', phone: '+90 530 444 5566', type: 'Bireysel', group: 'Standart', avatar: 'C' },
    { id: '8', name: 'Elif Şahin', email: 'elif.sahin@example.com', phone: '+90 542 999 8877', type: 'Bireysel', group: 'Sadık Müşteriler', avatar: 'E' },
    { id: '9', name: 'Mega Market A.Ş.', email: 'satin_alma@megamarket.com', phone: '+90 212 999 0000', type: 'Kurumsal', group: 'Bayi', avatar: 'M' },
    { id: '10', name: 'Burak Arslan', email: 'burak.arslan@example.com', phone: '+90 555 123 0987', type: 'Bireysel', group: 'Standart', avatar: 'B' },
];

const CustomerSelectionModal: React.FC<CustomerSelectionModalProps> = ({ open, onClose, onSelect, initialSelected = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState<CustomerItem[]>(initialSelected);

    const handleCustomerSelect = (customer: CustomerItem) => {
        setSelectedCustomers(prev => {
            const isSelected = prev.find(p => p.id === customer.id);
            if (isSelected) {
                return prev.filter(p => p.id !== customer.id);
            } else {
                return [...prev, customer];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCustomers.length === filteredCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(filteredCustomers);
        }
    };

    const handleSave = () => {
        onSelect(selectedCustomers);
        onClose();
    };

    const handleRemoveSelected = (customerId: string) => {
        setSelectedCustomers(prev => prev.filter(p => p.id !== customerId));
    };

    const filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <GroupsIcon />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Müşteri Seçimi
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, height: '600px' }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Sol Sidebar - Müşteri Listesi */}
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
                                placeholder="Müşteri adı, e-posta, telefon veya grup ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Toplam {filteredCustomers.length} müşteri bulundu
                                </Typography>
                                <Button size="small" onClick={handleSelectAll}>
                                    {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? 'Tüm Seçimleri Kaldır' : 'Tümünü Seç'}
                                </Button>
                            </Box>
                        </Box>

                        <List dense sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                            {filteredCustomers.map((customer) => {
                                const isSelected = selectedCustomers.some(p => p.id === customer.id);
                                return (
                                    <ListItemButton
                                        key={customer.id}
                                        onClick={() => handleCustomerSelect(customer)}
                                        sx={{
                                            borderBottom: '1px solid #f0f0f0',
                                            bgcolor: isSelected ? '#e3f2fd' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isSelected ? '#bbdefb' : '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {isSelected ? <CheckCircleIcon color="primary" /> : <RadioButtonUncheckedIcon color="action" />}
                                        </ListItemIcon>
                                        <ListItemIcon sx={{ minWidth: 50 }}>
                                            <Avatar sx={{ bgcolor: customer.type === 'Kurumsal' ? '#ed6c02' : '#1976d2', width: 40, height: 40 }}>
                                                {customer.avatar || customer.name.charAt(0)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {customer.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" component="span">
                                                    {customer.email} | {customer.phone}
                                                </Typography>
                                            }
                                        />
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                                                {customer.type}
                                            </Typography>
                                            <Typography variant="caption" sx={{ bgcolor: '#e0e0e0', px: 1, borderRadius: 1 }}>
                                                {customer.group}
                                            </Typography>
                                        </Box>
                                    </ListItemButton>
                                );
                            })}
                            {filteredCustomers.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">Arama kriterlerine uygun müşteri bulunamadı.</Typography>
                                </Box>
                            )}
                        </List>
                    </Grid>

                    {/* Sağ İçerik Alanı - Seçilenler */}
                    <Grid item xs={12} md={5} sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <GroupsIcon sx={{ color: '#1565c0', fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 600 }}>
                                        Seçilen Müşteriler
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedCustomers.length} müşteri seçildi
                                    </Typography>
                                </Box>
                            </Box>

                            {selectedCustomers.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {selectedCustomers.map((customer) => (
                                        <Paper key={customer.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '1rem', bgcolor: customer.type === 'Kurumsal' ? '#ed6c02' : '#1976d2' }}>
                                                    {customer.avatar || customer.name.charAt(0)}
                                                </Avatar>
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                        {customer.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {customer.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton size="small" color="error" onClick={() => handleRemoveSelected(customer.id)}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    ))}

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Not:</strong> İndirim kampanyası yalnızca sağ tarafta listelenen <b>{selectedCustomers.length}</b> müşteriye tanımlanacaktır (Kişiye/Kuruma Özel İndirim).
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '300px',
                                    textAlign: 'center',
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Henüz müşteri seçilmedi.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                                        Sol taraftaki listeden indirim tanımlamak istediğiniz müşterileri seçebilirsiniz.
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
                    disabled={selectedCustomers.length === 0}
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': {
                            bgcolor: '#1565c0'
                        }
                    }}
                >
                    Müşterileri Seç ({selectedCustomers.length})
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerSelectionModal;
