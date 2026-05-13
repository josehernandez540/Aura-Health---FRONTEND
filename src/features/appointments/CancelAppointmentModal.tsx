import { useState } from 'react';
import { appointmentsService } from './appointments.service';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  patientName: string;
  appointmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CancelAppointmentModal = ({
  isOpen,
  patientName,
  appointmentId,
  onClose,
  onSuccess,
}: CancelAppointmentModalProps) => {
  const [reason, setReason]         = useState('');
  const [reasonError, setReasonError] = useState('');
  const [apiError, setApiError]     = useState('');
  const [isLoading, setIsLoading]   = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setReason('');
    setReasonError('');
    setApiError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    if (reason.trim().length < 10) {
      setReasonError('El motivo debe tener al menos 10 caracteres');
      return;
    }

    setReasonError('');
    setApiError('');
    setIsLoading(true);

    try {
      await appointmentsService.cancelAppointment(appointmentId, reason.trim());
      reset();
      onSuccess();
      onClose();
    } catch {
      setApiError('No se pudo cancelar la cita. Inténtelo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Card — stop propagation so overlay click doesn't fire when clicking inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '12px', padding: '28px',
          width: '100%', maxWidth: '480px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Warning icon */}
        <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '12px' }}>
          ⚠️
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
            Cancelar cita
          </h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Cita de <strong style={{ color: '#64748b' }}>{patientName}</strong>
          </p>
        </div>

        {/* Reason textarea */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block', fontSize: '0.8rem', fontWeight: '600',
            color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Motivo de cancelación
          </label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); if (reasonError) setReasonError(''); }}
            placeholder="Describa el motivo de la cancelación..."
            rows={4}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: `1px solid ${reasonError ? '#fca5a5' : '#e2e8f0'}`,
              fontSize: '0.875rem', color: '#0f172a', outline: 'none',
              resize: 'vertical', minHeight: '100px',
              boxSizing: 'border-box', fontFamily: 'sans-serif',
            }}
          />
          {reasonError && (
            <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#dc2626' }}>
              {reasonError}
            </p>
          )}
        </div>

        {/* API error */}
        {apiError && (
          <div style={{
            padding: '10px 14px', borderRadius: '8px', background: '#fef2f2',
            border: '1px solid #fca5a5', color: '#dc2626', fontSize: '0.8rem',
            marginBottom: '20px',
          }}>
            {apiError}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClose}
            disabled={isLoading}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500',
              background: '#fff', color: '#64748b', border: '1px solid #e2e8f0',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600',
              background: '#dc2626', color: '#fff', border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Cancelando...' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
