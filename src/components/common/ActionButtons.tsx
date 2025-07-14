import React, { useState } from 'react';
import { 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  confirmDelete?: boolean;
  confirmMessage?: string;
  size?: 'small' | 'medium';
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  confirmDelete = true,
  confirmMessage = 'Bu öğeyi silmek istediğinizden emin misiniz?',
  size = 'small'
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirmDelete) {
      setOpenDialog(true);
    } else {
      onDelete();
    }
  };

  const handleConfirmDelete = () => {
    setOpenDialog(false);
    onDelete();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Düzenle">
        <span>
          <IconButton 
            aria-label="düzenle" 
            size={size} 
            onClick={handleEditClick} 
            disabled={disableEdit}
            color="primary"
            sx={{ mr: 0.5 }}
          >
            <EditIcon fontSize={size} />
          </IconButton>
        </span>
      </Tooltip>
      
      <Tooltip title="Sil">
        <span>
          <IconButton 
            aria-label="sil" 
            size={size} 
            onClick={handleDeleteClick} 
            disabled={disableDelete}
            color="error"
          >
            <DeleteIcon fontSize={size} />
          </IconButton>
        </span>
      </Tooltip>

      {confirmDelete && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Silme İşlemi
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirmMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              İptal
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Sil
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ActionButtons;
