import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  Box, 
  Checkbox, 
  IconButton, 
  Avatar, 
  Typography, 
  Badge 
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachFile as AttachFileIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { Mail } from './types';

interface MailListProps {
  mails: Mail[];
  selectedMailIds: string[];
  onMailSelect: (mail: Mail) => void;
  onMailCheckboxChange: (mailId: string) => void;
  onStarMail: (mailId: string) => void;
}

const MailList: React.FC<MailListProps> = ({
  mails,
  selectedMailIds,
  onMailSelect,
  onMailCheckboxChange,
  onStarMail
}) => {
  return (
    <List disablePadding>
      {mails.length > 0 ? (
        mails.map((mail) => (
          <ListItem
            key={mail.id}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {mail.attachments.length > 0 && (
                  <AttachFileIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                )}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontWeight: mail.isRead ? 'normal' : 'medium',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {mail.date.split(' ')[0]} {mail.time}
                </Typography>
              </Box>
            }
            sx={{
              backgroundColor: mail.isRead ? 'transparent' : 'rgba(37, 99, 143, 0.08)',
              borderLeft: mail.isRead ? 'none' : '3px solid #25638f',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Checkbox
                checked={selectedMailIds.includes(mail.id)}
                onChange={() => onMailCheckboxChange(mail.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <IconButton onClick={() => onStarMail(mail.id)}>
                {mail.isStarred ? (
                  <StarIcon sx={{ color: '#f9a825' }} />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
              <ListItemButton onClick={() => onMailSelect(mail)}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar
                    src={mail.from.avatar}
                    alt={mail.from.name}
                    sx={{ mr: 2 }}
                  >
                    {mail.from.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={{
                          fontWeight: mail.isRead ? 400 : 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mr: 1,
                        }}
                      >
                        {mail.from.name}
                      </Typography>
                      {mail.labels.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {mail.labels.map((label) => (
                            <LabelIcon
                              key={label}
                              fontSize="small"
                              sx={{
                                color: label === 'work' ? '#4caf50' :
                                       label === 'personal' ? '#2196f3' :
                                       label === 'social' ? '#ff9800' :
                                       label === 'important' ? '#f44336' :
                                       label === 'promotions' ? '#9c27b0' : 'inherit'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: mail.isRead ? 400 : 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mail.subject}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mail.content}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            </Box>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 4
            }}>
              <Box 
                component="img" 
                src="/images/empty-mail.png" 
                alt="Boş Mail Kutusu"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  opacity: 0.6, 
                  mb: 2,
                  filter: 'grayscale(1)'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Bu klasörde e-posta bulunmuyor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Başka bir klasör seçin veya yeni bir e-posta gönderin
              </Typography>
            </Box>
          </Box>
        </ListItem>
      )}
    </List>
  );
};

export default MailList;
