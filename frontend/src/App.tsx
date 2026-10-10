import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { AdminLayout } from './components/layout/AdminLayout';
import { StudentLayout } from './components/layout/StudentLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AdmissionPage } from './pages/public/AdmissionPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';
import { StudentLoginPage } from './pages/public/StudentLoginPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdmissionsManagementPage } from './pages/admin/AdmissionsManagementPage';
import { StudentsManagementPage } from './pages/admin/StudentsManagementPage';
import { SeatMapPage } from './pages/admin/SeatMapPage';
import { FeeManagementPage } from './pages/admin/FeeManagementPage';
import { AttendanceManagementPage } from './pages/admin/AttendanceManagementPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentFeesPage } from './pages/student/StudentFeesPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Guard for Admin Routes
const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userType, isLoading } = useAuth();
  if (isLoading) return <div className="p-12 text-center text-xs">Verifying credentials...</div>;
  if (!user || userType !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Guard for Student Routes
const RequireStudent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userType, isLoading } = useAuth();
  if (isLoading) return <div className="p-12 text-center text-xs">Verifying credentials...</div>;
  if (!user || userType !== 'student') {
    return <Navigate to="/student/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/admission"
            element={
              <>
                <Navbar />
                <AdmissionPage />
              </>
            }
          />

          {/* Auth Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="admissions" element={<AdmissionsManagementPage />} />
            <Route path="students" element={<StudentsManagementPage />} />
            <Route path="seats" element={<SeatMapPage />} />
            <Route path="fees" element={<FeeManagementPage />} />
            <Route path="attendance" element={<AttendanceManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Protected Student Routes */}
          <Route
            path="/student"
            element={
              <RequireStudent>
                <StudentLayout />
              </RequireStudent>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
