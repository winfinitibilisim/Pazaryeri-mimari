import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Link, Button, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';

const HelpDetail: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Google otomatik tamamlama tahminlerini yönetme
      </Typography>
      <Typography variant="body1" paragraph>
        Otomatik tamamlama özelliğini kullanarak Google aramanızı kolayca gerçekleştirebilirsiniz. Belirli otomatik tamamlama tahminlerini kapatabilir veya kaldırabilir ya da tahminlerinizle ilgili sorunları bildirebilirsiniz.
      </Typography>
      <Link href="#" underline="hover" sx={{ mb: 2, display: 'block' }}>
        Otomatik tamamlama hakkında daha fazla bilgi edinin.
      </Link>
      <Divider sx={{ my: 2 }} />
      <Tabs value={0} indicatorColor="primary" textColor="primary">
        <Tab label="Bilgisayar" />
        <Tab label="Android" />
        <Tab label="iPhone ve iPad" />
      </Tabs>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Arama kişiselleştirme ayarını kapatma
      </Typography>
      <Typography variant="body1" paragraph>
        Önemli: "Arama kişiselleştirme" ayarı kapalıyken geçmiş aramalarınıza dayalı olarak kişiselleştirilmiş tahminler veya öneriler almazsınız. "Web ve Uygulama Etkinliği" açıksa Google hizmetlerinde daha kişiselleştirilmiş bir deneyim sunmak için arama geçmişiniz Google Hesabınıza kaydedilir. Web ve Uygulama Etkinliğinizi nasıl bulup kontrol edeceğinizi öğrenin.
      </Typography>
      <Typography variant="body1" paragraph>
        Google Hesabınızda oturum açarsanız "Arama kişiselleştirme" ayarı etkindir. Tahmin ve öneri almak istemiyorsanız "Arama kişiselleştirme" ayarını kapatabilirsiniz.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Trend olan aramaları kapatma
      </Typography>
      <Typography variant="body1" paragraph>
        Trend olan aramaları almak istemiyorsanız ayarlarınızı değiştirebilirsiniz.
      </Typography>
      <ol>
        <li>Bilgisayarınızda google.com adresine gidin.</li>
        <li>Alt tarafta Ayarlar &gt; Arama ayarları'nı tıklayın.</li>
        <li>Sol tarafta Diğer ayarları tıklayın.</li>
        <li>"Masaüstü" bölümünde Trend olan aramalarla otomatik tamamlama ayarını kapatın.</li>
      </ol>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        İlgili aramaları kapatma
      </Typography>
      <Typography variant="body1" paragraph>
        Google'da arama yaparken Google Hesabınızda oturumunuz kapalıysa son aramanızla ilgili öneriler alabilirsiniz. Bunları almak istemiyorsanız Aramayı özelleştirme'yi kapatın.
      </Typography>
      <ol>
        <li>Bilgisayarınızda google.com adresine gidin.</li>
        <li>Alta Ayarlar &gt; Arama ayarları'na dokunun.</li>
        <li>Aramayı özelleştirme ayarını kapatın.</li>
      </ol>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Tahminleri bildirme
      </Typography>
      <Typography variant="body1" paragraph>
        Otomatik tamamlama politikalarından birini ihlal ettiğini düşündüğünüz tahminleri bildirebilirsiniz.
      </Typography>
      <ol>
        <li>Bilgisayarınızda google.com adresine gidin.</li>
        <li>Arama çubuğuna arama sorunuzu girin.</li>
        <li>Tahminler, arama çubuğunun altında görünür.</li>
        <li>Tahminin altında Uygunsuz tahminleri bildirin'i tıklayın.</li>
        <li>Hakkında geri bildirim vermek istediğiniz tahmini ve geri bildiriminizin konusunu seçin.</li>
        <li>Gönder'i tıklayın.</li>
      </ol>
      <Typography variant="body1" paragraph>
        Geri bildiriminizi analiz ederiz ancak bildirilen tahminleri otomatik olarak kaldıramayız.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Tahminle ilgili yasal sorun bildirme
      </Typography>
      <Typography variant="body1" paragraph>
        Yasalara aykırı olduğunu düşündüğünüz bir içeriğin kaldırılmasını talep etmek için bu formu doldurun.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        İlgili kaynaklar
      </Typography>
      <Link href="#" underline="hover">
        Arama, etkinliğinizden nasıl yararlanır?
      </Link>
      <br />
      <Link href="#" underline="hover">
        Arama geçmişinizi yönetme ve silme
      </Link>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" gutterBottom>
          Bu size yardımcı oldu mu?
        </Typography>
        <Button variant="outlined" sx={{ mr: 2 }}>Evet</Button>
        <Button variant="outlined">Hayır</Button>
      </Box>
    </Box>
  );
};

export default HelpDetail; 