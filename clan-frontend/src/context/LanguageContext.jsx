import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Navbar
    'nav.admin': 'Dashboard',
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
    
    // Custom Modal
    'confirm.title': 'Emin misiniz?',
    'confirm.yes': 'Evet, Onaylıyorum',
    'confirm.cancel': 'İptal',

    // Upload
    'upload.title': 'Katılım Fotoğrafı Yükle',
    'upload.drag': 'Sürükle & bırak veya',
    'upload.browse': 'dosya seç',
    'upload.submit': 'Fotoğrafı Gönder',
    'upload.uploading': 'Yükleniyor...',
    'upload.error.onlyImages': 'Sadece resim dosyası yükleyebilirsiniz (PNG, JPG, WEBP).',
    
    // Matrix
    'matrix.title': 'Etkinlik Matrisi',
    'matrix.subtitle': 'Kendi satirindaki hucreye tiklayarak katilim fotografi yukle',
    'matrix.error.load': 'Veriler yuklenirken hata olustu.',
    'matrix.error.upload': 'Yukleme basarisiz.',
    'matrix.success.upload': '"{title}" için fotoğraf başarıyla eklendi.',
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
    'matrix.announcements': 'Duyurular',
    'matrix.noAnnouncements': 'Şu an için bir duyuru bulunmuyor.',
    
    // Admin
    'admin.title': 'Dashboard',
    'admin.subtitle': 'Uye yonetimi, onay akisi, etkinlik ve duyuru islemleri.',
    'admin.stats.pending': 'Onay Bekleyen',
    'admin.stats.members': 'Toplam Uye',
    'admin.stats.events': 'Etkinlik',
    'admin.tab.pending': 'Bekleyenler',
    'admin.tab.members': 'Uyeler',
    'admin.tab.events': 'Etkinlikler',
    'admin.tab.announcements': 'Duyurular',
    'admin.empty.pending': 'Onay Bekleyen Uye Yok',
    'admin.empty.pending.sub': 'Yeni kayit geldiginde burada gorunur.',
    'admin.empty.members': 'Uye Bulunamadi',
    'admin.empty.events': 'Henuz Etkinlik Eklenmemis',
    'admin.empty.ann': 'Henüz duyuru eklenmemiş.',
    'admin.badge.pending': 'Onay Bekliyor',
    'admin.btn.approve': 'Onayla',
    'admin.btn.delete': 'Sil',
    'admin.btn.edit': 'Düzenle',
    'admin.btn.save': 'Kaydet',
    
    // Admin Events
    'admin.event.add.title': 'Yeni Etkinlik Ekle',
    'admin.event.edit.title': 'Etkinliği Düzenle',
    'admin.event.input': 'Etkinlik adi girin...',
    'admin.event.start': 'Başlangıç Tarihi',
    'admin.event.end': 'Bitiş Tarihi',
    'admin.event.btn.add': 'Etkinlik Ekle',
    'admin.event.color': 'Renk Paleti',
    'admin.event.capacity': 'Etkinlik Kapasitesi',
    'admin.event.limit': 'Maksimum 10 etkinlik limitine ulasildi. Yeni etkinlik eklemek icin once bir tanesini silin.',
    
    // Admin Announcements
    'admin.ann.add.title': 'Yeni Duyuru Ekle',
    'admin.ann.edit.title': 'Duyuruyu Düzenle',
    'admin.ann.input': 'Duyuru metnini buraya yazın...',
    'admin.ann.btn.add': 'Duyuru Ekle',

    // Admin Messages & Confirms
    'admin.msg.approved': 'Kullanıcı başarıyla onaylandı.',
    'admin.msg.deleted': 'Kullanıcı başarıyla silindi.',
    'admin.msg.eventAdded': 'Etkinlik başarıyla eklendi.',
    'admin.msg.eventUpdated': 'Etkinlik başarıyla güncellendi.',
    'admin.msg.eventDeleted': 'Etkinlik silindi.',
    'admin.msg.annAdded': 'Duyuru başarıyla eklendi.',
    'admin.msg.annUpdated': 'Duyuru başarıyla güncellendi.',
    'admin.msg.annDeleted': 'Duyuru silindi.',
    'admin.msg.imageDeleted': 'Kullanıcıya ait katılım fotoğrafı başarıyla silindi.',
    'admin.error.load': 'Veriler yüklenemedi.',
    'admin.error.approve': 'Onay işlemi başarısız.',
    'admin.error.delete': 'Silme işlemi başarısız.',
    'admin.error.save': 'Kaydetme işlemi başarısız.',
    
    'admin.confirm.deleteUser': 'Bu kullanıcının silinmesini onaylıyor musunuz?',
    'admin.confirm.deleteEvent': '"{title}" etkinliğini silmek istiyor musunuz? Tüm katılımlar da silinir.',
    'admin.confirm.deleteAnn': 'Bu duyuruyu silmek istediğinize emin misiniz?',
    'admin.confirm.deleteImage': 'Bu kullanıcıya ait katılım fotoğrafını silmek istediğinize emin misiniz? Kullanıcı tekrar yükleme yapabilir.',

    // General
    'loading': 'Yukleniyor...',
  },
  en: {
    // Navbar
    'nav.admin': 'Dashboard',
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

    // Custom Modal
    'confirm.title': 'Are you sure?',
    'confirm.yes': 'Yes, Confirm',
    'confirm.cancel': 'Cancel',

    // Upload
    'upload.title': 'Upload Participation Photo',
    'upload.drag': 'Drag & drop or',
    'upload.browse': 'browse files',
    'upload.submit': 'Submit Photo',
    'upload.uploading': 'Uploading...',
    'upload.error.onlyImages': 'You can only upload image files (PNG, JPG, WEBP).',

    // Matrix
    'matrix.title': 'Event Matrix',
    'matrix.subtitle': 'Click your cell to upload a participation photo',
    'matrix.error.load': 'Failed to load data.',
    'matrix.error.upload': 'Upload failed.',
    'matrix.success.upload': 'Photo successfully added for "{title}".',
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
    'matrix.announcements': 'Announcements',
    'matrix.noAnnouncements': 'There are currently no announcements.',
    
    // Admin
    'admin.title': 'Dashboard',
    'admin.subtitle': 'Member management, approval flow, events and announcements.',
    'admin.stats.pending': 'Pending',
    'admin.stats.members': 'Total Members',
    'admin.stats.events': 'Events',
    'admin.tab.pending': 'Pending',
    'admin.tab.members': 'Members',
    'admin.tab.events': 'Events',
    'admin.tab.announcements': 'Announcements',
    'admin.empty.pending': 'No Pending Approvals',
    'admin.empty.pending.sub': 'New registrations will appear here.',
    'admin.empty.members': 'No Members Found',
    'admin.empty.events': 'No Events Added Yet',
    'admin.empty.ann': 'No announcements added yet.',
    'admin.badge.pending': 'Pending',
    'admin.btn.approve': 'Approve',
    'admin.btn.delete': 'Delete',
    'admin.btn.edit': 'Edit',
    'admin.btn.save': 'Save',
    
    // Admin Events
    'admin.event.add.title': 'Add New Event',
    'admin.event.edit.title': 'Edit Event',
    'admin.event.input': 'Enter event name...',
    'admin.event.start': 'Start Date',
    'admin.event.end': 'End Date',
    'admin.event.btn.add': 'Add Event',
    'admin.event.color': 'Color Palette',
    'admin.event.capacity': 'Event Capacity',
    'admin.event.limit': 'Maximum limit of 10 events reached. Delete one to add a new event.',
    
    // Admin Announcements
    'admin.ann.add.title': 'Add New Announcement',
    'admin.ann.edit.title': 'Edit Announcement',
    'admin.ann.input': 'Type your announcement text here...',
    'admin.ann.btn.add': 'Add Announcement',

    // Admin Messages & Confirms
    'admin.msg.approved': 'User successfully approved.',
    'admin.msg.deleted': 'User successfully deleted.',
    'admin.msg.eventAdded': 'Event successfully added.',
    'admin.msg.eventUpdated': 'Event successfully updated.',
    'admin.msg.eventDeleted': 'Event deleted.',
    'admin.msg.annAdded': 'Announcement successfully added.',
    'admin.msg.annUpdated': 'Announcement successfully updated.',
    'admin.msg.annDeleted': 'Announcement deleted.',
    'admin.msg.imageDeleted': 'User\'s participation photo successfully deleted.',
    'admin.error.load': 'Failed to load data.',
    'admin.error.approve': 'Approval failed.',
    'admin.error.delete': 'Deletion failed.',
    'admin.error.save': 'Save failed.',
    
    'admin.confirm.deleteUser': 'Are you sure you want to delete this user?',
    'admin.confirm.deleteEvent': 'Are you sure you want to delete "{title}"? All participation photos will also be deleted.',
    'admin.confirm.deleteAnn': 'Are you sure you want to delete this announcement?',
    'admin.confirm.deleteImage': 'Are you sure you want to delete this user\'s participation photo? They will be able to upload again.',

    // General
    'loading': 'Loading...',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('clan_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('clan_lang', lang);
  }, [lang]);

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || key;
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach(k => {
        str = str.replace(`{${k}}`, params[k]);
      });
    }
    return str;
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
