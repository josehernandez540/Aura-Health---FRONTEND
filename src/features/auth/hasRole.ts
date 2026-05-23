import { useAuthStore } from './authStore';
 
export type UserRole = 'ADMIN' | 'MEDICO';
 
/**
 * Verifica si el usuario actual tiene alguno de los roles indicados.
 * Uso: hasRole('ADMIN') o hasRole(['ADMIN', 'MEDICO'])
 */
export const useHasRole = (roles: UserRole | UserRole[]): boolean => {
  const { role } = useAuthStore();
  if (!role) return false;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(role as UserRole);
};