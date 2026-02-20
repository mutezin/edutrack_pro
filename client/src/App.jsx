import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './context/ProtectedRoute';
import AuthLogin from './pages/AuthLogin';
import AuthSignup from './pages/AuthSignup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParentDashboard from './pages/ParentDashboard';
import ParentReport from './pages/ParentReport';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Reports from './pages/Reports';
import Performance from './pages/Performance';
import Alerts from './pages/Alerts';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

function AppLayout() {
  const { user, logout } = useAuth();

  const userInfo = {
    name: user?.name || 'User',
    email: user?.email || 'user@edutrack.pro'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userInfo={userInfo} onLogout={logout} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/report" element={<ParentReport />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <AuthSignup />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <AuthLogin />
              </PublicRoute>
            }
          />

          {/* Legacy Login (fallback) */}
          <Route path="/admin-login" element={<Login />} />

          {/* Protected Routes - Dashboard for all authenticated users */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for authenticated users - redirect to dashboard */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
