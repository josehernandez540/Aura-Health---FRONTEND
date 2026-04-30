import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUserSchema, type AdminUserFormData } from '../schemas/admin.schema';
import Modal from '../../../components/ui/Modal/Modal';
import Button from '../../../components/ui/Button/Button';
import { createAdminUser, updateAdminUser } from '../services/admin.service';
import { type AdminUser } from '../services/admin.service';
import { useUIStore } from '../../../store/ui.store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedAdmin?: AdminUser | null;
}

const AdminFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, selectedAdmin }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: selectedAdmin || { name: '', email: '' }
  });
  const toast = useUIStore((state) => state.showToast);
  
  const onSubmit = async (data: AdminUserFormData) => {
    try {
      if (selectedAdmin) {
        await updateAdminUser(selectedAdmin.id, data);
        toast("Administrador actualizado", "success");
      } else {
        await createAdminUser(data);
        toast("Admin creado. Se envió la contraseña al correo.", "success");
      }
      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      toast("Error al crear el administrador", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={selectedAdmin ? "Editar Admin" : "Nuevo Administrador"}>
      <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
        <div className="form-group">
          <label className="form-label">Nombre Completo</label>
          <input {...register("name")} className="form-control" placeholder="Ej: Carlos Pérez" />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <input {...register("email")} className="form-control" placeholder="admin@aura.com" />
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : selectedAdmin ? "Actualizar" : "Crear Administrador"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminFormModal;