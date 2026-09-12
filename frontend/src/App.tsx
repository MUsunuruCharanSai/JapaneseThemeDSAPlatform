import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TimerProvider } from './contexts/TimerContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import UPISettings from './pages/UPISettings';
import ManagePayments from './pages/ManagePayments';
import CodingContest from './pages/CodingContest';
import AboutCreator from './pages/AboutCreator';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/upi-settings"
        element={
          <ProtectedRoute adminOnly>
            <UPISettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-payments"
        element={
          <ProtectedRoute adminOnly>
            <ManagePayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding-contest"
        element={
          <ProtectedRoute>
            <CodingContest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about-creator"
        element={
          <ProtectedRoute>
            <AboutCreator />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TimerProvider>
      <div className="App">
        <AppRoutes />
      </div>
      </TimerProvider>
    </AuthProvider>
  );
};

export default App;
