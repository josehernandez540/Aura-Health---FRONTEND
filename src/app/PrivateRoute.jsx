import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/auth.store';
import { useEffect, useState } from 'react';

export default function PrivateRoute({ children }) {
  const {
    token,
    isAuthenticated,
    mustChangePassword,
    hasHydrated
  } = useAuthStore();

  if (!hasHydrated) return null;

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword) {
    if (window.location.pathname !== '/change-password') {
      return <Navigate to="/change-password" replace />;
    }
  }

  return children;
}