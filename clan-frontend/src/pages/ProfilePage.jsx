import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { userService } from '../services/userService';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { t } = useLanguage();

  // Username State
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');

    const trimmed = newUsername.trim();
    if (trimmed.length < 3 || trimmed.length > 50) {
      setUsernameError(t('auth.register.rules.username'));
      return;
    }

    setUsernameLoading(true);
    try {
      const res = await userService.updateUsername({ newUsername: trimmed });
      const { token, username, role } = res.data;
      
      // Update JWT token and user info in Context / LocalStorage
      login(token, { username, role });
      
      setUsernameSuccess(t('profile.username.success'));
      setTimeout(() => setUsernameSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || t('error.default');
      setUsernameError(typeof msg === 'string' ? t(msg) : t('error.default'));
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError(t('auth.register.rules.password'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError(t('error.password_mismatch'));
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.updatePassword({ currentPassword, newPassword });
      setPasswordSuccess(t('profile.password.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || t('error.default');
      setPasswordError(typeof msg === 'string' ? t(msg) : t('error.default'));
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="page-padding" style={{ padding: '32px 28px', maxWidth: 940, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div className="wow-header-ornament">
            <h1 className="font-wow gradient-gold" style={{ fontSize: 24 }}>
              {t('profile.title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Cinzel, serif', letterSpacing: '0.06em' }}>
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Content Container */}
        {user?.role === 'ADMIN' && (
          <div className="wow-alert-error" style={{ marginBottom: 24, padding: '14px 20px' }}>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
              ⚠️ {t('auth.error.admin_cannot_change')}
            </span>
          </div>
        )}

        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, alignItems: 'flex-start' }}>
          
          {/* Form 1: Username Update */}
          <div className="wow-card animate-fadeInLeft" style={{ padding: '24px 28px', border: '2px solid var(--border-gold)', background: 'var(--bg-card)' }}>
            <h2 className="font-wow gradient-gold" style={{ fontSize: 16, marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t('profile.username.title')}
            </h2>

            {usernameSuccess && <div className="wow-alert-success" style={{ marginBottom: 16 }}>{usernameSuccess}</div>}
            {usernameError && <div className="wow-alert-error" style={{ marginBottom: 16 }}>{usernameError}</div>}

            <form onSubmit={handleUpdateUsername} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('profile.username.current')}
                </label>
                <input
                  type="text"
                  className="wow-input"
                  disabled
                  value={user?.username || ''}
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('profile.username.new')}
                </label>
                <input
                  type="text"
                  className="wow-input"
                  required
                  disabled={user?.role === 'ADMIN'}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="3-50"
                  style={user?.role === 'ADMIN' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                disabled={usernameLoading || newUsername.trim() === user?.username || user?.role === 'ADMIN'}
                style={{ marginTop: 8, padding: '12px' }}
              >
                {usernameLoading ? '...' : t('profile.btn.save')}
              </button>
            </form>
          </div>

          {/* Form 2: Password Update */}
          <div className="wow-card animate-fadeInRight" style={{ padding: '24px 28px', border: '2px solid var(--border-gold)', background: 'var(--bg-card)' }}>
            <h2 className="font-wow gradient-gold" style={{ fontSize: 16, marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {t('profile.password.title')}
            </h2>

            {passwordSuccess && <div className="wow-alert-success" style={{ marginBottom: 16 }}>{passwordSuccess}</div>}
            {passwordError && <div className="wow-alert-error" style={{ marginBottom: 16 }}>{passwordError}</div>}

             <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('profile.password.current')}
                </label>
                <input
                  type="password"
                  className="wow-input"
                  required
                  disabled={user?.role === 'ADMIN'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={user?.role === 'ADMIN' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('profile.password.new')}
                </label>
                <input
                  type="password"
                  className="wow-input"
                  required
                  disabled={user?.role === 'ADMIN'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="min. 6"
                  style={user?.role === 'ADMIN' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('profile.password.confirm')}
                </label>
                <input
                  type="password"
                  className="wow-input"
                  required
                  disabled={user?.role === 'ADMIN'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  style={user?.role === 'ADMIN' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmNewPassword || user?.role === 'ADMIN'}
                style={{ marginTop: 8, padding: '12px' }}
              >
                {passwordLoading ? '...' : t('profile.btn.save')}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
