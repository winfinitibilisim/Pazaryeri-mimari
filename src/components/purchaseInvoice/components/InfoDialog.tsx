import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme
} from '@mui/material';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose, message }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '1rem', sm: '1.25rem' },
        fontWeight: 'medium',
        color: theme.palette.primary.main
      }}>
        {t('information')}
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          py: 1,
          color: theme.palette.text.primary
        }}>
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            '&:hover': {
              borderColor: theme.palette.text.secondary,
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
