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

interface AddMoneyOutModalProps {
  open: boolean;
  onClose: () => void;
  safeId: string | undefined;
}

const AddMoneyOutModal: React.FC<AddMoneyOutModalProps> = ({ open, onClose, safeId }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      safeId,
      amount,
      exitDate,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('safes.addMoneyOut')}</DialogTitle>
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
              label={t('safes.exitDate')}
              type="date"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
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

export default AddMoneyOutModal;
