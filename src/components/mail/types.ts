// Mail klasör tipi
export type MailFolder = 'inbox' | 'sent' | 'draft' | 'trash' | 'spam' | 'archive';

// Mail tipi tanımı
export interface Mail {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  content: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  attachments: {
    name: string;
    size: string;
    type: 'image' | 'document' | 'pdf' | 'other';
    url: string;
  }[];
  folder: MailFolder;
}

// Klasör tipi tanımı
export interface Folder {
  id: MailFolder;
  name: string;
  icon: React.ReactNode;
  count: number;
}

// Etiket tipi tanımı
export interface Label {
  id: string;
  name: string;
  color: string;
}

// Örnek mail verileri
export const dummyMails: Mail[] = [
  {
    id: '1',
    from: {
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    to: [
      {
        name: 'Ben',
        email: 'ben@example.com',
      },
    ],
    subject: 'Proje Toplantısı Hakkında',
    content: 'Merhaba, yarın saat 10:00\'da proje toplantısı yapacağız. Katılımınızı bekliyoruz.',
    date: '25 Mayıs 2025',
    time: '09:30',
    isRead: false,
    isStarred: true,
    isImportant: true,
    labels: ['work'],
    attachments: [],
    folder: 'spam' as MailFolder,
  },
  {
    id: '2',
    from: {
      name: 'Mehmet Demir',
      email: 'mehmet.demir@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    to: [
      {
        name: 'Ben',
        email: 'ben@example.com',
      },
    ],
    subject: 'Fatura Ödemesi',
    content: 'Merhaba, bu ayki faturanızı ödemeniz gerekmektedir. Detaylar ektedir.',
    date: '24 Mayıs 2025',
    time: '14:15',
    isRead: true,
    isStarred: false,
    isImportant: true,
    labels: ['personal'],
    attachments: [
      {
        name: 'fatura_mayis_2025.pdf',
        size: '245 KB',
        type: 'pdf',
        url: '#',
      },
    ],
    folder: 'inbox' as MailFolder,
  },
  {
    id: '3',
    from: {
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    to: [
      {
        name: 'Ben',
        email: 'ben@example.com',
      },
    ],
    subject: 'Haftalık Rapor',
    content: 'Merhaba, haftalık raporu ekte bulabilirsiniz. İyi çalışmalar.',
    date: '23 Mayıs 2025',
    time: '16:45',
    isRead: true,
    isStarred: true,
    isImportant: false,
    labels: ['work'],
    attachments: [
      {
        name: 'haftalik_rapor.xlsx',
        size: '1.2 MB',
        type: 'document',
        url: '#',
      },
    ],
    folder: 'inbox' as MailFolder,
  },
  {
    id: '4',
    from: {
      name: 'Mustafa Özkan',
      email: 'mustafa.ozkan@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    to: [
      {
        name: 'Ben',
        email: 'ben@example.com',
      },
    ],
    subject: 'Yeni Ürün Lansmanı',
    content: 'Merhaba, yeni ürünümüzün lansmanı için hazırlıklar tamamlandı. Detayları ekte bulabilirsiniz.',
    date: '22 Mayıs 2025',
    time: '11:20',
    isRead: false,
    isStarred: false,
    isImportant: true,
    labels: ['work', 'important'],
    attachments: [
      {
        name: 'lansman_sunumu.pptx',
        size: '3.5 MB',
        type: 'document',
        url: '#',
      },
      {
        name: 'urun_gorselleri.zip',
        size: '8.2 MB',
        type: 'other',
        url: '#',
      },
    ],
    folder: 'inbox' as MailFolder,
  },
  {
    id: '5',
    from: {
      name: 'Zeynep Yıldız',
      email: 'zeynep.yildiz@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    to: [
      {
        name: 'Ben',
        email: 'ben@example.com',
      },
    ],
    subject: 'Doğum Günü Daveti',
    content: 'Merhaba, bu haftasonu doğum günü partim var. Seni de aramızda görmekten mutluluk duyarız.',
    date: '21 Mayıs 2025',
    time: '19:05',
    isRead: true,
    isStarred: true,
    isImportant: false,
    labels: ['personal', 'social'],
    attachments: [
      {
        name: 'davetiye.jpg',
        size: '1.8 MB',
        type: 'image',
        url: '#',
      },
    ],
    folder: 'inbox' as MailFolder,
  },
];

// Örnek klasörler
export const folders: Folder[] = [
  { id: 'inbox' as MailFolder, name: 'Gelen Kutusu', icon: null, count: 12 },
  { id: 'sent' as MailFolder, name: 'Gönderilmiş', icon: null, count: 0 },
  { id: 'draft' as MailFolder, name: 'Taslaklar', icon: null, count: 3 },
  { id: 'trash' as MailFolder, name: 'Çöp Kutusu', icon: null, count: 0 },
  { id: 'spam' as MailFolder, name: 'Spam', icon: null, count: 5 },
  { id: 'archive' as MailFolder, name: 'Arşiv', icon: null, count: 0 },
];

// Örnek etiketler
export const labels: Label[] = [
  { id: 'important', name: 'Önemli', color: '#f44336' },
  { id: 'work', name: 'İş', color: '#4caf50' },
  { id: 'personal', name: 'Kişisel', color: '#2196f3' },
  { id: 'social', name: 'Sosyal', color: '#ff9800' },
  { id: 'promotions', name: 'Promosyonlar', color: '#9c27b0' },
];
