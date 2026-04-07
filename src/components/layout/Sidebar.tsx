import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/authStore';
import { useAuth } from '../../features/auth/useAuth';

const menuItems = [
  { label: 'Usuarios', path: '/users', icon: '👥', roles: ['ADMIN'] },
  { label: 'Agenda / Citas', path: '/agenda', icon: '📅', roles: ['ADMIN', 'MEDICO'] },
  { label: 'Historial Clínico', path: '/historial', icon: '🗂️', roles: ['ADMIN', 'MEDICO'] },
  { label: 'Tratamientos', path: '/tratamientos', icon: '💊', roles: ['ADMIN', 'MEDICO'] },
  { label: 'Notificaciones', path: '/notificaciones', icon: '🔔', roles: ['ADMIN', 'MEDICO'] },
  { label: 'Reportes', path: '/reportes', icon: '📊', roles: ['ADMIN'] },
  { label: 'Auditoría', path: '/audit', icon: '🔍', roles: ['ADMIN'] },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userId } = useAuthStore();
  const { logout } = useAuth();

  const visibleItems = menuItems.filter(item => item.roles.includes(role || ''));
  const initial = role === 'ADMIN' ? 'A' : 'M';
  const displayName = role === 'ADMIN' ? 'Administrador' : 'Médico';
  const displayRole = role === 'ADMIN' ? 'Admin' : 'Médico';

  return (
    <div style={{
      width: '220px',
      minWidth: '220px',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d2137 0%, #0d3351 60%, #0a4a5e 100%)',
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
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <img
          src="/logo.png"
          alt="Aura Health"
          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }}
        />
        <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1rem' }}>Aura Health</span>
      </div>

      {/* Usuario logueado */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#0d9488',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem' }}>{displayName}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{displayRole}</div>
        </div>
      </div>

      {/* Menú */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 20px', border: 'none', cursor: 'pointer',
                background: isActive ? 'rgba(13, 148, 136, 0.25)' : 'transparent',
                borderLeft: isActive ? '3px solid #0d9488' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontSize: '0.875rem', fontWeight: isActive ? '600' : '400',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#94a3b8',
            fontSize: '0.875rem', borderRadius: '8px',
            textAlign: 'left',
          }}
        >
          <span>🚪</span>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;