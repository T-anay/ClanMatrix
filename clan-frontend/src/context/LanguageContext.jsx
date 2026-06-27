import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Navbar
    'nav.admin': 'Admin Panel',
    'nav.matrix': 'Matris',
    'nav.logout': 'Cikis',
    'nav.theme.dark': 'Karanlik',
    'nav.theme.light': 'Aydinlik',
    'nav.subtitle': 'Klan Etkinlik Takip',
    
    // Auth
    'auth.login.title': 'GİRİŞ YAP',
    'auth.login.subtitle': 'Hesabinla oturum ac ve klana katil.',
    'auth.login.desc': 'Klan üyelerinin etkinliklere katılımını matris tablosu ile kolayca takip et.',
    'auth.login.username': 'KULLANICI ADI',
    'auth.login.password': 'SİFRE',
    'auth.login.btn': 'KLANA GİRİŞ YAP',
    'auth.login.noaccount': 'Hesabin yok mu?',
    'auth.login.register': 'KAYIT OL',
    'auth.login.show': 'GOSTER',
    'auth.login.hide': 'GIZLE',
    'auth.register.title': 'KAYIT OL',
    'auth.register.subtitle': 'Klana katılmak için yeni bir hesap oluştur.',
    'auth.register.btn': 'HESAP OLUŞTUR',
    'auth.register.haveaccount': 'Zaten hesabın var mı?',
    'auth.register.login': 'GİRİŞ YAP',
    'auth.register.password_confirm': 'ŞİFRE TEKRARI',
    
    // Errors
    'error.401': 'Giriş bilgilerinizi kontrol edin. Eğer doğruysa hesabınız henüz onaylanmamış olabilir.',
    'error.403': 'Bu işlem için yetkiniz yok veya onay bekliyorsunuz.',
    'error.network': 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.',
    'error.default': 'Bir hata oluştu.',
    'error.password_mismatch': 'Şifreler birbiriyle eşleşmiyor.',
    
    // Matrix
    'matrix.title': 'Etkinlik Matrisi',
    'matrix.subtitle': 'Kendi satirindaki hucreye tiklayarak katilim fotografi yukle',
    'matrix.error.load': 'Veriler yuklenirken hata olustu.',
    'matrix.error.upload': 'Yukleme basarisiz.',
    'matrix.success.upload': 'Resim yuklendi.',
    'matrix.search': 'Uye Ara...',
    'matrix.sort.asc': 'A — Z',
    'matrix.sort.desc': 'Z — A',
    'matrix.sort.most': 'En Çok Katılanlar',
    'matrix.sort.least': 'En Az Katılanlar',
    'matrix.filter.event.all': 'Tüm Etkinlikler',
    'matrix.filter.status.joined': 'Katılanlar',
    'matrix.filter.status.not_joined': 'Katılmayanlar',
    'matrix.legend.joined': 'Katildi',
    'matrix.legend.mycell': 'Senin Hucren',
    'matrix.legend.locked': 'Kilitli',
    'matrix.stats.members': 'Uye',
    'matrix.stats.events': 'Etkinlik',
    'matrix.header.member': 'Uye',
    'matrix.participation': 'Katilim',
    'matrix.count_suffix': 'katilim',
    'matrix.me': 'sen',
    'matrix.empty': 'Henuz Etkinlik Eklenmemis',
    'matrix.empty.sub': 'Admin, yeni etkinlik ekleyene kadar bekleniyor.',
    'matrix.noresults': 'Arama sonucu bulunamadi.',
    'matrix.btn.upload': 'Yukle',
    'matrix.btn.change': 'Degistir',
    'matrix.btn.cancel': 'Iptal',
    'matrix.btn.loading': 'Yukleniyor...',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'Uye yonetimi, onay akisi ve etkinlik islemleri.',
    'admin.stats.pending': 'Onay Bekleyen',
    'admin.stats.members': 'Toplam Uye',
    'admin.stats.events': 'Etkinlik',
    'admin.tab.pending': 'Bekleyenler',
    'admin.tab.members': 'Uyeler',
    'admin.tab.events': 'Etkinlikler',
    'admin.empty.pending': 'Onay Bekleyen Uye Yok',
    'admin.empty.pending.sub': 'Yeni kayit geldiginde burada gorunur.',
    'admin.empty.members': 'Uye Bulunamadi',
    'admin.empty.events': 'Henuz Etkinlik Eklenmemis',
    'admin.badge.pending': 'Onay Bekliyor',
    'admin.btn.approve': 'Onayla',
    'admin.btn.delete': 'Sil',
    'admin.event.add.title': 'Yeni Etkinlik Ekle',
    'admin.event.input': 'Etkinlik adi girin...',
    'admin.event.btn.add': 'Ekle',
    'admin.event.color': 'Etkinlik Rengi Sec',
    'admin.event.capacity': 'Etkinlik Kapasitesi',
    'admin.event.limit': 'Maksimum 10 etkinlik limitine ulasildi. Yeni etkinlik eklemek icin once bir tanesini silin.',

    // General
    'loading': 'Yukleniyor...',
  },
  en: {
    // Navbar
    'nav.admin': 'Admin Panel',
    'nav.matrix': 'Matrix',
    'nav.logout': 'Logout',
    'nav.theme.dark': 'Dark',
    'nav.theme.light': 'Light',
    'nav.subtitle': 'Clan Event Tracker',
    
    // Auth
    'auth.login.title': 'LOGIN',
    'auth.login.subtitle': 'Log in to your account and join the clan.',
    'auth.login.desc': 'Easily track clan members\' event participation with the matrix table.',
    'auth.login.username': 'USERNAME',
    'auth.login.password': 'PASSWORD',
    'auth.login.btn': 'JOIN CLAN',
    'auth.login.noaccount': 'Don\'t have an account?',
    'auth.login.register': 'REGISTER',
    'auth.login.show': 'SHOW',
    'auth.login.hide': 'HIDE',
    'auth.register.title': 'REGISTER',
    'auth.register.subtitle': 'Create a new account to join the clan.',
    'auth.register.btn': 'CREATE ACCOUNT',
    'auth.register.haveaccount': 'Already have an account?',
    'auth.register.login': 'LOGIN',
    'auth.register.password_confirm': 'CONFIRM PASSWORD',

    // Errors
    'error.401': 'Please check your login details. If they are correct, your account might not be approved yet.',
    'error.403': 'You do not have permission or are pending approval.',
    'error.network': 'Could not connect to the server. Please try again later.',
    'error.default': 'An error occurred.',
    'error.password_mismatch': 'Passwords do not match.',

    // Matrix
    'matrix.title': 'Event Matrix',
    'matrix.subtitle': 'Click your cell to upload a participation photo',
    'matrix.error.load': 'Failed to load data.',
    'matrix.error.upload': 'Upload failed.',
    'matrix.success.upload': 'Image uploaded.',
    'matrix.search': 'Search Member...',
    'matrix.sort.asc': 'A — Z',
    'matrix.sort.desc': 'Z — A',
    'matrix.sort.most': 'Most Participations',
    'matrix.sort.least': 'Least Participations',
    'matrix.filter.event.all': 'All Events',
    'matrix.filter.status.joined': 'Participated',
    'matrix.filter.status.not_joined': 'Did Not Participate',
    'matrix.legend.joined': 'Joined',
    'matrix.legend.mycell': 'Your Cell',
    'matrix.legend.locked': 'Locked',
    'matrix.stats.members': 'Members',
    'matrix.stats.events': 'Events',
    'matrix.header.member': 'Member',
    'matrix.participation': 'Submits',
    'matrix.count_suffix': 'submits',
    'matrix.me': 'you',
    'matrix.empty': 'No Events Added Yet',
    'matrix.empty.sub': 'Waiting for admin to add new events.',
    'matrix.noresults': 'No results found.',
    'matrix.btn.upload': 'Upload',
    'matrix.btn.change': 'Change',
    'matrix.btn.cancel': 'Cancel',
    'matrix.btn.loading': 'Uploading...',
    
    // Admin
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'Member management, approval flow, and events.',
    'admin.stats.pending': 'Pending',
    'admin.stats.members': 'Total Members',
    'admin.stats.events': 'Events',
    'admin.tab.pending': 'Pending',
    'admin.tab.members': 'Members',
    'admin.tab.events': 'Events',
    'admin.empty.pending': 'No Pending Approvals',
    'admin.empty.pending.sub': 'New registrations will appear here.',
    'admin.empty.members': 'No Members Found',
    'admin.empty.events': 'No Events Added Yet',
    'admin.badge.pending': 'Pending',
    'admin.btn.approve': 'Approve',
    'admin.btn.delete': 'Delete',
    'admin.event.add.title': 'Add New Event',
    'admin.event.input': 'Enter event name...',
    'admin.event.btn.add': 'Add',
    'admin.event.color': 'Select Event Color',
    'admin.event.capacity': 'Event Capacity',
    'admin.event.limit': 'Maximum limit of 10 events reached. Delete one to add a new event.',

    // General
    'loading': 'Loading...',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('clan_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('clan_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
