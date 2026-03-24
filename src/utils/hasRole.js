import { useAuthStore } from '../features/auth/store/auth.store';

export const hasRole = (allowedRoles = []) => {
    const role = useAuthStore.getState().role;

    if (!role) return false;

    return allowedRoles.includes(role);
};