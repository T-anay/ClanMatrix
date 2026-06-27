import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userService } from '../services/userService';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const COL_COLORS = [
  { bg: 'rgba(26,107,191,0.15)',  border: '#1a6bbf', header: '#4a9fe8' },
  { bg: 'rgba(45,122,58,0.15)',   border: '#2d7a3a', header: '#5dcc78' },
  { bg: 'rgba(139,45,139,0.15)',  border: '#8b2d8b', header: '#cc6acc' },
  { bg: 'rgba(192,64,32,0.15)',   border: '#c04020', header: '#e87050' },
  { bg: 'rgba(26,122,122,0.15)',  border: '#1a7a7a', header: '#4acccc' },
  { bg: 'rgba(139,105,20,0.15)',  border: '#8b6914', header: '#d4a840' },
  { bg: 'rgba(90,45,139,0.15)',   border: '#5a2d8b', header: '#9a6adb' },
  { bg: 'rgba(45,107,45,0.15)',   border: '#2d6b2d', header: '#6acc6a' },
  { bg: 'rgba(139,45,58,0.15)',   border: '#8b2d3a', header: '#e06a78' },
  { bg: 'rgba(26,74,139,0.15)',   border: '#1a4a8b', header: '#4a88e8' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedColorKey, setSelectedColorKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersData, evts] = await Promise.all([
        userService.getAll(),
        eventService.getAll(),
      ]);
      setPendingUsers(usersData.data.filter(u => !u.approved && u.role !== 'ADMIN'));
      setAllUsers(usersData.data.filter(u => u.approved && u.role !== 'ADMIN'));
      setEvents(evts.data);
    } catch { showMsg('Veriler yuklenemedi.', true); }
    finally { setLoading(false); }
  };

  const showMsg = (msg, isError = false) => {
    if (isError) { setActionError(msg); setActionMsg(''); }
    else { setActionMsg(msg); setActionError(''); }
    setTimeout(() => { setActionMsg(''); setActionError(''); }, 3500);
  };

  const handleApprove = async (id) => {
    try { await userService.approve(id); showMsg('Kullanici onaylandi.'); fetchAll(); }
    catch { showMsg('Onay basarisiz.', true); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kullanicinin silinmesini onayliyor musunuz?')) return;
    try { await userService.delete(id); showMsg('Kullanici silindi.'); fetchAll(); }
    catch { showMsg('Silme basarisiz.', true); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    try {
      await eventService.create({ title: newEventTitle.trim(), colorKey: selectedColorKey });
      setNewEventTitle('');
      setSelectedColorKey((selectedColorKey + 1) % 10);
      showMsg('Etkinlik eklendi.');
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Ekleme basarisiz.';
      showMsg(typeof msg === 'string' ? msg : 'Ekleme basarisiz.', true);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`"${title}" etkinligini silmek istiyor musunuz? Tum yuklemeler de silinir.`)) return;
    try { await eventService.delete(id); showMsg('Etkinlik silindi.'); fetchAll(); }
    catch { showMsg('Silme basarisiz.', true); }
  };

  const tabs = [
    { key: 'pending', label: t('admin.tab.pending'), count: pendingUsers.length },
    { key: 'members', label: t('admin.tab.members'), count: allUsers.length },
    { key: 'events',  label: t('admin.tab.events'),  count: events.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div className="page-padding" style={{ padding: '32px 28px', maxWidth: 940, margin: '0 auto' }}>

        <div style={{ marginBottom: 28 }}>
          <div className="wow-header-ornament">
            <h1 className="font-wow gradient-gold" style={{ fontSize: 24 }}>
              {t('admin.title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Cinzel, serif', letterSpacing: '0.06em' }}>
            {t('admin.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: t('admin.stats.pending'), value: pendingUsers.length, accent: 'var(--gold-primary)' },
            { label: t('admin.stats.members'), value: allUsers.length, accent: 'var(--text-primary)' },
            { label: t('admin.stats.events'),  value: `${events.length}/10`, accent: events.length >= 10 ? 'var(--danger)' : 'var(--text-primary)' },
          ].map(s => (
            <div key={s.label} className="wow-stat animate-fadeInUp">
              <div className="wow-stat-value" style={{ color: s.accent }}>{s.value}</div>
              <div className="wow-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {actionMsg && <div className="wow-alert-success" style={{ marginBottom: 16 }}>{actionMsg}</div>}
        {actionError && <div className="wow-alert-error" style={{ marginBottom: 16 }}>{actionError}</div>}

        <div className="tabs-row" style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`wow-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 }}>
            <div className="wow-spinner" />
            <p className="font-wow" style={{ color: 'var(--gold-primary)', fontSize: 12, letterSpacing: '0.08em' }}>{t('loading')}</p>
          </div>
        ) : (
          <>
            {activeTab === 'pending' && (
              <div className="animate-fadeIn">
                <div style={{ marginBottom: 16, fontSize: 16, fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t('admin.tab.pending')}
                  <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }}>{pendingUsers.length}</span>
                </div>
                {pendingUsers.length === 0 ? (
                  <div className="wow-card" style={{ padding: 40, textAlign: 'center' }}>
                    <p className="font-wow" style={{ color: 'var(--text-secondary)' }}>{t('admin.empty.pending')}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>{t('admin.empty.pending.sub')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {pendingUsers.map(u => (
                      <div key={u.id} className="wow-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #3a2400, var(--warning))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#030608', fontFamily: 'Cinzel, serif' }}>
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Cinzel, serif', marginBottom: 3 }}>
                              {u.username} <span style={{ opacity: 0.5, fontSize: 11, fontWeight: 400 }}>#{u.id}</span>
                            </div>
                            <span style={{ fontSize: 10, background: 'rgba(212,160,23,0.15)', color: 'var(--gold-primary)', padding: '4px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>{t('admin.badge.pending')}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-gold" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => handleApprove(u.id)}>{t('admin.btn.approve')}</button>
                          <button className="btn-danger-wow" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => handleDelete(u.id)}>{t('admin.btn.delete')}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="animate-fadeIn">
                <div style={{ marginBottom: 16, fontSize: 16, fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t('admin.tab.members')}
                  <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }}>{allUsers.length}</span>
                </div>
                {allUsers.length === 0 ? (
                  <div className="wow-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.empty.members')}</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {allUsers.map(u => (
                      <div key={u.id} className="wow-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', background: u.role === 'ADMIN' ? 'linear-gradient(135deg, #4a3200, var(--gold-primary))' : 'linear-gradient(135deg, #143a20, var(--success))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: '#030608', fontFamily: 'Cinzel, serif' }}>
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Cinzel, serif', marginBottom: 3 }}>
                              {u.username} <span style={{ opacity: 0.5, fontSize: 11, fontWeight: 400 }}>#{u.id}</span>
                            </div>
                            <span className={`badge-wow ${u.role === 'ADMIN' ? 'badge-admin-wow' : 'badge-user-wow'}`}>{u.role}</span>
                          </div>
                        </div>
                        {u.role !== 'ADMIN' && (
                          <button className="btn-danger-wow" onClick={() => handleDelete(u.id)}>{t('admin.btn.delete')}</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="animate-fadeIn">
                <div style={{ marginBottom: 16, fontSize: 16, fontFamily: 'Cinzel, serif', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {t('admin.tab.events')}
                  <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' }}>{events.length}</span>
                </div>
                <div className="wow-card" style={{ padding: '22px 24px', marginBottom: 20 }}>
                  <h3 className="font-wow" style={{ fontSize: 14, color: 'var(--gold-primary)', marginBottom: 16 }}>{t('admin.event.add.title')}</h3>
                  <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input className="wow-input" placeholder={t('admin.event.input')} value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} style={{ flex: 1 }} maxLength={100} disabled={events.length >= 10} />
                      <button type="submit" className="btn-gold" disabled={events.length >= 10 || !newEventTitle.trim()}>{t('admin.event.btn.add')}</button>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', marginBottom: 8 }}>{t('admin.event.color')}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {COL_COLORS.map((col, idx) => (
                          <div key={idx} onClick={() => setSelectedColorKey(idx)} style={{ width: 32, height: 32, borderRadius: 8, background: col.border, border: selectedColorKey === idx ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                            {selectedColorKey === idx && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✓</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                  {events.length >= 10 && (
                    <p className="wow-alert-warning" style={{ marginTop: 12 }}>
                      {t('admin.event.limit')}
                    </p>
                  )}
                  {/* Progress bar */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                        {t('admin.event.capacity')}
                      </span>
                      <span className="font-wow" style={{ fontSize: 12, color: events.length >= 10 ? 'var(--danger)' : 'var(--gold-primary)' }}>
                        {events.length} / 10
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${(events.length / 10) * 100}%`,
                        background: events.length >= 10
                          ? 'var(--danger)'
                          : events.length >= 7
                            ? 'var(--warning)'
                            : 'linear-gradient(to right, var(--gold-dark), var(--gold-primary))',
                        transition: 'width 0.4s ease',
                        boxShadow: events.length < 10 ? '0 0 8px var(--gold-glow)' : 'none',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Event list */}
                {events.length === 0 ? (
                  <div className="wow-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <p className="font-wow" style={{ color: 'var(--text-secondary)' }}>{t('admin.empty.events')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {events.map((evt, idx) => (
                      <div key={evt.id} className="wow-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-panel))',
                            border: '1px solid var(--border-gold)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 900, color: 'var(--gold-primary)', fontFamily: 'Cinzel, serif',
                          }}>
                            {idx + 1}
                          </div>
                          <span className="font-wow" style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>
                            {evt.title}
                          </span>
                        </div>
                        <button id={`delete-event-${evt.id}`} className="btn-danger-wow" onClick={() => handleDeleteEvent(evt.id, evt.title)}>
                          {t('admin.btn.delete')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
