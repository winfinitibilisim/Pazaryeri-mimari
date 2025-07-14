import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Divider, 
  Paper, 
  Chip,
  Tooltip,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Label as LabelIcon,
  AttachFile as AttachFileIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { Mail } from './types';

interface MailDetailProps {
  mail: Mail | null;
  onClose: () => void;
  onReply: () => void;
  onForward: () => void;
  onDelete: () => void;
  onStar: (mailId: string) => void;
}

const MailDetail: React.FC<MailDetailProps> = ({
  mail,
  onClose,
  onReply,
  onForward,
  onDelete,
  onStar
}) => {
  if (!mail) return null;

  // Ek dosya ikonu belirleme fonksiyonu
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'pdf':
        return <PdfIcon />;
      default:
        return <FileIcon />;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderLeft: '1px solid #e0e0e0',
      }}
    >
      {/* Üst Araç Çubuğu */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f9f9f9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Yanıtla">
            <IconButton onClick={onReply}>
              <ReplyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hepsini Yanıtla">
            <IconButton>
              <ReplyAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="İlet">
            <IconButton onClick={onForward}>
              <ForwardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Yazdır">
            <IconButton>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Kapat">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* E-posta İçeriği */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: '#ffffff' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {mail.subject}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={mail.from.avatar}
              alt={mail.from.name}
              sx={{ width: 40, height: 40, mr: 2 }}
            >
              {mail.from.name.charAt(0)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {mail.from.name}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => onStar(mail.id)}
                  sx={{ ml: 1 }}
                >
                  {mail.isStarred ? (
                    <StarIcon fontSize="small" sx={{ color: '#f9a825' }} />
                  ) : (
                    <StarBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                {mail.from.email}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {mail.date} {mail.time}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Kime:
            </Typography>
            {mail.to.map((recipient, index) => (
              <Typography key={index} variant="body2">
                {recipient.name} {index < mail.to.length - 1 ? ', ' : ''}
              </Typography>
            ))}
          </Box>
          
          {mail.labels.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {mail.labels.map((label) => (
                <Chip
                  key={label}
                  icon={<LabelIcon />}
                  label={
                    label === 'work' ? 'İş' :
                    label === 'personal' ? 'Kişisel' :
                    label === 'social' ? 'Sosyal' :
                    label === 'important' ? 'Önemli' :
                    label === 'promotions' ? 'Promosyonlar' : label
                  }
                  size="small"
                  sx={{
                    bgcolor: 
                      label === 'work' ? 'rgba(76, 175, 80, 0.1)' :
                      label === 'personal' ? 'rgba(33, 150, 243, 0.1)' :
                      label === 'social' ? 'rgba(255, 152, 0, 0.1)' :
                      label === 'important' ? 'rgba(244, 67, 54, 0.1)' :
                      label === 'promotions' ? 'rgba(156, 39, 176, 0.1)' : 'inherit',
                    color: 
                      label === 'work' ? '#4caf50' :
                      label === 'personal' ? '#2196f3' :
                      label === 'social' ? '#ff9800' :
                      label === 'important' ? '#f44336' :
                      label === 'promotions' ? '#9c27b0' : 'inherit',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f9f9f9', border: '1px solid #eee' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {mail.content}
          </Typography>
        </Paper>
        
        {mail.attachments.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon fontSize="small" />
              Ekler ({mail.attachments.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {mail.attachments.map((attachment, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    width: 220,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderColor: '#bdbdbd'
                    },
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ 
                    mr: 2, 
                    bgcolor: 
                      attachment.type === 'image' ? 'rgba(33, 150, 243, 0.1)' :
                      attachment.type === 'document' ? 'rgba(76, 175, 80, 0.1)' :
                      attachment.type === 'pdf' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getAttachmentIcon(attachment.type)}
                  </Box>
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 500
                      }}
                    >
                      {attachment.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {attachment.size}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Alt Araç Çubuğu */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 1,
          bgcolor: '#f9f9f9',
        }}
      >
        <Button
          variant="contained"
          startIcon={<ReplyIcon />}
          onClick={onReply}
          sx={{
            bgcolor: '#25638f',
            '&:hover': { bgcolor: '#1e5172' },
          }}
        >
          Yanıtla
        </Button>
        <Button
          variant="outlined"
          startIcon={<ForwardIcon />}
          onClick={onForward}
        >
          İlet
        </Button>
      </Box>
    </Box>
  );
};

export default MailDetail;
