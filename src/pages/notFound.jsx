import { useNavigate } from 'react-router-dom';
import './notFound.css';
import Button from '../components/ui/Button/Button.tsx'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="lost-illustration">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        </div>
        
        <h1 className="error-code">404</h1>
        <h2>¡Te has perdido!</h2>
        <p>Parece que has explorado más allá de los límites conocidos de <strong>Aura Health</strong>. Esta página no existe o ha cambiado de lugar.</p>
        
        <div className="notfound-actions">
          <Button variant="success" onClick={() => navigate('/dashboard')}>
            Volver a Zona Segura
          </Button>
          <Button variant='secondary' onClick={() => window.history.back()}>
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;