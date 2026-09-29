import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg, #f4f5f2)',
        color: '#1a1e1b',
        fontFamily: 'var(--font-main, sans-serif)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid #e0e4dd',
          borderTopColor: '#6f8e75',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#68726b', fontWeight: 500 }}>
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If role doesn't match, redirect to respective home workspace
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/overview" replace />;
    }
    if (user.role === 'MANAGER') {
      return <Navigate to="/manager/overview" replace />;
    }
    return <Navigate to="/app/home" replace />;
  }

  return <>{children}</>;
};
