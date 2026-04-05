import React, { useEffect } from 'react';

const Modal = ({ open, title, children, onClose, maxWidth = 900 }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        backdropFilter: 'blur(6px)'
      }}
      onClick={onClose}
    >
      <div
        className="card-custom"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflow: 'hidden',
          background: 'white',
          animation: 'scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div className="section-title" style={{ margin: 0, padding: 0, border: 'none' }}>
              {title}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(15, 23, 42, 0.06)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              width: 34,
              height: 34,
              borderRadius: 12,
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontWeight: 800,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto', maxHeight: 'calc(90vh - 84px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
