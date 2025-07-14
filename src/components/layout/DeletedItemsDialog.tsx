import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItem, 
  Typography, 
  Box 
} from '@mui/material';

interface DeletedItem {
  id: number;
  name: string;
  type: string;
  deletedAt: string;
}

interface DeletedItemsDialogProps {
  open: boolean;
  onClose: () => void;
  handleRestore: (id: number) => void;
}

const DeletedItemsDialog: React.FC<DeletedItemsDialogProps> = ({
  open,
  onClose,
  handleRestore
}) => {
  // Sample deleted items - in a real application, these would come from an API
    const { t } = useLanguage();

  // Sample deleted items - in a real application, these would come from an API
  const sampleDeletedItems: DeletedItem[] = [
    { id: 1, name: 'Ürün A', type: 'Product', deletedAt: '2023-10-01' },
    { id: 2, name: 'Müşteri B', type: 'Customer', deletedAt: '2023-10-02' },
    { id: 3, name: 'Sipariş C', type: 'Order', deletedAt: '2023-10-03' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2
        }
      }}
    >
            <DialogTitle>{t('deletedItems.title')}</DialogTitle>
      <DialogContent>
        {sampleDeletedItems.length > 0 ? (
          <List>
            {sampleDeletedItems.map(item => (
              <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.type} - {t('deletedItems.deletedDate')}: {item.deletedAt}</Typography>
                </Box>
                                <Button variant="outlined" onClick={() => handleRestore(item.id)}>
                  {t('deletedItems.restore')}
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
                    <Typography>{t('deletedItems.noItemsFound')}</Typography>
        )}
      </DialogContent>
      <DialogActions>
                <Button onClick={onClose} color="primary">
          {t('general.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletedItemsDialog; 