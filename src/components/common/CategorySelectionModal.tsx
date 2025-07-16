import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemButton
} from '@mui/material';
import { Folder as FolderIcon, Close as CloseIcon } from '@mui/icons-material';

interface CategorySelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

const categories = [
  'Kadın Giyim',
  'Erkek Giyim',
  'Anne, Çocuk & Oyuncak',
  'Bahçe Ev & Mobilya',
  'Kozmetik',
  'Ayakkabı & Çanta',
  'SAAT & AKSESUAR',
  'ELEKTRONİK',
  'Oto Araç Parçaları',
];

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedCategory) {
      onSelect(selectedCategory);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Kategori Seç
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Arama yap"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
        />
        <List>
          {filteredCategories.map((category) => (
            <ListItemButton
              key={category}
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={category} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSelect} variant="contained" disabled={!selectedCategory}>
          Seç
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategorySelectionModal;
