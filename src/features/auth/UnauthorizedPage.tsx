import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a6e 0%, #2d2d9b 50%, #1a1a6e 100%)',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '48px 40px',
        maxWidth: '440px',
        width: '100%',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚫</div>
        <h1 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '12px' }}>
          Acceso no autorizado
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '32px' }}>
          No tienes permisos para acceder a esta sección.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
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
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;