import { useNavigate } from 'react-router-dom';
import './unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="lock-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 className="error-code">403</h1>
        <h2>Acceso Restringido</h2>
        <p>Lo sentimos, no tienes los permisos necesarios para ver esta sección de <strong>Aura Health</strong>.</p>
        
        <div className="unauthorized-actions">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            Volver al Inicio
          </button>
          <button className="btn-secondary" onClick={() => window.history.back()}>
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;