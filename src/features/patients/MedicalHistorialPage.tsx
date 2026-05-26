import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { medicalRecordService } from './medicalRecord.service';
import type { PatientHistorial, MedicalRecord } from './medicalRecord.service';
import UploadMedicalRecordModal from './UploadMedicalRecordModal';

const riskBadgeStyle = (riskLevel?: string): React.CSSProperties => {
  if (riskLevel === 'HIGH') return { background: '#fef2f2', color: '#dc2626' };
  if (riskLevel === 'MEDIUM') return { background: '#fff7ed', color: '#ea580c' };
  return { background: '#f0fdf4', color: '#16a34a' };
};

const riskLabel = (riskLevel?: string) => {
  if (riskLevel === 'HIGH') return 'Alto';
  if (riskLevel === 'MEDIUM') return 'Medio';
  if (riskLevel === 'LOW') return 'Bajo';
  return riskLevel ?? '—';
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
};

const MedicalHistorialPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState<PatientHistorial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const fetchHistorial = async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const data = await medicalRecordService.getHistorial(patientId);
      setHistorial(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [patientId]);

  const handleDownload = (record: MedicalRecord) => {
    medicalRecordService.downloadRecord(record.id);
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <button
            onClick={() => navigate('/pacientes')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '0.875rem',
              padding: '0 0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Volver
          </button>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>
            Historial Clínico
          </h1>
          {historial && (
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
              {historial.patient.name}
            </p>
          )}
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#0d9488',
            color: '#fff',
            fontWeight: '600',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            marginTop: '28px',
          }}
        >
          Subir PDF
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Cargando historial...</p>
      )}

      {!isLoading && historial && (
        <>
          {/* Patient info card */}
          <div style={{
            background: '#0d2137',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#ffffff', marginBottom: '4px' }}>
                {historial.patient.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                Documento: {historial.patient.documentNumber}
              </div>
            </div>
            {historial.patient.riskLevel && (
              <span style={{
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: '600',
                ...riskBadgeStyle(historial.patient.riskLevel),
              }}>
                Riesgo {riskLabel(historial.patient.riskLevel)}
              </span>
            )}
          </div>

          {/* Records list */}
          {historial.medicalRecords.length === 0 ? (
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📂</div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                No hay registros médicos. Sube el primer historial clínico.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {historial.medicalRecords.map((record) => (
                <div
                  key={record.id}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <span style={{ fontSize: '1.75rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.9rem' }}>
                      Registro médico
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                      {formatDate(record.createdAt)}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: record.source === 'EXTERNAL' ? '#eff6ff' : '#f0fdf4',
                    color: record.source === 'EXTERNAL' ? '#1d4ed8' : '#16a34a',
                  }}>
                    {record.source === 'EXTERNAL' ? 'EXTERNO' : 'INTERNO'}
                  </span>
                  <button
                    onClick={() => handleDownload(record)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#0d9488',
                      color: '#fff',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Descargar PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {historial && uploadModalOpen && (
        <UploadMedicalRecordModal
          isOpen={uploadModalOpen}
          patientId={historial.patient.id}
          patientName={historial.patient.name}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={() => {
            setUploadModalOpen(false);
            fetchHistorial();
          }}
        />
      )}
    </div>
  );
};

export default MedicalHistorialPage;
