import { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useModal } from '../context/ModalContext';
import imageCompression from 'browser-image-compression';

export default function UploadModal({ isOpen, onClose, onUpload, eventTitle }) {
  const { t } = useLanguage();
  const { confirm } = useModal();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  if (!isOpen) return null;

  const handleFile = async (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      await confirm(t('upload.error.onlyImages'));
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const options = {
        maxSizeMB: 0.5, // 500 KB target
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.85
      };
      
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File(
        [compressedBlob], 
        file.name.replace(/\.[^/.]+$/, "") + ".webp", 
        { type: 'image/webp' }
      );
      
      await onUpload(compressedFile);
      handleClose();
    } catch {
      // error handled in parent
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setUploading(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      padding: 20,
    }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="wow-card animate-scaleIn" style={{ 
        width: '100%', maxWidth: 460, padding: 36, 
        border: '1px solid var(--border-gold)',
        boxShadow: '0 0 30px rgba(212,160,23,0.15), inset 0 0 20px rgba(212,160,23,0.05)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative corner lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid var(--gold-primary)', borderLeft: '2px solid var(--gold-primary)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid var(--gold-primary)', borderRight: '2px solid var(--gold-primary)', opacity: 0.5 }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h2 className="font-wow gradient-gold" style={{ fontSize: 20, marginBottom: 4 }}>
              {t('upload.title')}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
              {eventTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 4, transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >✕</button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !preview && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
            borderRadius: 12,
            padding: preview ? 12 : 36,
            textAlign: 'center',
            cursor: preview ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            background: dragOver ? 'rgba(212,160,23,0.08)' : 'rgba(0,0,0,0.2)',
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {preview ? (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxHeight: 220, maxWidth: '100%', borderRadius: 8, objectFit: 'contain', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                style={{
                  position: 'absolute', top: -12, right: -12,
                  background: 'var(--danger)', border: '2px solid var(--bg-card)', borderRadius: '50%',
                  width: 30, height: 30, cursor: 'pointer', color: 'white',
                  fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)', transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,160,23,0.1), rgba(212,160,23,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontSize: 24,
                border: '1px solid rgba(212,160,23,0.3)', boxShadow: '0 0 20px rgba(212,160,23,0.1)'
              }}>
                +
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'Cinzel, serif', letterSpacing: '0.04em' }}>
                  {t('upload.drag')}{' '}
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{t('upload.browse')}</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>PNG, JPG, WEBP — Max 10MB</p>
              </div>
            </div>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <button onClick={handleClose} className="wow-btn-outline" style={{ flex: 1, padding: '12px', fontSize: 13 }}>
            {t('confirm.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-gold"
            style={{ flex: 2, padding: '12px', fontSize: 13 }}
            disabled={!file || uploading}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span className="wow-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                {t('upload.uploading')}
              </span>
            ) : t('upload.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}
