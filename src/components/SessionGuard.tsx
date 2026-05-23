import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionExpiry } from '../hooks/useSessionExpiry';
import { useAuthStore } from '../features/auth/authStore';

const SessionGuard = () => {
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleExpire = useCallback(() => {
    setShowExpiredModal(true);
  }, []);

  useSessionExpiry(handleExpire);

  // Si no está autenticado y no hay modal, redirigir al login
  useEffect(() => {
    if (!isAuthenticated && !showExpiredModal) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, showExpiredModal, navigate]);

  const handleAccept = () => {
    setShowExpiredModal(false);
    navigate('/login', { replace: true });
  };

  if (!showExpiredModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#1e1e5e',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '16px',
        padding: '40px 36px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏱️</div>
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px' }}>
          Sesión expirada
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '28px' }}>
          Tu sesión ha expirado por seguridad. Por favor inicia sesión nuevamente.
        </p>
        <button
          onClick={handleAccept}
          style={{
            borderRadius: '999px',
            padding: '10px 36px',
            fontSize: '0.9rem',
            fontWeight: '600',
            background: 'rgba(220, 220, 235, 0.85)',
            color: '#1a1a6e',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default SessionGuard;