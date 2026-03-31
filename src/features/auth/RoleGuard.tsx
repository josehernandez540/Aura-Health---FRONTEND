import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from './hasRole';
import { useHasRole } from './hasRole';
 
interface RoleGuardProps {
  roles: UserRole | UserRole[];
  children: ReactNode;
  /**
   * Si redirect=true bloquea la ruta y redirige a /unauthorized.
   * Si redirect=false (default) solo oculta el contenido.
   */
  redirect?: boolean;
}
 
const RoleGuard = ({ roles, children, redirect = false }: RoleGuardProps) => {
  const allowed = useHasRole(roles);
 
  if (!allowed) {
    return redirect ? <Navigate to="/unauthorized" replace /> : null;
  }
 
  return <>{children}</>;
};
 
export default RoleGuard;