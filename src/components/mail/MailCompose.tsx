import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Button,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Mail } from './types';

interface MailComposeProps {
  open: boolean;
  onClose: () => void;
  onSend: (mail: Partial<Mail>) => void;
  replyTo?: Mail | null;
  forwardFrom?: Mail | null;
  mode: 'compose' | 'reply' | 'forward';
}

const MailCompose: React.FC<MailComposeProps> = ({
  open,
  onClose,
  onSend,
  replyTo,
  forwardFrom,
  mode
}) => {
  // State tanımlamaları
  const [to, setTo] = useState<string>(
    mode === 'reply' && replyTo ? replyTo.from.email : ''
  );
  const [subject, setSubject] = useState<string>(
    mode === 'reply' && replyTo ? `Re: ${replyTo.subject}` :
    mode === 'forward' && forwardFrom ? `Fwd: ${forwardFrom.subject}` : ''
  );
  const [content, setContent] = useState<string>(
    mode === 'reply' && replyTo ? `\n\n-------- Orijinal İleti --------\nGönderen: ${replyTo.from.name} <${replyTo.from.email}>\nTarih: ${replyTo.date} ${replyTo.time}\nKonu: ${replyTo.subject}\n\n${replyTo.content}` :
    mode === 'forward' && forwardFrom ? `\n\n-------- İletilen İleti --------\nGönderen: ${forwardFrom.from.name} <${forwardFrom.from.email}>\nTarih: ${forwardFrom.date} ${forwardFrom.time}\nKonu: ${forwardFrom.subject}\n\n${forwardFrom.content}` : ''
  );
  const [attachments, setAttachments] = useState<{name: string, size: string}[]>(
    mode === 'forward' && forwardFrom ? forwardFrom.attachments.map(att => ({name: att.name, size: att.size})) : []
  );

  // E-posta gönderme işlevi
  const handleSend = () => {
    const newMail: Partial<Mail> = {
      to: [{ name: 'Alıcı', email: to }],
      subject,
      content,
      attachments: attachments.map(att => ({
        name: att.name,
        size: att.size,
        type: 'other',
        url: '#'
      }))
    };
    
    onSend(newMail);
    onClose();
    
    // Form alanlarını temizle
    setTo('');
    setSubject('');
    setContent('');
    setAttachments([]);
  };

  // Ek dosya ekleme işlevi
  const handleAttachmentAdd = () => {
    // Gerçek uygulamada dosya seçme işlemi burada yapılır
    const newAttachment = {
      name: `dosya_${attachments.length + 1}.pdf`,
      size: '1.2 MB'
    };
    setAttachments([...attachments, newAttachment]);
  };

  // Ek dosya silme işlevi
  const handleAttachmentRemove = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Dialog başlığını belirleme
  const getDialogTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Yanıtla';
      case 'forward':
        return 'İlet';
      default:
        return 'Yeni İleti';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          height: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon fontSize="small" sx={{ color: '#25638f' }} />
            {getDialogTitle()}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Kime"
            variant="outlined"
            size="small"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="ornek@mail.com"
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Konu"
            variant="outlined"
            size="small"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E-posta konusu"
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            placeholder="İletinizi buraya yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ height: '100%' }}
            InputProps={{
              sx: { 
                height: '100%', 
                alignItems: 'flex-start',
                borderRadius: 1,
                p: 1
              }
            }}
            minRows={12}
          />
        </Box>
        
        {attachments.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((attachment, index) => (
              <Chip
                key={index}
                label={`${attachment.name} (${attachment.size})`}
                onDelete={() => handleAttachmentRemove(index)}
                deleteIcon={<DeleteIcon />}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="outlined"
          startIcon={<AttachFileIcon />}
          onClick={handleAttachmentAdd}
          sx={{
            borderRadius: 28,
            textTransform: 'none',
            px: 2
          }}
        >
          Dosya Ekle
        </Button>
        
        <Box>
          <Button 
            onClick={onClose} 
            sx={{ mr: 1 }}
          >
            İptal
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!to || !subject}
            sx={{
              bgcolor: '#25638f',
              '&:hover': { bgcolor: '#1e5172' },
              borderRadius: 28,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Gönder
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MailCompose;
