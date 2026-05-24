import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from './patient.service';
import type { Patient } from './patient.service';
import TogglePatientModal from './TogglePatientModal';

const ITEMS_PER_PAGE = 8;

type FilterKey = 'Todos' | 'Activos' | 'Inactivos';
const FILTERS: FilterKey[] = ['Todos', 'Activos', 'Inactivos'];

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

const PatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toggleModal, setToggleModal] = useState(false);
  const [togglingPatient, setTogglingPatient] = useState<{ id: string; name: string; isActive: boolean } | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('Todos');
  const [page, setPage] = useState(1);

  const fetchPatients = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await patientService.getPatients();
      if (response.success) {
        const mapped = response.data.items.map((p) => ({
          id: p.id,
          name: p.name,
          documentNumber: p.document_number,
          birthDate: p.birth_date,
          phone: p.phone,
          email: p.email,
          isActive: p.is_active,
          createdAt: p.created_at,
        }));
        setPatients(mapped);
      }
    } catch {
      setErrorMessage('No se pudieron cargar los pacientes. Verifique su conexión e intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const loadPatients = fetchPatients;

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.documentNumber.toLowerCase().includes(search.toLowerCase());

    let matchFilter = true;
    if (filter === 'Activos') matchFilter = p.isActive;
    else if (filter === 'Inactivos') matchFilter = !p.isActive;

    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalActivos = patients.filter((p) => p.isActive).length;
  const totalInactivos = patients.filter((p) => !p.isActive).length;

  const stats = [
    { label: 'Total Pacientes', value: patients.length, borderColor: '#0d9488' },
    { label: 'Activos', value: totalActivos, borderColor: '#0d9488' },
    { label: 'Inactivos', value: totalInactivos, borderColor: '#f97316' },
  ];

  const startItem = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, filtered.length);

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>
            Gestión de Pacientes
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Inicio / Pacientes
          </p>
        </div>
        <button
          onClick={() => navigate('/pacientes/create')}
          style={{
            padding: '10px 20px', borderRadius: '8px', background: '#0d9488',
            color: '#fff', fontWeight: '600', fontSize: '0.875rem',
            border: 'none', cursor: 'pointer',
          }}
        >
          + Nuevo Paciente
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
          placeholder="Buscar por nombre o documento..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
            fontSize: '0.875rem', outline: 'none', background: '#fff',
            width: '280px', color: '#0f172a',
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
              {['PACIENTE', 'DOCUMENTO', 'EMAIL', 'TELÉFONO', 'ESTADO', 'ACCIONES'].map((col) => (
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Cargando pacientes...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No hay pacientes registrados
                </td>
              </tr>
            ) : (
              paginated.map((patient, idx) => (
                <tr
                  key={patient.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  {/* PACIENTE */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: avatarColors[getInitial(patient.name)] ?? '#0d9488',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0,
                      }}>
                        {getInitial(patient.name)}
                      </div>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>
                        {patient.name}
                      </div>
                    </div>
                  </td>

                  {/* DOCUMENTO */}
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>
                    {patient.documentNumber}
                  </td>

                  {/* EMAIL */}
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>
                    {patient.email}
                  </td>

                  {/* TELÉFONO */}
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                    {patient.phone}
                  </td>

                  {/* ESTADO */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '500',
                      background: patient.isActive ? '#f0fdf4' : '#fff7ed',
                      color: patient.isActive ? '#16a34a' : '#ea580c',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: patient.isActive ? '#16a34a' : '#f97316',
                      }} />
                      {patient.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/pacientes/${patient.id}/edit`)}
                        style={{
                          padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                          background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4', cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setTogglingPatient({ id: patient.id, name: patient.name, isActive: patient.isActive });
                          setToggleModal(true);
                        }}
                        style={{
                          padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                          background: patient.isActive ? '#fff7ed' : '#f0fdf4',
                          color: patient.isActive ? '#ea580c' : '#16a34a',
                          border: patient.isActive ? '1px solid #fed7aa' : '1px solid #bbf7d0',
                          cursor: 'pointer',
                        }}
                      >
                        {patient.isActive ? 'Inactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderTop: '1px solid #f1f5f9',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Mostrando {startItem}–{endItem} de {filtered.length} pacientes
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

      {toggleModal && togglingPatient && (
        <TogglePatientModal
          isOpen={toggleModal}
          patientName={togglingPatient.name}
          isActive={togglingPatient.isActive}
          patientId={togglingPatient.id}
          onClose={() => { setToggleModal(false); setTogglingPatient(null); }}
          onSuccess={() => { setToggleModal(false); setTogglingPatient(null); loadPatients(); }}
        />
      )}
    </div>
  );
};

export default PatientsPage;
