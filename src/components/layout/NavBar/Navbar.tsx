import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../features/auth/store/auth.store';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { role, logout } = useAuthStore();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTitle = (): string => {
    const path = location.pathname;

    if (path.includes('audit')) return 'Auditoría';
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('patients')) return 'Pacientes';
    if (path.includes('doctors')) return 'Médicos';

    return 'Panel';
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          {getTitle()}
        </div>

        <div className="topbar-breadcrumb">
          Aura Health / {getTitle()}
        </div>
      </div>

      <div className="topbar-right">
        <span className="clock">
          {time}
        </span>

        <div className="theme-toggle" id="theme-toggle" title="Cambiar tema"></div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative' }}
        >
          <img src="/icons/bell.svg" height="20" className="icon-img" alt="Notificaciones"/>
          <span className="notif-badge"></span>
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/profile')}
        >
          {role}
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => logout()}
        >
          Salir
        </button>
      </div>
    </header>
  );
};

export default Navbar;