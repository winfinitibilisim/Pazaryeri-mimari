import React from 'react';
import { 
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  Badge 
} from '@mui/material';
import {
  Add as AddIcon,
  Inbox as InboxIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Delete as TrashIcon,
  Report as ReportIcon,
  Archive as ArchiveIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { Folder, Label, MailFolder } from './types';

interface MailSidebarProps {
  folders: Folder[];
  labels: Label[];
  currentFolder: MailFolder;
  onFolderChange: (folderId: MailFolder) => void;
  onComposeClick: () => void;
}

const MailSidebar: React.FC<MailSidebarProps> = ({
  folders,
  labels,
  currentFolder,
  onFolderChange,
  onComposeClick
}) => {
  // Klasör ikonlarını belirleme fonksiyonu
  const getFolderIcon = (folderId: string) => {
    switch (folderId) {
      case 'inbox':
        return <InboxIcon />;
      case 'sent':
        return <SendIcon />;
      case 'draft':
        return <DraftsIcon />;
      case 'trash':
        return <TrashIcon />;
      case 'spam':
        return <ReportIcon />;
      case 'archive':
        return <ArchiveIcon />;
      default:
        return <InboxIcon />;
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: '1px solid #e0e0e0',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={onComposeClick}
          sx={{
            backgroundColor: '#25638f',
            '&:hover': {
              backgroundColor: '#1e5172',
            },
            borderRadius: '28px',
            textTransform: 'none',
            py: 1.2,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}
        >
          Yeni İleti
        </Button>
      </Box>
      
      <List>
        {folders.map((folder) => (
          <ListItem key={folder.id} disablePadding>
            <ListItemButton
              selected={currentFolder === folder.id}
              onClick={() => onFolderChange(folder.id)}
              sx={{
                backgroundColor: currentFolder === folder.id ? 'rgba(37, 99, 143, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 143, 0.04)',
                },
                borderRadius: '0 16px 16px 0',
                mx: 1,
                py: 1.2,
                transition: 'all 0.2s ease',
                borderLeft: currentFolder === folder.id ? '3px solid #25638f' : 'none',
                pl: currentFolder === folder.id ? 1 : 2
              }}
            >
              <ListItemIcon>
                <Badge 
                  badgeContent={folder.count > 0 ? folder.count : null} 
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontWeight: 'bold', fontSize: '0.7rem' } }}
                >
                  {getFolderIcon(folder.id)}
                </Badge>
              </ListItemIcon>
              <ListItemText 
                primary={folder.name} 
                primaryTypographyProps={{
                  fontWeight: currentFolder === folder.id ? 600 : 400,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" sx={{ px: 3, mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LabelIcon fontSize="small" sx={{ color: '#25638f' }} />
        Etiketler
      </Typography>
      
      <List>
        {labels.map((label) => (
          <ListItem key={label.id} disablePadding>
            <ListItemButton
              sx={{
                borderRadius: '0 16px 16px 0',
                mx: 1,
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon>
                <LabelIcon sx={{ color: label.color }} />
              </ListItemIcon>
              <ListItemText primary={label.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MailSidebar;
