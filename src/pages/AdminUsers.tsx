import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button/Button';
import SearchInput from '../components/ui/Inputs/SearchInput';
import { useAdminUsers } from '../features/admin/hooks/useAdminUsers';
import AdminFormModal from '../features/admin/components/AdminFormModal';
import AdminTable from '../features/admin/components/AdminTable';
import { type AdminUser } from '../features/admin/services/admin.service';

const AdminUsersPage: React.FC = () => {
  const { admins, loading, setSearch, toggleStatus, refresh } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <PageHeader 
        title="Administradores" 
        subtitle="Gestiona el acceso de los gestores del sistema"
      >
        <Button variant="primary" onClick={handleCreate}>
          Crear Admin
        </Button>
      </PageHeader>

      <div style={{ marginBottom: '1rem' }}>
        <SearchInput 
          placeholder="Buscar por email..." 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <AdminTable 
        admins={admins}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={toggleStatus}
      />

      <AdminFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refresh}
        selectedAdmin={selectedAdmin}
      />
    </div>
  );
};

export default AdminUsersPage;