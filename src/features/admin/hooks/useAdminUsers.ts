import { useState, useEffect } from "react";
import { getAdminUsers, updateAdminStatus, type AdminUser } from "../services/admin.service";
import { useAuthStore } from "../../auth/store/auth.store";
import { useUIStore } from "../../../store/ui.store";

export const useAdminUsers = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuthStore();
  const toast = useUIStore((state) => state.showToast);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers({ search });
      setAdmins(response.data.items || []);
    } catch (error) {
      toast("Error al cargar administradores", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      toast("Seguridad: No puedes desactivar tu propio usuario.", "error");
      return;
    }

    const newStatus = user.is_active ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateAdminStatus(user.id, newStatus);
      toast(`Usuario ${newStatus === 'ACTIVE' ? 'activado' : 'inactivado'}`, "success");
      fetchAdmins();
    } catch (error) {
      toast("Error al actualizar el estado", "error");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [search]);

  return { admins, loading, setSearch, toggleStatus, refresh: fetchAdmins };
};