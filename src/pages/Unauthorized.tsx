import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorized.css';
import Button from '../components/ui/Button/Button';

const Unauthorized: React.FC = () => {
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
        <p>Lo sentimos, no tienes los permisos necesarios para ver esta sección.</p>
        
        <div className="unauthorized-actions">
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Volver al Inicio
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;