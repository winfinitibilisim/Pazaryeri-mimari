import React, { useState, useRef } from 'react';
import {
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Box,
  Menu,
  MenuItem,
  Typography,
  TextField,
  Button,
  Tooltip,

} from '@mui/material';
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  InsertEmoticon as EmojiIcon,
  FormatColorText as ColorTextIcon,

  Code as CodeIcon,
  FormatQuote as QuoteIcon,

  ClearAll as ClearAllIcon
} from '@mui/icons-material';

// Emoji picker için basit bir emoji listesi
const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', 
                     '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', 
                     '👍', '👎', '👌', '✅', '❌', '📝', '📊', '📈', '📉', '🔍'];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Metninizi buraya yazın...',
  minRows = 6,
  maxRows = 12
}) => {
  // Referanslar
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State tanımlamaları
  const [imageMenuAnchor, setImageMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [linkMenuAnchor, setLinkMenuAnchor] = useState<null | HTMLElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [emojiMenuAnchor, setEmojiMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Seçili metni alma
  const saveSelection = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Seçili metni geri yükleme (kullanılmıyor)
  // const restoreSelection = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.focus();
  //     textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
  //   }
  // };

  // Seçili metne biçimlendirme uygulama
  const applyFormatting = (format: string, customValue: string = '') => {
    saveSelection();
    
    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = value.substring(start, end);
    let formattedText = '';
    let prefix = '';
    let suffix = '';
    
    switch(format) {
      case 'bold':
        prefix = '<strong>';
        suffix = '</strong>';
        break;
      case 'italic':
        prefix = '<em>';
        suffix = '</em>';
        break;
      case 'underline':
        prefix = '<u>';
        suffix = '</u>';
        break;
      case 'bullet-list':
        prefix = '<ul>\n  <li>';
        suffix = '</li>\n</ul>';
        break;
      case 'numbered-list':
        prefix = '<ol>\n  <li>';
        suffix = '</li>\n</ol>';
        break;
      case 'align-left':
        prefix = '<div style="text-align: left;">';
        suffix = '</div>';
        break;
      case 'align-center':
        prefix = '<div style="text-align: center;">';
        suffix = '</div>';
        break;
      case 'align-right':
        prefix = '<div style="text-align: right;">';
        suffix = '</div>';
        break;
      case 'code':
        prefix = '<code>';
        suffix = '</code>';
        break;
      case 'quote':
        prefix = '<blockquote>';
        suffix = '</blockquote>';
        break;
      case 'color':
        prefix = `<span style="color: ${selectedColor};">`;
        suffix = '</span>';
        break;
      case 'background-color':
        prefix = `<span style="background-color: ${selectedColor};">`;
        suffix = '</span>';
        break;
      case 'emoji':
        formattedText = customValue;
        break;
      case 'clear':
        // HTML etiketlerini temizle
        formattedText = selectedText.replace(/<[^>]*>/g, '');
        break;
      default:
        formattedText = selectedText;
    }
    
    if (format !== 'emoji' && format !== 'clear') {
      formattedText = prefix + selectedText + suffix;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Seçimi geri yükle
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = start + formattedText.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };
  
  // Resim yükleme fonksiyonu
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        const imageTag = `<img src="${imageUrl}" alt="Eklenen resim" style="max-width: 100%;" />`;
        
        // Seçili konuma resmi ekle
        const newValue = value.substring(0, selectionStart) + imageTag + value.substring(selectionEnd);
        onChange(newValue);
      };
      reader.readAsDataURL(file);
    }
    setImageMenuAnchor(null);
  };
  
  // Bağlantı ekleme fonksiyonu
  const handleAddLink = () => {
    if (linkUrl) {
      const linkDisplay = linkText || linkUrl;
      const linkTag = `<a href="${linkUrl}" target="_blank">${linkDisplay}</a>`;
      
      // Seçili konuma bağlantıyı ekle
      const newValue = value.substring(0, selectionStart) + linkTag + value.substring(selectionEnd);
      onChange(newValue);
      
      setLinkUrl('');
      setLinkText('');
      setLinkMenuAnchor(null);
    }
  };
  
  // Emoji ekleme fonksiyonu
  const handleAddEmoji = (emoji: string) => {
    applyFormatting('emoji', emoji);
    setEmojiMenuAnchor(null);
  };
  
  // Menü işlevleri
  const handleImageMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    saveSelection();
    setImageMenuAnchor(event.currentTarget);
  };
  
  const handleImageMenuClose = () => {
    setImageMenuAnchor(null);
  };
  
  const handleLinkMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    saveSelection();
    setLinkMenuAnchor(event.currentTarget);
  };
  
  const handleLinkMenuClose = () => {
    setLinkMenuAnchor(null);
  };
  
  const handleColorMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    saveSelection();
    setColorMenuAnchor(event.currentTarget);
  };
  
  const handleColorMenuClose = () => {
    setColorMenuAnchor(null);
  };
  
  const handleEmojiMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    saveSelection();
    setEmojiMenuAnchor(event.currentTarget);
  };
  
  const handleEmojiMenuClose = () => {
    setEmojiMenuAnchor(null);
  };

  return (
    <Paper variant="outlined" sx={{ mb: 2, width: '100%' }}>
      <Toolbar variant="dense" sx={{ borderBottom: '1px solid #eee', flexWrap: 'wrap', width: '100%' }}>
        {/* Temel Biçimlendirme */}
        <Tooltip title="Kalın">
          <IconButton size="small" onClick={() => applyFormatting('bold')}>
            <FormatBoldIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="İtalik">
          <IconButton size="small" onClick={() => applyFormatting('italic')}>
            <FormatItalicIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Altı Çizili">
          <IconButton size="small" onClick={() => applyFormatting('underline')}>
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Listeler */}
        <Tooltip title="Madde İşaretli Liste">
          <IconButton size="small" onClick={() => applyFormatting('bullet-list')}>
            <FormatListBulletedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numaralı Liste">
          <IconButton size="small" onClick={() => applyFormatting('numbered-list')}>
            <FormatListNumberedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Hizalama */}
        <Tooltip title="Sola Hizala">
          <IconButton size="small" onClick={() => applyFormatting('align-left')}>
            <FormatAlignLeftIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ortala">
          <IconButton size="small" onClick={() => applyFormatting('align-center')}>
            <FormatAlignCenterIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Sağa Hizala">
          <IconButton size="small" onClick={() => applyFormatting('align-right')}>
            <FormatAlignRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Medya Ekleme */}
        <Tooltip title="Resim Ekle">
          <IconButton size="small" onClick={handleImageMenuOpen}>
            <ImageIcon fontSize="small" sx={{ color: '#25638f' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bağlantı Ekle">
          <IconButton size="small" onClick={handleLinkMenuOpen}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Gelişmiş Biçimlendirme */}
        <Tooltip title="Emoji Ekle">
          <IconButton size="small" onClick={handleEmojiMenuOpen}>
            <EmojiIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Metin Rengi">
          <IconButton size="small" onClick={handleColorMenuOpen}>
            <ColorTextIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Özel Öğeler */}
        <Tooltip title="Kod Bloğu">
          <IconButton size="small" onClick={() => applyFormatting('code')}>
            <CodeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Alıntı">
          <IconButton size="small" onClick={() => applyFormatting('quote')}>
            <QuoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Biçimlendirmeyi Temizle">
          <IconButton size="small" onClick={() => applyFormatting('clear')}>
            <ClearAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      
      {/* Resim yükleme menüsü */}
      <Menu
        anchorEl={imageMenuAnchor}
        open={Boolean(imageMenuAnchor)}
        onClose={handleImageMenuClose}
      >
        <MenuItem>
          <label htmlFor="image-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <ImageIcon fontSize="small" sx={{ mr: 1 }} /> Bilgisayardan Yükle
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </label>
        </MenuItem>
      </Menu>
      
      {/* Bağlantı ekleme menüsü */}
      <Menu
        anchorEl={linkMenuAnchor}
        open={Boolean(linkMenuAnchor)}
        onClose={handleLinkMenuClose}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Bağlantı Ekle
          </Typography>
          <TextField
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            placeholder="https://example.com"
          />
          <TextField
            label="Gösterilecek Metin"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            placeholder="Bağlantı metni"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleLinkMenuClose} sx={{ mr: 1 }}>
              İptal
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAddLink}
              disabled={!linkUrl}
              sx={{ bgcolor: '#25638f', '&:hover': { bgcolor: '#1e5075' } }}
            >
              Ekle
            </Button>
          </Box>
        </Box>
      </Menu>
      
      {/* Renk seçme menüsü */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={handleColorMenuClose}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Metin Rengi Seç
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff5722', '#25638f'].map((color) => (
              <Box 
                key={color}
                sx={{ 
                  width: 30, 
                  height: 30, 
                  bgcolor: color,
                  cursor: 'pointer',
                  border: selectedColor === color ? '2px solid black' : '1px solid #ddd',
                  '&:hover': { opacity: 0.8 }
                }}
                onClick={() => {
                  setSelectedColor(color);
                  applyFormatting('color');
                  handleColorMenuClose();
                }}
              />
            ))}
          </Box>
          <TextField
            label="Özel Renk"
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            fullWidth
            margin="dense"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </Box>
      </Menu>
      
      {/* Emoji menüsü */}
      <Menu
        anchorEl={emojiMenuAnchor}
        open={Boolean(emojiMenuAnchor)}
        onClose={handleEmojiMenuClose}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Emoji Seç
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {commonEmojis.map((emoji) => (
              <Box 
                key={emoji}
                sx={{ 
                  width: 30, 
                  height: 30, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                }}
                onClick={() => handleAddEmoji(emoji)}
              >
                {emoji}
              </Box>
            ))}
          </Box>
        </Box>
      </Menu>
      
      {/* Seçilen resim önizlemesi */}
      {selectedImage && (
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Eklenen Resim:
          </Typography>
          <Box sx={{ maxWidth: '300px', maxHeight: '200px', overflow: 'hidden' }}>
            <img src={selectedImage} alt="Eklenen resim" style={{ maxWidth: '100%' }} />
          </Box>
        </Box>
      )}
      
      {/* Metin alanı */}
      <TextField
        multiline
        inputRef={textareaRef}
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        onClick={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        sx={{ width: '100%' }}
        InputProps={{
          sx: { borderRadius: 0, border: 'none', width: '100%' },
        }}
      />
    </Paper>
  );
};

export default RichTextEditor;
