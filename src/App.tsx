import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth/AuthContext';
import { HealthDataProvider } from './services/health/HealthDataContext';
import { ProtectedRoute } from './services/auth/ProtectedRoute';

// Layouts
import { AppLayout, ManagerLayout, AdminLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// User Pages
import { UserHomePage } from './pages/user/UserHomePage';
import { UserHealthPage } from './pages/user/UserHealthPage';
import { UserActivityPage } from './pages/user/UserActivityPage';
import { UserHeatRiskPage } from './pages/user/UserHeatRiskPage';
import { UserAlertsPage } from './pages/user/UserAlertsPage';
import { UserDevicePage } from './pages/user/UserDevicePage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { UserEmergencyPage } from './pages/user/UserEmergencyPage';

// Manager Pages
import { ManagerOverviewPage } from './pages/manager/ManagerOverviewPage';
import { ManagerWorkersPage } from './pages/manager/ManagerWorkersPage';
import { ManagerWorkerDetailPage } from './pages/manager/ManagerWorkerDetailPage';
import { ManagerAlertsPage } from './pages/manager/ManagerAlertsPage';
import { ManagerReportsPage } from './pages/manager/ManagerReportsPage';
import { ManagerEnvironmentPage } from './pages/manager/ManagerEnvironmentPage';
import { ManagerSettingsPage } from './pages/manager/ManagerSettingsPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';

const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e0e4dd', borderTopColor: '#6f8e75', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/overview" replace />;
  }
  if (user.role === 'MANAGER') {
    return <Navigate to="/manager/overview" replace />;
  }
  return <Navigate to="/app/home" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HealthDataProvider>
          <Routes>
            {/* Root & Auth Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Worker Application Workspace */}
            <Route
              path="/app"
              element={
                <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'ADMIN']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/home" replace />} />
              <Route path="home" element={<UserHomePage />} />
              <Route path="health" element={<UserHealthPage />} />
              <Route path="activity" element={<UserActivityPage />} />
              <Route path="heat-risk" element={<UserHeatRiskPage />} />
              <Route path="alerts" element={<UserAlertsPage />} />
              <Route path="device" element={<UserDevicePage />} />
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="emergency" element={<UserEmergencyPage />} />
            </Route>

            {/* Manager Safety Workspace */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/manager/overview" replace />} />
              <Route path="overview" element={<ManagerOverviewPage />} />
              <Route path="workers" element={<ManagerWorkersPage />} />
              <Route path="workers/:id" element={<ManagerWorkerDetailPage />} />
              <Route path="alerts" element={<ManagerAlertsPage />} />
              <Route path="reports" element={<ManagerReportsPage />} />
              <Route path="environment" element={<ManagerEnvironmentPage />} />
              <Route path="settings" element={<ManagerSettingsPage />} />
            </Route>

            {/* Admin Enterprise Workspace */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<AdminOverviewPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HealthDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
