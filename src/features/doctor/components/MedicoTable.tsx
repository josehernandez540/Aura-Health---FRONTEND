import React from 'react';
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { type Doctor } from '../services/doctor.service';

interface MedicoTableProps {
  medicos: Doctor[];
  loading: boolean;
  onToggleStatus: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const MedicoTable: React.FC<MedicoTableProps> = ({ 
  medicos, 
  loading, 
  onToggleStatus, 
  onView, 
  onEdit  
}) => {

  const avatarColors = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ec4899"];

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  };

  const columns = [
    {
      header: "Nombre",
      key: "name",
      width: "30%",
      sortable: true,
      render: (medico: Doctor, index: number) => (
        <div className="flex items-center gap-2">
          <div className="avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
            {getInitials(medico.name)}
          </div>
          <span className="truncate" style={{ fontWeight: 500 }}>{medico.name}</span>
        </div>
      )
    },
    { header: "Especialidad", key: "specialization", sortable: true },
    { header: "Email", key: "users.email", sortable: true },
    {
      header: "Estado",
      key: "is_active",
      width: "80px",
      render: (medico: Doctor) => (
        <label className="switch">
          <input 
            type="checkbox" 
            checked={medico.is_active} 
            onChange={() => onToggleStatus(medico.id)}
          />
          <span className="slider"></span>
        </label>
      )
    },
    {
      header: "Acciones",
      key: "actions",
      width: "120px",
      render: (medico: Doctor) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onView(medico.id)}>
             <img src="icons/info.svg" width={16} alt="info" className="icon-img-color" />
          </Button>
          <Button variant="ghost" onClick={() => onEdit(medico.id)}>
             <img src="icons/edit.svg" width={16} alt="edit" className="icon-img-color" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      title="Lista de Personal Médico"
      columns={columns}
      data={medicos}
      isLoading={loading}
      rowsPerPage={4}
    />
  );
};

export default MedicoTable;