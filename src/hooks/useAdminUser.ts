import { useState, useEffect } from 'react';
import { adminUserService } from '../features/admin-users/adminUser.service';
import type { AdminUser } from '../features/admin-users/adminUser.service';

export const useAdminUser = (id: string | undefined) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAdminUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminUserService.getAdminUser(id);
        if (response.success) setAdminUser(response.data);
      } catch {
        setError('No se pudo cargar la información del administrador.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminUser();
  }, [id]);

  return { adminUser, isLoading, error };
};
