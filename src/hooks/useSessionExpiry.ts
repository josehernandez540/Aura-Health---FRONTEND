import { useEffect, useRef } from 'react';
import { useAuthStore } from '../features/auth/authStore';

const TOKEN_KEY = 'aura_token';

/**
 * Decodifica el payload del JWT sin verificar firma.
 * Solo para leer la fecha de expiración en el cliente.
 */
const decodeTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.exp ? decoded.exp * 1000 : null; // convertir a ms
  } catch {
    return null;
  }
};

/**
 * Hook que detecta proactivamente la expiración del JWT
 * y cierra la sesión automáticamente cuando expira.
 */
export const useSessionExpiry = (onExpire?: () => void) => {
  const { token, clearAuth } = useAuthStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpiar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!token) return;

    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return;

    const expiryMs = decodeTokenExpiry(storedToken);
    if (!expiryMs) return;

    const timeUntilExpiry = expiryMs - Date.now();

    // Si ya expiró, cerrar sesión inmediatamente
    if (timeUntilExpiry <= 0) {
      clearAuth();
      onExpire?.();
      return;
    }

    // Programar cierre de sesión cuando expire
    timerRef.current = setTimeout(() => {
      clearAuth();
      onExpire?.();
    }, timeUntilExpiry);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [token, clearAuth, onExpire]);
};