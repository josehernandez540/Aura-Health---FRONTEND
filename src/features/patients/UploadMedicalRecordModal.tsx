import { useState, useRef } from 'react';
import { medicalRecordService } from './medicalRecord.service';

interface UploadMedicalRecordModalProps {
  isOpen: boolean;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadMedicalRecordModal = ({
  isOpen,
  patientId,
  patientName,
  onClose,
  onSuccess,
}: UploadMedicalRecordModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValidationError(null);
    setUploadError(null);

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setValidationError('Solo se permiten archivos PDF');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('El archivo no puede superar 10MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      await medicalRecordService.uploadRecord(patientId, selectedFile);
      onSuccess();
      onClose();
    } catch {
      setUploadError('Error al subir el archivo. Intente nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '480px',
          width: '100%',
          margin: '0 16px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
            Subir Historial Clínico
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            {patientName}
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #e2e8f0',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {selectedFile ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>✅</span>
              <span style={{ color: '#0d9488', fontWeight: '500', fontSize: '0.9rem' }}>
                {selectedFile.name}
              </span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📄</div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                Seleccionar archivo PDF
              </p>
            </>
          )}
        </div>

        {/* Validation error */}
        {validationError && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {validationError}
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '16px',
          }}>
            {uploadError}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={isUploading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#fff',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              fontWeight: '500',
              fontSize: '0.875rem',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#0d9488',
              color: '#fff',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: isUploading || !selectedFile ? 'not-allowed' : 'pointer',
              opacity: !selectedFile ? 0.5 : 1,
            }}
          >
            {isUploading ? 'Subiendo...' : 'Subir historial'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMedicalRecordModal;
