import React from 'react';
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { type Patient } from '../services/patient.services';
import { avatarColors, getInitials } from '../../../utils/tableUtils';
import { useNavigate } from 'react-router-dom';


interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onToggleStatus: (id: string) => void;
  onEdit: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, loading, onToggleStatus, onEdit }) => {
  const navigate = useNavigate();
  
  
  const columns = [
    {
      header: "Nombre",
      key: "name",
      sortable: true,
      render: (patient: Patient, index: number) => (
        <div className="flex items-center gap-2">
          <div className="avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
            {getInitials(patient.name)}
          </div>
          <span className="truncate" style={{ fontWeight: 500 }}>{patient.name}</span>
        </div>
      )
    },
    { header: "Documento", key: "document_number", sortable: true,},
    { header: "Email", key: "email", sortable: true, },
    {
      header: "Estado",
      key: "is_active",
      render: (patient: Patient) => (
        <label className="switch">
          <input 
            type="checkbox" 
            checked={patient.is_active} 
            onChange={() => onToggleStatus(patient.id)}
          />
          <span className="slider"></span>
        </label>
      )
    },
    {
      header: "Acciones",
      key: "actions",
      render: (patient: Patient) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onEdit(patient)}>
            <img src="icons/edit.svg" width={16} alt="edit" className="icon-img-color" />
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/patients/${patient.id}`)}>
            <img src="icons/info.svg" width={16} alt="info" className="icon-img-color" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      title="Listado de Pacientes"
      columns={columns}
      data={patients}
      isLoading={loading}
    />
  );
};

export default PatientTable;