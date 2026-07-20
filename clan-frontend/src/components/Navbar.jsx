import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false); };

  const navItems = user ? [
    { label: t('nav.matrix'), path: '/matrix' },
    { label: t('nav.rules'), path: '/rules' },
    { label: t('nav.profile'), path: '/profile' },
    ...(user.role === 'ADMIN' ? [{ label: t('nav.admin'), path: '/admin' }] : []),
  ] : [];

  const isActive = (path) => location.pathname === path;

  const NavBtn = ({ label, path }) => (
    <button
      onClick={() => { navigate(path); setMenuOpen(false); }}
      style={{
        background: isActive(path) ? 'rgba(201,150,12,0.15)' : 'transparent',
        border: `1px solid ${isActive(path) ? 'var(--border-gold)' : 'var(--border-card)'}`,
        borderRadius: 9,
        color: isActive(path) ? 'var(--gold-primary)' : 'var(--text-secondary)',
        padding: '9px 18px',
        cursor: 'pointer',
        fontFamily: 'Cinzel, serif',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.color = 'var(--gold-primary)'; e.currentTarget.style.borderColor = 'var(--border-gold)'; } }}
      onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-card)'; } }}
    >
      {label}
    </button>
  );

  return (
    <>
      <nav style={{
        background: 'var(--bg-card)',
        borderBottom: '2px solid var(--border-gold)',
        height: 'var(--nav-height)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-nav)',
      }}>
        {/* Left Side: Brand + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/*  Brand  */}
          <div
            onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/matrix')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              backgroundImage: 'url(/wow_crown_bg2.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1.5px solid var(--gold-primary)',
              boxShadow: '0 0 16px var(--gold-glow)',
              flexShrink: 0,
            }} />
            <div>
              <div className="font-wow-deco gradient-gold" style={{ fontSize: 24, lineHeight: 1, fontWeight: 700 }}>
                ClanMatrix
              </div>
            </div>
          </div>

          {/*  Desktop Nav  */}
          {user && (
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {navItems.map(item => <NavBtn key={item.path} {...item} />)}
            </div>
          )}
        </div>

        {/*  Right Controls  */}
        {user && (
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* User pill */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: 10,
              padding: '7px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4a3200, var(--gold-primary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color: '#030608',
                fontFamily: 'Cinzel, serif', flexShrink: 0,
              }}>
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Cinzel, serif', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {user.username}
                </div>
                <span className={`badge-wow ${user.role === 'ADMIN' ? 'badge-admin-wow' : 'badge-user-wow'}`} style={{ marginTop: 3, display: 'inline-block' }}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Language toggle */}
            <button id="lang-toggle" onClick={toggleLanguage} className="theme-toggle-btn" title="Dil Degistir">
              <span style={{ fontSize: 11, marginRight: -4, fontWeight: 700 }}>EN</span>
              <div className="toggle-pill" style={{ width: 32 }}>
                <div className="toggle-pill-thumb" style={{ transform: lang === 'tr' ? 'translateX(12px)' : 'translateX(0)' }} />
              </div>
              <span style={{ fontSize: 11, marginLeft: -4, fontWeight: 700 }}>TR</span>
            </button>

            {/* Theme toggle */}
            <button id="theme-toggle" onClick={toggleTheme} className="theme-toggle-btn" title={theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}>
              <div className="toggle-pill">
                <div className="toggle-pill-thumb" />
              </div>
              <span>{theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}</span>
            </button>

            {/* Logout */}
            <button id="navbar-logout" onClick={handleLogout} className="btn-danger-wow" style={{ padding: '8px 16px' }}>
              {t('nav.logout')}
            </button>
          </div>
        )}

        {/* �� Mobile Menu Btn �� */}
        {user && (
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
              flexDirection: 'column', gap: 4, padding: 8, zIndex: 110, position: 'relative'
            }}
          >
            <span style={{ width: 20, height: 2, background: menuOpen ? 'var(--gold-primary)' : 'var(--text-secondary)', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
            <span style={{ width: 20, height: 2, background: menuOpen ? 'var(--gold-primary)' : 'var(--text-secondary)', borderRadius: 2, transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 20, height: 2, background: menuOpen ? 'var(--gold-primary)' : 'var(--text-secondary)', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* �� Mobile Menu �� */}
      {menuOpen && user && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
              style={{
                background: isActive(item.path) ? 'rgba(201,150,12,0.12)' : 'var(--bg-secondary)',
                border: `1px solid ${isActive(item.path) ? 'var(--gold-primary)' : 'var(--border-card)'}`,
                borderRadius: 9, padding: '13px 16px',
                color: isActive(item.path) ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontFamily: 'Cinzel, serif', fontSize: 12, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              {item.label}
            </button>
          ))}

          <div className="wow-divider" />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={toggleLanguage} className="theme-toggle-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>EN</span>
              <div className="toggle-pill" style={{ width: 32 }}>
                <div className="toggle-pill-thumb" style={{ transform: lang === 'tr' ? 'translateX(12px)' : 'translateX(0)' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700 }}>TR</span>
            </button>
            <button onClick={toggleTheme} className="theme-toggle-btn" style={{ flex: 1 }}>
              <div className="toggle-pill"><div className="toggle-pill-thumb" /></div>
              <span>{theme === 'dark' ? t('nav.theme.light') : t('nav.theme.dark')}</span>
            </button>
            <button onClick={handleLogout} className="btn-danger-wow" style={{ flex: 1 }}>{t('nav.logout')}</button>
          </div>
        </div>
      )}

      {/* Responsive style � hidden via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        .mobile-menu {
          position: fixed; top: var(--nav-height); left: 0; right: 0;
          background: var(--bg-card); border-bottom: 1px solid var(--border-gold);
          padding: 20px 28px; display: flex; flexDirection: column; gap: 10px;
          z-index: 99; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
