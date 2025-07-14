import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Help: React.FC = () => {
  const navigate = useNavigate();

  const handleAccordionClick = (topic: string) => {
    navigate(`/help/${topic}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Size nasıl yardımcı olabiliriz?
      </Typography>
      <TextField
        fullWidth
        placeholder="Sorununuzu açıklayın"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />
      <Typography variant="h6" gutterBottom>
        Yardım konularına göz at
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ürünler</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button onClick={() => handleAccordionClick('products-variants')}>
              <ListItemText primary="Varyanlar" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('products-options')}>
              <ListItemText primary="Ürün Seçenekleri" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('products-category')}>
              <ListItemText primary="Kategori" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('products-brand')}>
              <ListItemText primary="Marka" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('products-features')}>
              <ListItemText primary="Ürün Özellikleri" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('products-class')}>
              <ListItemText primary="Ürün Sınıfları" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Satışlar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button onClick={() => handleAccordionClick('sales-promotions')}>
              <ListItemText primary="Promosyonlar" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Raporlar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button onClick={() => handleAccordionClick('reports-xml')}>
              <ListItemText primary="Süper xml Aktar" />
            </ListItem>
            <ListItem button onClick={() => handleAccordionClick('reports-erp-crm')}>
              <ListItemText primary="ERP/CRM" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Ayarlar</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem button onClick={() => handleAccordionClick('settings-general')}>
              <ListItemText primary="Genel Ayarlar" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      {/* Add more accordions as needed */}
    </Box>
  );
};

export default Help; 