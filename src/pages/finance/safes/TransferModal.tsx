import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Mock data for safes - replace with actual data fetching
const mockSafes = [
  { id: 1, name: 'Merkez Kasa', currency: 'TRY' },
  { id: 2, name: 'Banka Hesabı', currency: 'USD' },
  { id: 3, name: 'Döviz Kasası', currency: 'EUR' },
];

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  senderSafeId: string | undefined;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onClose, senderSafeId }) => {
  const { t } = useTranslation();
  const [receiverSafeId, setReceiverSafeId] = useState('');
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const senderSafe = mockSafes.find(safe => safe.id === Number(senderSafeId));

  const handleSave = () => {
    // TODO: Implement save logic
    console.log({
      senderSafeId,
      receiverSafeId,
      amount,
      transferDate,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('safes.makeTransfer')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label={t('safes.senderSafe')}
              value={senderSafe ? `${senderSafe.name} (${senderSafe.currency})` : ''}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t('safes.receiverSafe')}</InputLabel>
              <Select
                value={receiverSafeId}
                label={t('safes.receiverSafe')}
                onChange={(e) => setReceiverSafeId(e.target.value)}
              >
                <MenuItem value="">
                  <em>{t('safes.selectSafe')}</em>
                </MenuItem>
                {mockSafes
                  .filter(safe => safe.id !== Number(senderSafeId))
                  .map((safe) => (
                    <MenuItem key={safe.id} value={safe.id}>
                      {safe.name} ({safe.currency})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
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
              label={t('safes.transferDate')}
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
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

export default TransferModal;
