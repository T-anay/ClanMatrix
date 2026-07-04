import { useLanguage } from '../context/LanguageContext';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { t } = useLanguage();

  return (
    <div className="wow-modal-overlay">
      <div className="wow-modal-content animate-scaleIn" style={{ maxWidth: 400, textAlign: 'center' }}>
        <h3 className="font-wow gradient-gold" style={{ fontSize: 20, marginBottom: 16 }}>
          {t('confirm.title')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button 
            onClick={onCancel}
            className="wow-btn-outline" 
            style={{ padding: '8px 24px' }}
          >
            {t('confirm.cancel')}
          </button>
          <button 
            onClick={onConfirm}
            className="wow-btn-primary" 
            style={{ padding: '8px 24px' }}
          >
            {t('confirm.yes')}
          </button>
        </div>
      </div>
    </div>
  );
}
