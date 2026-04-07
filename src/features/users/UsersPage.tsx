import { useState } from 'react';
 
interface User {
  id: string;
  name: string;
  role: 'Médico' | 'Admin';
  specialization?: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}
 
const mockUsers: User[] = [
  { id: '1', name: 'Dr. Carlos Medina', role: 'Médico', specialization: 'Cardiología', email: 'c.medina@aura.co', isActive: true, createdAt: '12 Ene 2026' },
  { id: '2', name: 'Dra. Laura Torres', role: 'Médico', specialization: 'Pediatría', email: 'l.torres@aura.co', isActive: true, createdAt: '15 Ene 2026' },
  { id: '3', name: 'Admin Juan Pérez', role: 'Admin', specialization: undefined, email: 'j.perez@aura.co', isActive: true, createdAt: '01 Feb 2026' },
  { id: '4', name: 'Dr. Andrés Gómez', role: 'Médico', specialization: 'Neurología', email: 'a.gomez@aura.co', isActive: false, createdAt: '20 Feb 2026' },
  { id: '5', name: 'Dra. Valentina Ruiz', role: 'Médico', specialization: 'Dermatología', email: 'v.ruiz@aura.co', isActive: true, createdAt: '05 Mar 2026' },
  { id: '6', name: 'Dr. Felipe Castro', role: 'Médico', specialization: 'Traumatología', email: 'f.castro@aura.co', isActive: true, createdAt: '10 Mar 2026' },
  { id: '7', name: 'Dra. Sofía Herrera', role: 'Médico', specialization: 'Medicina Gral.', email: 's.herrera@aura.co', isActive: true, createdAt: '18 Mar 2026' },
  { id: '8', name: 'Admin María López', role: 'Admin', specialization: undefined, email: 'm.lopez@aura.co', isActive: true, createdAt: '22 Mar 2026' },
];
 
const ITEMS_PER_PAGE = 8;
 
const getInitial = (name: string) => name.charAt(0).toUpperCase();
 
const avatarColors: Record<string, string> = {
  C: '#0d9488', L: '#1d4ed8', J: '#7c3aed', A: '#059669',
  V: '#0891b2', F: '#dc2626', S: '#0d9488', M: '#1e293b',
};
 
const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Médicos' | 'Admins' | 'Activos' | 'Inactivos'>('Todos');
  const [page, setPage] = useState(1);
 
  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
 
    const matchFilter =
      filter === 'Todos' ||
      (filter === 'Médicos' && u.role === 'Médico') ||
      (filter === 'Admins' && u.role === 'Admin') ||
      (filter === 'Activos' && u.isActive) ||
      (filter === 'Inactivos' && !u.isActive);
 
    return matchSearch && matchFilter;
  });
 
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
 
  const filters: Array<typeof filter> = ['Todos', 'Médicos', 'Admins', 'Activos', 'Inactivos'];
 
  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
 
      {/* Filtros y búsqueda */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
            fontSize: '0.875rem', outline: 'none', background: '#fff',
            width: '260px', color: '#0f172a',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem',
                fontWeight: filter === f ? '600' : '400',
                background: filter === f ? '#0d9488' : '#fff',
                color: filter === f ? '#fff' : '#64748b',
                border: filter === f ? 'none' : '1px solid #e2e8f0',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
 
      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['USUARIO', 'ESPECIALIDAD', 'CORREO', 'ESTADO', 'CREADO', 'ACCIONES'].map((col) => (
                <th key={col} style={{
                  padding: '14px 20px', textAlign: 'left', color: '#94a3b8',
                  fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.05em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                {/* Usuario */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: avatarColors[getInitial(user.name)] || '#0d9488',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
                    }}>
                      {getInitial(user.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</div>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
                        borderRadius: '999px',
                        background: user.role === 'Médico' ? '#ccfbf1' : '#ede9fe',
                        color: user.role === 'Médico' ? '#0d9488' : '#7c3aed',
                      }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </td>
 
                {/* Especialidad */}
                <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                  {user.specialization || '—'}
                </td>
 
                {/* Correo */}
                <td style={{ padding: '16px 20px', color: '#64748b' }}>
                  {user.email}
                </td>
 
                {/* Estado */}
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                    background: user.isActive ? '#f0fdf4' : '#fff7ed',
                    color: user.isActive ? '#16a34a' : '#ea580c',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: user.isActive ? '#16a34a' : '#f97316',
                    }} />
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
 
                {/* Creado */}
                <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                  {user.createdAt}
                </td>
 
                {/* Acciones */}
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                      background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', cursor: 'pointer',
                    }}>
                      Editar
                    </button>
                    <button style={{
                      padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                      background: user.isActive ? '#fff7ed' : '#f0fdf4',
                      color: user.isActive ? '#ea580c' : '#16a34a',
                      border: user.isActive ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                      cursor: 'pointer',
                    }}>
                      {user.isActive ? 'Inactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderTop: '1px solid #f1f5f9',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} usuarios
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '32px', height: '32px', borderRadius: '6px', fontSize: '0.875rem',
                  fontWeight: p === page ? '700' : '400',
                  background: p === page ? '#0d9488' : '#fff',
                  color: p === page ? '#fff' : '#64748b',
                  border: p === page ? 'none' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default UsersPage;