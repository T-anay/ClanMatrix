import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/authService';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      const { token, role } = res.data;
      login(token, { username, role });
      navigate(role === 'ADMIN' ? '/admin' : '/matrix');
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data;
      if (err.response?.status === 400 && typeof serverMsg === 'string') {
        setError(t(serverMsg));
      } else if (err.response?.status === 401) {
        setError(typeof serverMsg === 'string' && serverMsg.startsWith('auth.error') ? t(serverMsg) : t('error.401'));
      } else if (err.response?.status === 403) {
        setError(t('error.403'));
      } else if (!err.response) {
        setError(t('error.network'));
      } else {
        setError(typeof serverMsg === 'string' ? t(serverMsg) : t('error.default'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Left Pane - Image */}
      <div className="auth-image-panel" style={{
        flex: 1,
        backgroundImage: 'url(/wow_crown_bg2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        borderRight: '1px solid var(--border-gold)'
      }}>
        {/* Dark overlay for maximum text contrast */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.75)' }} />

        {/* Text Overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 40, textAlign: 'center' }}>
          <div className="wow-header-ornament" style={{ marginBottom: 16 }}>
            <h1 className="font-wow gradient-gold" style={{ fontSize: 42, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              ⚔️ CLANMATRIX
            </h1>
            <h2 className="font-wow gradient-gold" style={{ fontSize: 20, textShadow: '0 4px 20px rgba(0,0,0,0.8)', marginTop: 12 }}>
              {t('auth.login.desc')}
            </h2>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="auth-form-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>

        {/* Top Right Controls */}
        <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 12 }}>
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
        </div>

        {/* Form Container */}
        <div className="animate-fadeInUp" style={{
          margin: 'auto',
          width: '100%',
          maxWidth: 380,
          padding: 40
        }}>

          <h2 className="font-wow" style={{ fontSize: 24, color: 'var(--gold-primary)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('auth.login.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 40, fontFamily: 'Cinzel, serif' }}>
            {t('auth.login.subtitle')}
          </p>

          {error && (
            <div className="wow-alert-error" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                {t('auth.login.username')}
              </label>
              <input
                className="wow-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                {t('auth.login.password')}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="wow-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 80 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-primary)',
                    fontSize: 10,
                    fontFamily: 'Cinzel, serif',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'color 0.2s',
                    fontWeight: 700
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--gold-primary)'}
                >
                  {showPassword ? t('auth.login.hide') : t('auth.login.show')}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="btn-gold"
              type="submit"
              disabled={loading}
              style={{
                marginTop: 10,
                padding: '14px',
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : t('auth.login.btn')}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              {t('auth.login.noaccount')}{' '}
              <Link to="/register" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '0.05em', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--gold-primary)'}>
                {t('auth.login.register')}
              </Link>
            </div>
            <div>
              <span 
                onClick={() => setShowForgotModal(true)} 
                style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, borderBottom: '1px dashed var(--text-muted)', paddingBottom: 2, transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.color = 'var(--gold-primary)'; e.target.style.borderColor = 'var(--gold-primary)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--text-muted)'; }}
              >
                {t('auth.login.forgot')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="wow-card animate-fadeInUp" style={{ width: '100%', maxWidth: 360, padding: '24px 28px', border: '2px solid var(--border-gold)', background: 'var(--bg-card)', textAlign: 'center' }}>
            <h3 className="font-wow gradient-gold" style={{ fontSize: 16, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('auth.login.forgot')}
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: 13, lineHeight: 1.6, marginBottom: 20, fontFamily: 'Cinzel, serif' }}>
              {t('auth.login.forgot.info')}
            </p>
            <button className="btn-gold" onClick={() => setShowForgotModal(false)} style={{ padding: '8px 24px', width: '100%' }}>
              {t('confirm.ok')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
