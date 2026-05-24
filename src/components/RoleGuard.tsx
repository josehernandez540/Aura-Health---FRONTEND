import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import type { ReactNode } from 'react';

interface RoleGuardProps {
  roles: string | string[];
  redirect?: boolean;
  children: ReactNode;
}

const RoleGuard = ({ roles, redirect = false, children }: RoleGuardProps) => {
  const { role } = useAuthStore();
  const allowed = Array.isArray(roles) ? roles : [roles];

  if (!role || !allowed.includes(role)) {
    return redirect ? <Navigate to="/unauthorized" replace /> : null;
  }

  return <>{children}</>;
};

export default RoleGuard;
