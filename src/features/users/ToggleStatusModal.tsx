import { useState } from 'react';
import { usersService } from './users.service';

interface ToggleStatusModalProps {
  isOpen: boolean;
  doctorName: string;
  isActive: boolean;
  doctorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ToggleStatusModal = ({ isOpen, doctorName, isActive, doctorId, onClose, onSuccess }: ToggleStatusModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      await usersService.toggleStatus(doctorId, !isActive);
      onSuccess();
      onClose();
    } catch {
      setErrorMessage(`No se pudo ${isActive ? 'inactivar' : 'activar'} al médico. Intente nuevamente.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '440px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}>
        {/* Ícono */}
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
          {isActive ? '⚠️' : '✅'}
        </div>

        {/* Título */}
        <h2 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
          {isActive ? '¿Inactivar médico?' : '¿Activar médico?'}
        </h2>

        {/* Subtítulo */}
        <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
          {isActive
            ? `El médico ${doctorName} perderá acceso al sistema inmediatamente.`
            : `El médico ${doctorName} podrá iniciar sesión nuevamente.`}
        </p>

        {/* Error */}
        {errorMessage && (
          <p style={{
            margin: '0 0 16px',
            fontSize: '0.85rem',
            color: '#dc2626',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            padding: '10px 14px',
          }}>
            {errorMessage}
          </p>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              fontFamily: 'sans-serif',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: '8px',
              background: isActive ? '#f97316' : '#0d9488',
              color: '#fff',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
              fontFamily: 'sans-serif',
            }}
          >
            {isProcessing ? '...' : isActive ? 'Sí, inactivar' : 'Sí, activar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusModal;
