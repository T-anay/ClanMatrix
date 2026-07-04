import { useLanguage } from '../context/LanguageContext';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { t } = useLanguage();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      padding: 20,
    }}>
      <div className="animate-scaleIn" style={{ 
        width: '100%', maxWidth: 400, padding: 32, textAlign: 'center',
        background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-gold)',
        boxShadow: '0 0 30px rgba(212,160,23,0.15), inset 0 0 20px rgba(212,160,23,0.05)',
      }}>
        <h3 className="font-wow gradient-gold" style={{ fontSize: 20, marginBottom: 16 }}>
          {t('confirm.title')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button 
            onClick={onCancel}
            className="wow-btn-outline" 
            style={{ padding: '10px 24px', flex: 1 }}
          >
            {t('confirm.cancel')}
          </button>
          <button 
            onClick={onConfirm}
            className="btn-gold" 
            style={{ padding: '10px 24px', flex: 1 }}
          >
            {t('confirm.yes')}
          </button>
        </div>
      </div>
    </div>
  );
}
