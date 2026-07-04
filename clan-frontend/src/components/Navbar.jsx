import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      <Link to="/matrix" className={`wow-nav-link ${location.pathname === '/matrix' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        {t('nav.matrix')}
      </Link>
      <Link to="/rules" className={`wow-nav-link ${location.pathname === '/rules' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        {t('nav.rules')}
      </Link>
      {user?.role === 'ADMIN' && (
        <Link to="/admin" className={`wow-nav-link ${location.pathname === '/admin' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
          {t('nav.admin')}
        </Link>
      )}
      
      <div className="nav-divider" style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 8px' }} />

      <button onClick={toggleLanguage} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: '1px solid var(--border-gold)',
        borderRadius: 20, padding: '6px 10px', color: 'var(--text-primary)',
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Cinzel, serif', fontWeight: 700
      }}>
        <span style={{ fontSize: 11 }}>EN</span>
        <div className="toggle-pill" style={{ width: 24, height: 12, background: 'rgba(212, 160, 23, 0.2)', borderRadius: 10, position: 'relative' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold-primary)', position: 'absolute', top: 1, left: lang === 'tr' ? 13 : 1, transition: 'left 0.2s' }} />
        </div>
        <span style={{ fontSize: 11 }}>TR</span>
      </button>

      <button onClick={toggleTheme} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'transparent', border: '1px solid var(--border-gold)',
        borderRadius: 20, padding: '6px 14px', color: 'var(--text-primary)',
        fontSize: 10, fontFamily: 'Cinzel, serif', letterSpacing: '0.05em',
        cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700
      }}>
        <div className="toggle-pill" style={{ width: 24, height: 12, background: 'rgba(212, 160, 23, 0.2)', borderRadius: 10, position: 'relative' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold-primary)', position: 'absolute', top: 1, left: theme === 'dark' ? 1 : 13, transition: 'left 0.2s' }} />
        </div>
        {theme === 'dark' ? t('nav.theme.light').toUpperCase() : t('nav.theme.dark').toUpperCase()}
      </button>

      <button onClick={handleLogout} className="btn-danger-wow" style={{ marginLeft: 8 }}>
        {t('nav.logout')}
      </button>
    </>
  );

  return (
    <nav style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-gold)', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/matrix" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #141824, #1a2333)', border: '2px solid var(--gold-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(212,160,23,0.3)' }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
          </div>
          <div>
            <div className="font-wow gradient-gold" style={{ fontSize: 20, letterSpacing: '0.05em' }}>CLANMATRIX</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: -2 }}>
              {t('nav.subtitle')}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NavLinks />
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', fontSize: 24, cursor: 'pointer', padding: 4 }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu animate-fadeInDown" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 12 }}>
          <NavLinks />
        </div>
      )}
    </nav>
  );
}
