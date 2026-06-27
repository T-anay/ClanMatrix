import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import { eventService } from '../services/eventService';
import { submissionService } from '../services/submissionService';
import { userService } from '../services/userService';
import { useLanguage } from '../context/LanguageContext';

const DARK_COLORS = [
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

const LIGHT_COLORS = [
  { bg: 'rgba(26,107,191,0.08)',  border: '#1a6bbf', header: '#0d4b99' },
  { bg: 'rgba(45,122,58,0.08)',   border: '#2d7a3a', header: '#185925' },
  { bg: 'rgba(139,45,139,0.08)',  border: '#8b2d8b', header: '#661b66' },
  { bg: 'rgba(192,64,32,0.08)',   border: '#c04020', header: '#99260c' },
  { bg: 'rgba(26,122,122,0.08)',  border: '#1a7a7a', header: '#0d5959' },
  { bg: 'rgba(139,105,20,0.08)',  border: '#8b6914', header: '#664a0a' },
  { bg: 'rgba(90,45,139,0.08)',   border: '#5a2d8b', header: '#3b1666' },
  { bg: 'rgba(45,107,45,0.08)',   border: '#2d6b2d', header: '#184a18' },
  { bg: 'rgba(139,45,58,0.08)',   border: '#8b2d3a', header: '#661623' },
  { bg: 'rgba(26,74,139,0.08)',   border: '#1a4a8b', header: '#0d2d66' },
];

export default function MatrixPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterEventId, setFilterEventId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('joined');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, submissionsRes, usersRes] = await Promise.all([
        eventService.getAll(),
        submissionService.getAll(),
        userService.getAll(),
      ]);
      setEvents(eventsRes.data);
      setSubmissions(submissionsRes.data);
      setUsers(usersRes.data.filter(u => u.approved && u.role !== 'ADMIN'));
    } catch { setError(t('matrix.error.load')); }
    finally { setLoading(false); }
  };

  const submissionMap = useMemo(() => {
    const map = {};
    submissions.forEach(s => {
      if (!map[s.userId]) map[s.userId] = {};
      map[s.userId][s.eventId] = s;
    });
    return map;
  }, [submissions]);

  const sortedUsers = useMemo(() => {
    const others = users.filter(u => u.username !== user.username);
    let filtered = others.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterEventId !== 'all') {
      filtered = filtered.filter(u => {
        const hasSub = !!submissionMap[u.id]?.[filterEventId];
        return filterStatus === 'joined' ? hasSub : !hasSub;
      });
    }

    filtered.sort((a, b) => {
      if (sortOrder === 'asc') return a.username.localeCompare(b.username);
      if (sortOrder === 'desc') return b.username.localeCompare(a.username);
      
      const countA = submissionMap[a.id] ? Object.keys(submissionMap[a.id]).length : 0;
      const countB = submissionMap[b.id] ? Object.keys(submissionMap[b.id]).length : 0;
      
      if (sortOrder === 'most') {
        if (countA !== countB) return countB - countA;
        return a.username.localeCompare(b.username);
      }
      if (sortOrder === 'least') {
        if (countA !== countB) return countA - countB;
        return a.username.localeCompare(b.username);
      }
      return 0;
    });

    const me = users.find(u => u.username === user.username);
    let meIncluded = false;
    if (me && me.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      if (filterEventId === 'all') {
        meIncluded = true;
      } else {
        const hasSub = !!submissionMap[me.id]?.[filterEventId];
        if (filterStatus === 'joined' ? hasSub : !hasSub) meIncluded = true;
      }
    }
    if (meIncluded) return [me, ...filtered];
    return filtered;
  }, [users, searchTerm, sortOrder, filterEventId, filterStatus, user.username, submissionMap]);

  const handleCellClick = (rowUser, event) => {
    if (rowUser.username !== user.username) return;
    const existing = submissionMap[rowUser.id]?.[event.id];
    setSelectedCell({ eventId: event.id, eventTitle: event.title, hasExisting: !!existing });
    setModalOpen(true);
  };

  const handleUpload = async (file) => {
    setUploadError('');
    try {
      await submissionService.upload(selectedCell.eventId, file);
      setUploadSuccess(t('matrix.success.upload', { title: selectedCell.eventTitle }));
      setTimeout(() => setUploadSuccess(''), 4000);
      await fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || t('matrix.error.upload');
      setUploadError(msg);
      throw err;
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 60px)', flexDirection: 'column', gap: 16 }}>
        <div className="wow-spinner" />
        <p className="font-wow" style={{ color: 'var(--gold-primary)', fontSize: 13, letterSpacing: '0.08em' }}>{t('loading')}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ padding: '28px 24px', maxWidth: 1500, margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="wow-header-ornament">
            <h1 className="font-wow gradient-gold" style={{ fontSize: 26, whiteSpace: 'nowrap' }}>
              {t('matrix.title')}
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Cinzel, serif', letterSpacing: '0.06em' }}>
            {t('matrix.subtitle')}
          </p>
        </div>

        {/* Alerts */}
        {uploadSuccess && <div className="wow-alert-success" style={{ marginBottom: 14 }}>{uploadSuccess}</div>}
        {uploadError   && <div className="wow-alert-error"   style={{ marginBottom: 14 }}>{uploadError}</div>}
        {error         && <div className="wow-alert-error"   style={{ marginBottom: 14 }}>{error}</div>}

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            id="matrix-search"
            className="wow-input"
            style={{ maxWidth: 220 }}
            placeholder={t('matrix.search')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            id="matrix-sort-toggle"
            className="wow-input"
            style={{ maxWidth: 180, padding: '9px 12px', fontSize: 11, fontFamily: 'Cinzel, serif', cursor: 'pointer', appearance: 'auto' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">{t('matrix.sort.asc')}</option>
            <option value="desc">{t('matrix.sort.desc')}</option>
            <option value="most">{t('matrix.sort.most')}</option>
            <option value="least">{t('matrix.sort.least')}</option>
          </select>

          <select
            id="matrix-filter-event"
            className="wow-input"
            style={{ maxWidth: 160, padding: '9px 12px', fontSize: 11, fontFamily: 'Cinzel, serif', cursor: 'pointer', appearance: 'auto' }}
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
          >
            <option value="all">{t('matrix.filter.event.all')}</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>

          {filterEventId !== 'all' && (
            <select
              id="matrix-filter-status"
              className="wow-input"
              style={{ maxWidth: 160, padding: '9px 12px', fontSize: 11, fontFamily: 'Cinzel, serif', cursor: 'pointer', appearance: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="joined">{t('matrix.filter.status.joined')}</option>
              <option value="not_joined">{t('matrix.filter.status.not_joined')}</option>
            </select>
          )}

          {/* Legend */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center', fontFamily: 'Cinzel, serif', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, border: '2px solid var(--success)', borderRadius: 3, display: 'inline-block', background: 'rgba(46,204,113,0.2)' }} /> {t('matrix.legend.joined')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, border: '1px dashed var(--gold-primary)', borderRadius: 3, display: 'inline-block' }} /> {t('matrix.legend.mycell')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 12, height: 12, border: '1px solid var(--border-subtle)', borderRadius: 3, display: 'inline-block', opacity: 0.4 }} /> {t('matrix.legend.locked')}
            </span>
          </div>
        </div>



        {/* Matrix Table */}
        {events.length === 0 ? (
          <div className="wow-card" style={{ padding: 60, textAlign: 'center' }}>
            <p className="font-wow" style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{t('matrix.empty')}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{t('matrix.empty.sub')}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12 }}>
            <div style={{
              width: 'max-content',
              border: '2px solid var(--border-gold)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              background: 'var(--bg-card)',
            }}>
              {/* Column Headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `222px repeat(${events.length}, 108px)`,
                background: 'var(--bg-secondary)',
                borderBottom: '2px solid var(--border-gold)',
              }}>
                <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 6, borderRight: '1px solid var(--border-gold)' }}>
                  <span className="font-wow" style={{ fontSize: 13, color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('matrix.header.member')}</span>
                </div>
                {events.map((event) => {
                  const palette = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
                  const col = palette[(event.colorKey ?? 0) % palette.length];
                  const eventSubCount = submissions.filter(s => s?.event?.id === event.id || s.eventId === event.id).length;
                  return (
                    <div key={event.id} style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      borderLeft: `1px solid ${col.border}40`,
                      background: col.bg,
                      borderTop: `3px solid ${col.border}`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div className="font-wow" style={{ fontSize: 12, color: col.header, fontWeight: 700, lineHeight: 1.4, wordBreak: 'break-word', letterSpacing: '0.04em', marginBottom: 4 }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                        {t('matrix.participation')}: <span style={{ color: col.header, fontWeight: 'bold' }}>{eventSubCount} / {users.length}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rows */}
              {sortedUsers.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Cinzel, serif' }}>
                  {t('matrix.noresults')}
                </div>
              ) : (
                sortedUsers.map((rowUser, idx) => {
                  const isMe = rowUser.username === user.username;
                  const myCount = submissionMap[rowUser.id] ? Object.keys(submissionMap[rowUser.id]).length : 0;

                  return (
                    <div key={rowUser.id} style={{
                      display: 'grid',
                      gridTemplateColumns: `222px repeat(${events.length}, 108px)`,
                      borderBottom: idx < sortedUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      background: isMe ? 'rgba(212,160,23,0.05)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      borderLeft: isMe ? '3px solid var(--gold-primary)' : '3px solid transparent',
                    }}>
                      {/* Username cell */}
                      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderRight: '1px solid var(--border-gold)' }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                          background: isMe ? 'linear-gradient(135deg, #6b4f00, #d4a017)' : 'var(--bg-secondary)',
                          border: isMe ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 900, color: isMe ? '#05091a' : 'var(--text-secondary)',
                          fontFamily: 'Cinzel, serif',
                          boxShadow: isMe ? '0 0 10px var(--gold-glow)' : 'none',
                        }}>
                          {rowUser.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Cinzel, serif', color: isMe ? 'var(--gold-primary)' : 'var(--text-primary)', letterSpacing: '0.02em' }}>
                            {rowUser.username} <span style={{ opacity: 0.5, fontSize: 12, fontWeight: 400 }}>#{rowUser.id}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {myCount} {t('matrix.count_suffix')}{isMe ? ` — ${t('matrix.me')}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Event cells */}
                      {events.map((event) => {
                        const palette = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;
                        const col = palette[(event.colorKey ?? 0) % palette.length];
                        const submission = submissionMap[rowUser.id]?.[event.id];
                        const hasSub = !!submission;
                        const canClick = isMe;

                        return (
                          <div key={event.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderLeft: `1px solid ${col.border}20`,
                            padding: 8,
                          }}>
                            <div
                              id={`cell-${rowUser.id}-${event.id}`}
                              onClick={() => {
                                if (canClick) { handleCellClick(rowUser, event); return; }
                                if (hasSub) { setPreviewImage(submission.imageUrl); }
                              }}
                              style={{
                                width: 76, height: 76, borderRadius: 8,
                                border: hasSub ? '2px solid var(--success)' : canClick ? `1px dashed ${col.border}` : '1px solid var(--border-subtle)',
                                background: hasSub ? 'rgba(46,204,113,0.08)' : canClick ? col.bg : 'var(--bg-secondary)',
                                cursor: (hasSub || canClick) ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden', position: 'relative',
                                opacity: (!hasSub && !canClick) ? 0.3 : 1,
                              }}
                              onMouseEnter={e => { if (canClick || hasSub) { e.currentTarget.style.transform = 'scale(1.08)'; } }}
                              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                              {hasSub ? (
                                <>
                                  <img src={submission.imageUrl} alt="submission" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  {canClick && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', fontFamily: 'Cinzel, serif', fontSize: 12, color: 'white', letterSpacing: '0.05em' }}
                                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                    >{t('matrix.btn.change')}</div>
                                  )}
                                </>
                              ) : canClick ? (
                                <span className="font-wow" style={{ fontSize: 32, color: col.header, opacity: 0.5 }}>+</span>
                              ) : (
                                <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '0.04em' }}>—</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <UploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onUpload={handleUpload}
        eventTitle={selectedCell?.eventTitle} hasExisting={selectedCell?.hasExisting} />

      {previewImage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 20 }}
          onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Onizleme" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, border: '2px solid var(--gold-primary)', boxShadow: '0 0 40px var(--gold-glow)' }} />
        </div>
      )}
    </div>
  );
}
