import { useAuthStore } from '../features/auth/store/auth.store';

export type Role = 'ADMIN' | 'DOCTOR' | string;

export const hasRole = (allowedRoles: Role[] = []): boolean => {
    const role = useAuthStore.getState().role;

    if (!role) return false;

    return allowedRoles.includes(role);
};