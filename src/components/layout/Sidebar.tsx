import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { useAuth } from '../../features/auth/useAuth';

const menuItems = [
  { label: 'Usuarios',          path: '/users',          roles: ['ADMIN'] },
  { label: 'Citas',             path: '/appointments',   roles: ['ADMIN'] },
  { label: 'Programar Cita',    path: '/programar-cita', roles: ['ADMIN'] },
  { label: 'Pacientes',         path: '/pacientes',     roles: ['MEDICO'] },
  { label: 'Mi Agenda',         path: '/mi-agenda',     roles: ['MEDICO'] },
  { label: 'Historial Clínico', path: '/historial',     roles: ['ADMIN', 'MEDICO'] },
  { label: 'Tratamientos',      path: '/tratamientos',  roles: ['ADMIN', 'MEDICO'] },
  { label: 'Notificaciones',    path: '/notificaciones', roles: ['ADMIN', 'MEDICO'] },
  { label: 'Reportes',          path: '/reportes',      roles: ['ADMIN'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuthStore();
  const { logout } = useAuth();

  const visibleItems = menuItems.filter((item) => item.roles.includes(role ?? ''));
  const displayName = role === 'ADMIN' ? 'Administrador' : 'Médico';
  const displaySubtitle = role === 'ADMIN' ? 'Admmin' : 'Médico';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div style={{
      width: '220px',
      minWidth: '220px',
      minHeight: '100vh',
      background: '#0d2137',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '24px 20px 20px',
      }}>
        <img
          src="/logo.png"
          alt="Aura Health"
          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }}
        />
        <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>Aura Health</span>
      </div>

      {/* Usuario */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px 16px',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#0d9488',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.9rem',
          flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem' }}>{displayName}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{displaySubtitle}</div>
        </div>
      </div>

      {/* Menú */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'block',
                width: 'calc(100% - 24px)',
                margin: '2px 12px',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isActive ? '#0d9488' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div style={{ padding: '20px' }}>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '0.875rem',
            padding: 0,
            textAlign: 'left',
          }}
        >
          Cerrar sesión
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
