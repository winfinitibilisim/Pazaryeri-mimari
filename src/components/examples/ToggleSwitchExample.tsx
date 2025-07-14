import React, { useState } from 'react';
import { Box, Typography, Divider, Grid, Card, CardContent } from '@mui/material';
import ToggleSwitch from '../common/ToggleSwitch';

const ToggleSwitchExample: React.FC = () => {
  const [isActive1, setIsActive1] = useState(true);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(true);
  const [isActive4, setIsActive4] = useState(false);
  const [isActive5, setIsActive5] = useState(true);
  const [isActive6, setIsActive6] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Aktif/Pasif Toggle Buton Örnekleri
      </Typography>

      <Grid container spacing={3}>
        {/* Temel Kullanım */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Temel Kullanım
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <ToggleSwitch
                  checked={isActive1}
                  onChange={setIsActive1}
                  label="Durum"
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Şu anki değer: {isActive1 ? 'Aktif' : 'Pasif'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <ToggleSwitch
                  checked={isActive2}
                  onChange={setIsActive2}
                  label="Ürün Görünürlüğü"
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Şu anki değer: {isActive2 ? 'Aktif' : 'Pasif'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Etiketli Kullanım */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Etiketli Kullanım
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <ToggleSwitch
                  checked={isActive3}
                  onChange={setIsActive3}
                  label="Stok Durumu"
                  activeLabel="Stokta Var"
                  inactiveLabel="Stokta Yok"
                  showLabels
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Şu anki değer: {isActive3 ? 'Stokta Var' : 'Stokta Yok'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <ToggleSwitch
                  checked={isActive4}
                  onChange={setIsActive4}
                  label="Üyelik Durumu"
                  activeLabel="Onaylandı"
                  inactiveLabel="Beklemede"
                  showLabels
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Şu anki değer: {isActive4 ? 'Onaylandı' : 'Beklemede'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Farklı Boyutlar ve Devre Dışı Durumu */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Farklı Boyutlar ve Devre Dışı Durumu
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ mb: 3 }}>
                    <ToggleSwitch
                      checked={isActive5}
                      onChange={setIsActive5}
                      label="Normal Boyut"
                      size="medium"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ mb: 3 }}>
                    <ToggleSwitch
                      checked={isActive6}
                      onChange={setIsActive6}
                      label="Küçük Boyut"
                      size="small"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ mb: 3 }}>
                    <ToggleSwitch
                      checked={true}
                      onChange={() => {}}
                      label="Devre Dışı (Disabled)"
                      disabled
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tablo İçinde Kullanım Örneği */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tablo İçinde Kullanım Örneği
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #ddd' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #ddd' }}>Ürün Adı</th>
                      <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #ddd' }}>Fiyat</th>
                      <th style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid #ddd' }}>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: 'Laptop', price: '5.000 ₺', active: true },
                      { id: 2, name: 'Telefon', price: '3.000 ₺', active: false },
                      { id: 3, name: 'Tablet', price: '2.000 ₺', active: true },
                    ].map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.id}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{item.name}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.price}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                          <ToggleSwitch
                            checked={item.active}
                            onChange={() => {}}
                            size="small"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToggleSwitchExample;
