export const DoctorDetailModal = ({ doctor, onClose }) => {
  if (!doctor) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Detalle del Médico">
      <div className="detail-grid">
        <p><strong>Nombre:</strong> {doctor.name}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Especialidad:</strong> {doctor.specialization}</p>
        <p><strong>Documento:</strong> {doctor.documentNumber}</p>
        <p><strong>Licencia:</strong> {doctor.licenseNumber}</p>
        <p><strong>Teléfono:</strong> {doctor.phone}</p>
        <p><strong>Estado:</strong> {doctor.is_active ? "Activo" : "Inactivo"}</p>
      </div>
    </Modal>
  );
};

