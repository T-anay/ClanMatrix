import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function PendingApprovalPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <button onClick={toggleTheme} style={{ position: 'fixed', top: 16, right: 16, background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: 'var(--gold-primary)', fontFamily: 'Cinzel, serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {t(theme === 'dark' ? 'nav.theme.light' : 'nav.theme.dark')}
      </button>

      <div className="wow-card animate-fadeIn" style={{ maxWidth: 500, width: '100%', padding: '50px 40px', textAlign: 'center' }}>
        <div className="wow-header-ornament">
          <span className="gradient-gold font-wow" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t('pending.status')}</span>
        </div>

        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: 'linear-gradient(135deg, #3a2800, #8b6914, #3a2800)',
          border: '2px solid var(--gold-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '16px auto 22px', fontSize: 32,
          boxShadow: '0 0 30px var(--gold-glow)',
        }}>
          ⚔️
        </div>

        <h1 className="font-wow" style={{ fontSize: 20, color: 'var(--gold-primary)', marginBottom: 12 }}>
          {t('pending.title')}
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.9, marginBottom: 24, fontFamily: 'Inter, sans-serif' }}>
          {t('pending.desc')}
        </p>

        <div className="wow-alert-warning" style={{ marginBottom: 28, textAlign: 'left' }}>
          {t('pending.alert')}
        </div>

        <Link
          to="/login"
          className="btn-outline-gold"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          {t('pending.back')}
        </Link>
      </div>
    </div>
  );
}
