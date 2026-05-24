import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUserService } from './adminUser.service';
import type { AdminUser } from './adminUser.service';
import RoleGuard from '../../components/RoleGuard';
import { useAuthStore } from '../auth/authStore';

const ITEMS_PER_PAGE = 8;

type FilterKey = 'Todos' | 'Activos' | 'Inactivos';
const FILTERS: FilterKey[] = ['Todos', 'Activos', 'Inactivos'];

const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const getInitial = (name: string | null, email: string) =>
  (name ?? email).charAt(0).toUpperCase();

const avatarColors: Record<string, string> = {
  A: '#0d9488', B: '#1d4ed8', C: '#7c3aed', D: '#059669',
  E: '#0891b2', F: '#dc2626', G: '#0d9488', H: '#1e293b',
  I: '#7c3aed', J: '#0d9488', K: '#1d4ed8', L: '#059669',
  M: '#1e293b', N: '#0891b2', O: '#dc2626', P: '#7c3aed',
  Q: '#0d9488', R: '#1d4ed8', S: '#0d9488', T: '#059669',
  U: '#0891b2', V: '#0891b2', W: '#dc2626', X: '#7c3aed',
  Y: '#0d9488', Z: '#1e293b',
};

const formatDate = (isoString?: string): string => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
};

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('Todos');
  const [page, setPage] = useState(1);

  const fetchAdmins = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await adminUserService.getAdminUsers();
      if (response.success) {
        setAdmins(response.data.items);
      }
    } catch {
      setErrorMessage('No se pudieron cargar los administradores. Verifique su conexión e intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleToggleStatus = async (admin: AdminUser) => {
    const action = admin.isActive ? 'inactivar' : 'activar';
    const confirmed = window.confirm(
      `¿Está seguro que desea ${action} al administrador "${admin.name ?? admin.email}"?`
    );
    if (!confirmed) return;

    try {
      await adminUserService.toggleAdminStatus(admin.id, !admin.isActive);
      await fetchAdmins();
    } catch {
      setErrorMessage(`No se pudo ${action} al administrador.`);
    }
  };

  const filtered = admins.filter((a) => {
    const matchSearch = a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.name ?? '').toLowerCase().includes(search.toLowerCase());

    let matchFilter = true;
    if (filter === 'Activos') matchFilter = a.isActive;
    else if (filter === 'Inactivos') matchFilter = !a.isActive;

    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalActivos = admins.filter((a) => a.isActive).length;
  const totalInactivos = admins.filter((a) => !a.isActive).length;

  const stats = [
    { label: 'Total Administradores', value: admins.length, borderColor: '#0d9488' },
    { label: 'Activos', value: totalActivos, borderColor: '#0d9488' },
    { label: 'Inactivos', value: totalInactivos, borderColor: '#f97316' },
  ];

  const startItem = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  return (
    <RoleGuard roles="ADMIN" redirect>
      <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>
              Administradores
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
              Inicio / Administradores
            </p>
          </div>
          <button
            onClick={() => navigate('/admin-users/create')}
            style={{
              padding: '10px 20px', borderRadius: '8px', background: '#0d9488',
              color: '#fff', fontWeight: '600', fontSize: '0.875rem',
              border: 'none', cursor: 'pointer',
            }}
          >
            + Nuevo Administrador
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#ffffff', borderRadius: '12px',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                padding: '20px 24px',
                borderLeft: `4px solid ${stat.borderColor}`,
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ marginTop: '6px', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', background: '#fef2f2',
            border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {errorMessage}
          </div>
        )}

        {/* Search + filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
              fontSize: '0.875rem', outline: 'none', background: '#fff',
              width: '260px', color: '#0f172a',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
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

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['USUARIO', 'EMAIL', 'ESTADO', 'CREADO', 'ACCIONES'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '14px 20px', textAlign: 'left', color: '#94a3b8',
                      fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Cargando administradores...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No hay administradores registrados
                  </td>
                </tr>
              ) : (
                paginated.map((admin, idx) => {
                  const displayName = admin.name ?? admin.email;
                  const initial = getInitial(admin.name, admin.email);
                  return (
                    <tr
                      key={admin.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      {/* USUARIO */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: avatarColors[initial] ?? '#0d9488',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
                          }}>
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>
                              {displayName}
                            </div>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
                              borderRadius: '999px', background: '#e0f2fe', color: '#0284c7',
                            }}>
                              Admin
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>
                        {admin.email}
                      </td>

                      {/* ESTADO */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                          background: admin.isActive ? '#f0fdf4' : '#fff7ed',
                          color: admin.isActive ? '#16a34a' : '#ea580c',
                        }}>
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: admin.isActive ? '#16a34a' : '#f97316',
                          }} />
                          {admin.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* CREADO */}
                      <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                        {formatDate(admin.createdAt)}
                      </td>

                      {/* ACCIONES */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => navigate(`/admin-users/${admin.id}/edit`)}
                            style={{
                              padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                              background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', cursor: 'pointer',
                            }}
                          >
                            Editar
                          </button>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                            <button
                              onClick={() => handleToggleStatus(admin)}
                              disabled={admin.id === userId}
                              style={{
                                padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                                background: admin.isActive ? '#fff7ed' : '#f0fdf4',
                                color: admin.isActive ? '#ea580c' : '#16a34a',
                                border: admin.isActive ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                                cursor: admin.id === userId ? 'not-allowed' : 'pointer',
                                opacity: admin.id === userId ? 0.4 : 1,
                              }}
                            >
                              {admin.isActive ? 'Inactivar' : 'Activar'}
                            </button>
                            {admin.id === userId && (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Tu cuenta</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Table footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', borderTop: '1px solid #f1f5f9',
          }}>
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Mostrando {startItem}–{endItem} de {filtered.length} administradores
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
    </RoleGuard>
  );
};

export default AdminUsersPage;
