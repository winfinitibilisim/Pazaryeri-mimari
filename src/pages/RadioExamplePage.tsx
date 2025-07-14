import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Grid
} from '@mui/material';
import { pink, green, blue, orange } from '@mui/material/colors';
import CustomRadio, { RadioOption } from '../components/common/CustomRadio';

const RadioExamplePage: React.FC = () => {
  // Example 1: Basic radio options
  const [basicValue, setBasicValue] = useState('a');
  const basicOptions: RadioOption[] = [
    { value: 'a', label: 'Seçenek A', color: 'primary' },
    { value: 'b', label: 'Seçenek B', color: 'secondary' },
    { value: 'c', label: 'Seçenek C', color: 'success' },
    { value: 'd', label: 'Seçenek D', color: 'default' },
    { 
      value: 'e', 
      label: 'Seçenek E', 
      color: 'custom',
      customColor: {
        default: pink[800],
        checked: pink[600]
      }
    }
  ];

  // Example 2: Vertical radio options
  const [verticalValue, setVerticalValue] = useState('yes');
  const verticalOptions: RadioOption[] = [
    { value: 'yes', label: 'Evet', color: 'success' },
    { value: 'no', label: 'Hayır', color: 'secondary' },
    { value: 'maybe', label: 'Belki', color: 'primary' }
  ];

  // Example 3: Radio options with disabled items
  const [disabledValue, setDisabledValue] = useState('available');
  const disabledOptions: RadioOption[] = [
    { value: 'available', label: 'Mevcut', color: 'success' },
    { value: 'unavailable', label: 'Mevcut Değil', color: 'secondary', disabled: true },
    { value: 'limited', label: 'Sınırlı', color: 'primary' }
  ];

  // Example 4: Custom colored radio options
  const [colorValue, setColorValue] = useState('red');
  const colorOptions: RadioOption[] = [
    { 
      value: 'red', 
      label: 'Kırmızı', 
      color: 'custom',
      customColor: {
        default: pink[300],
        checked: pink[700]
      }
    },
    { 
      value: 'green', 
      label: 'Yeşil', 
      color: 'custom',
      customColor: {
        default: green[300],
        checked: green[700]
      }
    },
    { 
      value: 'blue', 
      label: 'Mavi', 
      color: 'custom',
      customColor: {
        default: blue[300],
        checked: blue[700]
      }
    },
    { 
      value: 'orange', 
      label: 'Turuncu', 
      color: 'custom',
      customColor: {
        default: orange[300],
        checked: orange[700]
      }
    }
  ];

  // Example 5: Radio with error state
  const [errorValue, setErrorValue] = useState('');
  const errorOptions: RadioOption[] = [
    { value: 'option1', label: 'Seçenek 1', color: 'primary' },
    { value: 'option2', label: 'Seçenek 2', color: 'primary' },
    { value: 'option3', label: 'Seçenek 3', color: 'primary' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'medium', color: '#333' }}>
          Merkezileştirilmiş Radio Button Örnekleri
        </Typography>
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#555' }}>
            1. Temel Radio Button Örneği (Yatay)
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CustomRadio
              options={basicOptions}
              name="basic-radio-example"
              label="Lütfen bir seçenek seçin"
              value={basicValue}
              onChange={setBasicValue}
              row={true}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Seçilen değer: <strong>{basicValue}</strong>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Example 2: Vertical */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#555' }}>
            2. Dikey Radio Button Örneği
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CustomRadio
              options={verticalOptions}
              name="vertical-radio-example"
              label="Onaylıyor musunuz?"
              value={verticalValue}
              onChange={setVerticalValue}
              row={false}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Seçilen değer: <strong>{verticalValue}</strong>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Example 3: Disabled */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#555' }}>
            3. Devre Dışı Bırakılmış Seçenekler
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CustomRadio
              options={disabledOptions}
              name="disabled-radio-example"
              label="Stok durumu"
              value={disabledValue}
              onChange={setDisabledValue}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Seçilen değer: <strong>{disabledValue}</strong>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Example 4: Custom Colors */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#555' }}>
            4. Özel Renkli Seçenekler
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CustomRadio
              options={colorOptions}
              name="color-radio-example"
              label="Favori renginiz"
              value={colorValue}
              onChange={setColorValue}
              row
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Seçilen değer: <strong>{colorValue}</strong>
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Example 5: Error State */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#555' }}>
            5. Hata Durumu ve Yardımcı Metin
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CustomRadio
              options={errorOptions}
              name="error-radio-example"
              label="Zorunlu Alan"
              value={errorValue}
              onChange={setErrorValue}
              error={!errorValue}
              helperText={!errorValue ? "Lütfen bir seçim yapın." : "Teşekkürler!"}
              required
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Seçilen değer: <strong>{errorValue || 'yok'}</strong>
            </Typography>
          </Paper>
        </Box>
        
        <Divider sx={{ my: 4 }} />

        {/* Component Features */}
        <Box sx={{ mt: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
          <Typography variant="h6" gutterBottom>Bileşen Özellikleri</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Desteklenen Özellikler:</Typography>
              <ul>
                <li>Önceden tanımlı veya özel renkler</li>
                <li>Devre dışı seçenekler</li>
                <li>Hata durumu ve yardımcı metin</li>
                <li>Zorunlu alan desteği</li>
                <li>Yatay veya dikey hizalama</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Kullanılabilir Renkler:</Typography>
              <ul>
                <li><strong>primary</strong> - Tema birincil rengi</li>
                <li><strong>secondary</strong> - Tema ikincil rengi</li>
                <li><strong>success</strong> - Başarı rengi (yeşil)</li>
                <li><strong>default</strong> - Varsayılan renk</li>
                <li><strong>custom</strong> - Özel `customColor` prop'u ile tanımlanır</li>
              </ul>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RadioExamplePage;
