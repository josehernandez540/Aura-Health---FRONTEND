import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const config = {
  success: { border: '#0d9488', icon: '✅', color: '#0d9488' },
  error:   { border: '#dc2626', icon: '❌', color: '#dc2626' },
  warning: { border: '#f97316', icon: '⚠️', color: '#f97316' },
};

const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const { border, icon, color } = config[type];

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      background: '#fff',
      borderRadius: '12px',
      padding: '16px 20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      borderLeft: `4px solid ${border}`,
      minWidth: '300px',
      maxWidth: '400px',
      fontFamily: 'sans-serif',
      animation: 'toastIn 300ms ease forwards',
    }}>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: '1.4' }}>{icon}</span>

      <p style={{ margin: 0, fontSize: '0.875rem', color, fontWeight: '500', flex: 1, lineHeight: '1.5' }}>
        {message}
      </p>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
