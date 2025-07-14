import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AddMoneyInModalProps {
  open: boolean;
  onClose: () => void;
  safeId: string | undefined;
}

const AddMoneyInModal: React.FC<AddMoneyInModalProps> = ({ open, onClose, safeId }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      safeId,
      amount,
      entryDate,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('safes.addMoneyIn')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label={t('common.amount')}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('safes.entryDate')}
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('common.description')}
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSave} variant="contained">{t('common.save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMoneyInModal;
