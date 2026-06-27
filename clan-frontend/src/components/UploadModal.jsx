import { useState, useRef } from 'react';

/**
 * Modal for uploading an image to a matrix cell.
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   onUpload: (file: File) => Promise<void>
 *   eventTitle: string
 *   hasExisting: boolean (true = update mode)
 */
export default function UploadModal({ isOpen, onClose, onUpload, eventTitle, hasExisting }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  if (!isOpen) return null;

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('Sadece resim dosyası yükleyebilirsiniz.');
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
      await onUpload(file);
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
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      padding: 20,
    }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="glass-card animate-fadeIn" style={{ width: '100%', maxWidth: 460, padding: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              {hasExisting ? '🔄 Resim Güncelle' : '📤 Resim Yükle'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {eventTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 20, cursor: 'pointer', lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !preview && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--accent-primary)' : 'var(--border-color)'}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            cursor: preview ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            background: dragOver ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
            minHeight: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {preview ? (
            <div style={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                style={{
                  position: 'absolute', top: -8, right: -8,
                  background: '#ef4444', border: 'none', borderRadius: '50%',
                  width: 24, height: 24, cursor: 'pointer', color: 'white',
                  fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Sürükle & bırak veya <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>dosya seç</span>
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>PNG, JPG, WEBP — Max 10MB</p>
            </div>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />

        {/* Warning for update mode */}
        {hasExisting && (
          <div style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 8, padding: '10px 14px',
            marginTop: 16, fontSize: 12, color: '#fbbf24',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <span>⚠️</span>
            <span>Mevcut resminizin üzerine yazılacak ve Cloudinary'den silinecek.</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={handleClose} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: '1px solid var(--border-color)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500,
          }}>
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{ flex: 2, padding: '11px', fontSize: 14 }}
            disabled={!file || uploading}
          >
            {uploading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} />
                Yükleniyor...
              </span>
            ) : hasExisting ? 'Güncelle' : 'Yükle'}
          </button>
        </div>
      </div>
    </div>
  );
}
