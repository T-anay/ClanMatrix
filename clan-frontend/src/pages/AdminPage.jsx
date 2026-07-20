import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userService } from '../services/userService';
import { eventService } from '../services/eventService';
import { announcementService } from '../services/announcementService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';

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
  const { confirm } = useModal();
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Event Edit State
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', colorKey: 0, startDate: '', endDate: '' });
  
  // Announcement Edit State
  const [editingAnnId, setEditingAnnId] = useState(null);
  const [annForm, setAnnForm] = useState({ content: '', colorKey: 0 });

  // Reset Password State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingData, usersData, evtsData, annData] = await Promise.all([
        userService.getPending(), // FIXED: fetch pending users properly
        userService.getAll(),
        eventService.getAll(),
        announcementService.getAll()
      ]);
      setPendingUsers(pendingData.data);
      setAllUsers(usersData.data.filter(u => u.role !== 'ADMIN'));
      setEvents(evtsData.data);
      setAnnouncements(annData.data);
    } catch { showMsg(t('admin.error.load'), true); }
    finally { setLoading(false); }
  };

  const showMsg = (msg, isError = false) => {
    if (isError) { setActionError(msg); setActionMsg(''); }
    else { setActionMsg(msg); setActionError(''); }
    setTimeout(() => { setActionMsg(''); setActionError(''); }, 3500);
  };

  // --- Users ---
  const handleApprove = async (id) => {
    try { await userService.approve(id); showMsg(t('admin.msg.approved')); fetchAll(); }
    catch { showMsg(t('admin.error.approve'), true); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm(t('admin.confirm.deleteUser'));
    if (!ok) return;
    try { await userService.delete(id); showMsg(t('admin.msg.deleted')); fetchAll(); }
    catch { showMsg(t('admin.error.delete'), true); }
  };

  // --- Events ---
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;
    try {
      const payload = {
        title: eventForm.title.trim(),
        colorKey: eventForm.colorKey,
        startDate: eventForm.startDate || null,
        endDate: eventForm.endDate || null
      };

      if (editingEventId) {
        await eventService.update(editingEventId, payload);
        showMsg(t('admin.msg.eventUpdated'));
      } else {
        await eventService.create(payload);
        showMsg(t('admin.msg.eventAdded'));
      }
      
      setEditingEventId(null);
      setEventForm({ title: '', colorKey: (eventForm.colorKey + 1) % 10, startDate: '', endDate: '' });
      fetchAll();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || t('admin.error.save');
      showMsg(typeof msg === 'string' ? msg : t('admin.error.save'), true);
    }
  };

  const handleEditEvent = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      colorKey: evt.colorKey,
      startDate: evt.startDate || '',
      endDate: evt.endDate || ''
    });
  };

  const handleDeleteEvent = async (id, title) => {
    const ok = await confirm(t('admin.confirm.deleteEvent').replace('{title}', title));
    if (!ok) return;
    try { await eventService.delete(id); showMsg(t('admin.msg.eventDeleted')); fetchAll(); }
    catch { showMsg(t('admin.error.delete'), true); }
  };

  // --- Announcements ---
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.content.trim()) return;
    try {
      const payload = {
        content: annForm.content.trim(),
        colorKey: annForm.colorKey
      };

      if (editingAnnId) {
        await announcementService.update(editingAnnId, payload);
        showMsg(t('admin.msg.annUpdated'));
      } else {
        await announcementService.create(payload);
        showMsg(t('admin.msg.annAdded'));
      }
      
      setEditingAnnId(null);
      setAnnForm({ content: '', colorKey: (annForm.colorKey + 1) % 10 });
      fetchAll();
    } catch {
      showMsg(t('admin.error.save'), true);
    }
  };

  const handleEditAnnouncement = (ann) => {
    setEditingAnnId(ann.id);
    setAnnForm({
      content: ann.content,
      colorKey: ann.colorKey
    });
  };

  const handleDeleteAnnouncement = async (id) => {
    const ok = await confirm(t('admin.confirm.deleteAnn'));
    if (!ok) return;
    try { await announcementService.delete(id); showMsg(t('admin.msg.annDeleted')); fetchAll(); }
    catch { showMsg(t('admin.error.delete'), true); }
  };

  // --- Reset Password ---
  const handleOpenResetModal = (u) => {
    setResetUser(u);
    setNewPasswordInput('');
    setResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.length < 6) {
      showMsg(t('auth.register.rules.password'), true);
      return;
    }
    try {
      await userService.resetPassword(resetUser.id, { newPassword: newPasswordInput.trim() });
      showMsg(t('admin.reset_password.success'));
      setResetModalOpen(false);
      setResetUser(null);
    } catch (err) {
      const msg = err.response?.data?.message || t('admin.error.save');
      showMsg(typeof msg === 'string' ? t(msg) : t('admin.error.save'), true);
    }
  };

  const handleMoveEvent = async (index, direction) => {
    const updated = [...events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setEvents(updated);

    try {
      const orderedIds = updated.map(e => e.id);
      await eventService.updateOrder(orderedIds);
      showMsg(t('admin.msg.orderUpdated'));
    } catch {
      showMsg(t('admin.error.order'), true);
      fetchAll();
    }
  };

  const handleMoveAnnouncement = async (index, direction) => {
    const updated = [...announcements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setAnnouncements(updated);

    try {
      const orderedIds = updated.map(a => a.id);
      await announcementService.updateOrder(orderedIds);
      showMsg(t('admin.msg.orderUpdated'));
    } catch {
      showMsg(t('admin.error.order'), true);
      fetchAll();
    }
  };

  const tabs = [
    { key: 'pending', label: t('admin.tab.pending'), count: pendingUsers.length },
    { key: 'members', label: t('admin.tab.members'), count: allUsers.length },
    { key: 'events',  label: t('admin.tab.events'),  count: events.length },
    { key: 'announcements', label: t('admin.tab.announcements'), count: announcements.length },
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
              {tab.count > 0 && <span style={{ marginLeft: 6, fontSize: 10, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 10 }}>{tab.count}</span>}
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
            {/* PENDING TAB */}
            {activeTab === 'pending' && (
              <div className="animate-fadeIn">
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
                              {u.username} <span style={{ opacity: 0.5, fontSize: 12, fontWeight: 400 }}>#{u.id}</span>
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

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className="animate-fadeIn">
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
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="wow-btn-outline" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => handleOpenResetModal(u)}>
                              {t('admin.btn.reset_password')}
                            </button>
                            <button className="btn-danger-wow" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => handleDelete(u.id)}>
                              {t('admin.btn.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="animate-fadeIn">
                <div className="wow-card" style={{ padding: '22px 24px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 className="font-wow" style={{ fontSize: 14, color: 'var(--gold-primary)' }}>
                      {editingEventId ? t('admin.event.edit.title') : t('admin.event.add.title')}
                    </h3>
                    {editingEventId && (
                      <button onClick={() => { setEditingEventId(null); setEventForm({ title: '', colorKey: 0, startDate: '', endDate: '' }); }} className="btn-danger-wow" style={{ padding: '4px 8px', fontSize: 10 }}>
                        {t('confirm.cancel')}
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input className="wow-input" placeholder={t('admin.event.input')} value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} style={{ flex: 1 }} maxLength={100} disabled={!editingEventId && events.length >= 10} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <label style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', marginBottom: 4, display: 'block' }}>{t('admin.event.start')}</label>
                        <input type="date" className="wow-input" value={eventForm.startDate} onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })} disabled={!editingEventId && events.length >= 10} />
                      </div>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <label style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', marginBottom: 4, display: 'block' }}>{t('admin.event.end')}</label>
                        <input type="date" className="wow-input" value={eventForm.endDate} onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })} disabled={!editingEventId && events.length >= 10} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', marginBottom: 8 }}>{t('admin.event.color')}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {COL_COLORS.map((col, idx) => (
                          <div key={idx} onClick={() => setEventForm({ ...eventForm, colorKey: idx })} style={{ width: 32, height: 32, borderRadius: 8, background: col.border, border: eventForm.colorKey === idx ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                            {eventForm.colorKey === idx && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✓</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="btn-gold" disabled={(!editingEventId && events.length >= 10) || !eventForm.title.trim()}>
                      {editingEventId ? t('admin.btn.save') : t('admin.event.btn.add')}
                    </button>
                  </form>
                  {!editingEventId && events.length >= 10 && (
                    <p className="wow-alert-warning" style={{ marginTop: 12 }}>{t('admin.event.limit')}</p>
                  )}
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
                            background: COL_COLORS[evt.colorKey]?.bg || 'var(--bg-secondary)',
                            border: `1px solid ${COL_COLORS[evt.colorKey]?.border || 'var(--border-gold)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 900, color: '#fff', fontFamily: 'Cinzel, serif',
                          }}>
                            {idx + 1}
                          </div>
                          <div>
                            <span className="font-wow" style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>
                              {evt.title}
                            </span>
                            {(evt.startDate || evt.endDate) && (
                              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                {evt.startDate || '?'} - {evt.endDate || '?'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button type="button" className="wow-btn-outline" style={{ padding: '4px 8px', fontSize: 10 }} disabled={idx === 0} onClick={() => handleMoveEvent(idx, 'up')}>
                            ▲
                          </button>
                          <button type="button" className="wow-btn-outline" style={{ padding: '4px 8px', fontSize: 10 }} disabled={idx === events.length - 1} onClick={() => handleMoveEvent(idx, 'down')}>
                            ▼
                          </button>
                          <button type="button" className="wow-btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => handleEditEvent(evt)}>
                            {t('admin.btn.edit')}
                          </button>
                          <button type="button" className="btn-danger-wow" onClick={() => handleDeleteEvent(evt.id, evt.title)}>
                            {t('admin.btn.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ANNOUNCEMENTS TAB */}
            {activeTab === 'announcements' && (
              <div className="animate-fadeIn">
                <div className="wow-card" style={{ padding: '22px 24px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 className="font-wow" style={{ fontSize: 14, color: 'var(--gold-primary)' }}>
                      {editingAnnId ? t('admin.ann.edit.title') : t('admin.ann.add.title')}
                    </h3>
                    {editingAnnId && (
                      <button onClick={() => { setEditingAnnId(null); setAnnForm({ content: '', colorKey: 0 }); }} className="btn-danger-wow" style={{ padding: '4px 8px', fontSize: 10 }}>
                        {t('confirm.cancel')}
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <textarea 
                      className="wow-input" 
                      placeholder={t('admin.ann.input')} 
                      value={annForm.content} 
                      onChange={e => setAnnForm({ ...annForm, content: e.target.value })} 
                      style={{ minHeight: 80, resize: 'vertical' }} 
                      required 
                    />
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', marginBottom: 8 }}>{t('admin.event.color')}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {COL_COLORS.map((col, idx) => (
                          <div key={idx} onClick={() => setAnnForm({ ...annForm, colorKey: idx })} style={{ width: 32, height: 32, borderRadius: 8, background: col.border, border: annForm.colorKey === idx ? '2px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
                            {annForm.colorKey === idx && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✓</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button type="submit" className="btn-gold" disabled={!annForm.content.trim()}>
                      {editingAnnId ? t('admin.btn.save') : t('admin.ann.btn.add')}
                    </button>
                  </form>
                </div>

                {/* Announcement list */}
                {announcements.length === 0 ? (
                  <div className="wow-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <p className="font-wow" style={{ color: 'var(--text-secondary)' }}>{t('admin.empty.ann')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {announcements.map((ann, idx) => (
                      <div key={ann.id} className="wow-card" style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderLeft: `4px solid ${COL_COLORS[ann.colorKey]?.border || 'var(--border-gold)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                            {ann.content}
                          </span>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                            <button type="button" className="wow-btn-outline" style={{ padding: '4px 8px', fontSize: 10 }} disabled={idx === 0} onClick={() => handleMoveAnnouncement(idx, 'up')}>
                              ▲
                            </button>
                            <button type="button" className="wow-btn-outline" style={{ padding: '4px 8px', fontSize: 10 }} disabled={idx === announcements.length - 1} onClick={() => handleMoveAnnouncement(idx, 'down')}>
                              ▼
                            </button>
                            <button type="button" className="wow-btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => handleEditAnnouncement(ann)}>
                              {t('admin.btn.edit')}
                            </button>
                            <button type="button" className="btn-danger-wow" onClick={() => handleDeleteAnnouncement(ann.id)}>
                              {t('admin.btn.delete')}
                            </button>
                          </div>
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Reset Password Modal */}
      {resetModalOpen && resetUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="wow-card animate-fadeInUp" style={{ width: '100%', maxWidth: 400, padding: '24px 28px', border: '2px solid var(--border-gold)', background: 'var(--bg-card)' }}>
            <h3 className="font-wow gradient-gold" style={{ fontSize: 16, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('admin.reset_password.title', { username: resetUser.username })}
            </h3>
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                  {t('admin.reset_password.input')}
                </label>
                <input
                  type="text"
                  className="wow-input"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="min. 6"
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, padding: '10px' }}>
                  {t('admin.btn.save')}
                </button>
                <button type="button" className="btn-danger-wow" onClick={() => { setResetModalOpen(false); setResetUser(null); }} style={{ flex: 1, padding: '10px' }}>
                  {t('confirm.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
