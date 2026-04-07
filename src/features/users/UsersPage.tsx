import { useState, useEffect } from 'react';
import { usersService } from './users.service';
import type { Doctor } from './users.service';

const ITEMS_PER_PAGE = 8;

const getInitial = (name: string) => name.charAt(0).toUpperCase();

const avatarColors: Record<string, string> = {
  A: '#0d9488', B: '#1d4ed8', C: '#7c3aed', D: '#059669',
  E: '#0891b2', F: '#dc2626', G: '#0d9488', H: '#1e293b',
  I: '#7c3aed', J: '#0d9488', K: '#1d4ed8', L: '#059669',
  M: '#1e293b', N: '#0891b2', O: '#dc2626', P: '#7c3aed',
  Q: '#0d9488', R: '#1d4ed8', S: '#0d9488', T: '#059669',
  U: '#0891b2', V: '#0891b2', W: '#dc2626', X: '#7c3aed',
  Y: '#0d9488', Z: '#1e293b',
};

const UsersPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Activos' | 'Inactivos'>('Todos');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await usersService.getDoctors();
        if (response.success) {
          setDoctors(response.data.items);
        }
      } catch {
        setErrorMessage('No se pudieron cargar los usuarios.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.users.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos' ||
      (filter === 'Activos' && d.is_active) ||
      (filter === 'Inactivos' && !d.is_active);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const filters: Array<typeof filter> = ['Todos', 'Activos', 'Inactivos'];

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

      {/* Error */}
      {errorMessage && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.875rem', marginBottom: '16px' }}>
          {errorMessage}
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['USUARIO', 'ESPECIALIDAD', 'CORREO', 'ESTADO', 'LICENCIA', 'ACCIONES'].map((col) => (
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
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Cargando usuarios...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              paginated.map((doctor) => (
                <tr key={doctor.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: avatarColors[getInitial(doctor.name)] || '#0d9488',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
                      }}>
                        {getInitial(doctor.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f172a' }}>{doctor.name}</div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
                          borderRadius: '999px', background: '#ccfbf1', color: '#0d9488',
                        }}>
                          Médico
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>{doctor.specialization || '—'}</td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>{doctor.users.email}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                      background: doctor.is_active ? '#f0fdf4' : '#fff7ed',
                      color: doctor.is_active ? '#16a34a' : '#ea580c',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: doctor.is_active ? '#16a34a' : '#f97316' }} />
                      {doctor.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>{doctor.license_number}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                        background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', cursor: 'pointer',
                      }}>Editar</button>
                      <button style={{
                        padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                        background: doctor.is_active ? '#fff7ed' : '#f0fdf4',
                        color: doctor.is_active ? '#ea580c' : '#16a34a',
                        border: doctor.is_active ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                        cursor: 'pointer',
                      }}>{doctor.is_active ? 'Inactivar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} usuarios
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: '32px', height: '32px', borderRadius: '6px', fontSize: '0.875rem',
                fontWeight: p === page ? '700' : '400',
                background: p === page ? '#0d9488' : '#fff',
                color: p === page ? '#fff' : '#64748b',
                border: p === page ? 'none' : '1px solid #e2e8f0',
                cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;