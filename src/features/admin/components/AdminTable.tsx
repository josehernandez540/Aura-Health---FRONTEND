import React from 'react';
import DataTable from "../../../components/common/Datatable/Datatable";
import Button from "../../../components/ui/Button/Button";
import { type AdminUser } from '../services/admin.service';
import { avatarColors, getInitials } from '../../../utils/tableUtils';

interface AdminTableProps {
  admins: AdminUser[];
  loading: boolean;
  onToggleStatus: (admin: AdminUser) => void;
  onEdit: (admin: AdminUser) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ admins, loading, onToggleStatus, onEdit }) => {
  
  const columns = [
    {
      header: "Usuario",
      key: "name",
      sortable: true,
      render: (admin: AdminUser, index: number) => (
        <div className="flex items-center gap-2">
          <div className="avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
            {getInitials(admin.name)}
          </div>
          <span className="truncate" style={{ fontWeight: 500 }}>{admin.name}</span>
        </div>
      )
    },
    { header: "Email", key: "email", sortable: true },
    {
      header: "Estado",
      key: "is_active",
      render: (admin: AdminUser) => (
        <label className="switch">
          <input 
            type="checkbox" 
            checked={admin.isActive} 
            onChange={() => onToggleStatus(admin)}
          />
          <span className="slider"></span>
        </label>
      )
    },
    {
      header: "Acciones",
      key: "actions",
      render: (admin: AdminUser) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => onEdit(admin)}>
            <img src="/icons/edit.svg" width={16} alt="edit" className="icon-img-color" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable 
      title="Gestión de Administradores"
      columns={columns}
      data={admins}
      isLoading={loading}
    />
  );
};

export default AdminTable;