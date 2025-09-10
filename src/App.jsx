// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Layout Components
import AdminLayout from './components/layouts/AdminLayout';
import ManagerLayout from './components/layouts/ManagerLayout';
import EmployeeLayout from './components/layouts/EmployeeLayout';

// Dashboard Components
import AdminDashboard from './pages/admin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';

// Admin Pages
import DepartmentManagement from './pages/admin/DepartmentManagement';
import RoleManagement from './pages/admin/RoleManagement';
import LeaveTypeManagement from './pages/admin/LeaveTypeManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import SalaryManagement from './pages/admin/SalaryManagement';
import EmailNotifications from './pages/admin/EmailNotifications';

// Manager Pages
import TeamAttendance from './pages/manager/TeamAttendance';
import LeaveApprovals from './pages/manager/LeaveApprovals';
import TeamManagement from './pages/manager/TeamManagement';

// Employee Pages
import MyAttendance from './pages/employee/MyAttendance';
import LeaveRequests from './pages/employee/LeaveRequests';
import Profile from './pages/employee/Profile';

// Services
import { authService } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized Component
const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">403</h1>
      <p className="text-xl text-gray-600 mt-4">Unauthorized Access</p>
      <p className="text-gray-500 mt-2">You don't have permission to access this page.</p>
    </div>
  </div>
);

// Loading Component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading check
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="departments" element={<DepartmentManagement />} />
                    <Route path="roles" element={<RoleManagement />} />
                    <Route path="leave-types" element={<LeaveTypeManagement />} />
                    <Route path="employees" element={<EmployeeManagement />} />
                    <Route path="salaries" element={<SalaryManagement />} />
                    <Route path="notifications" element={<EmailNotifications />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                <ManagerLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="team-attendance" element={<TeamAttendance />} />
                    <Route path="leave-approvals" element={<LeaveApprovals />} />
                    <Route path="team-management" element={<TeamManagement />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </ManagerLayout>
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER', 'ADMIN']}>
                <EmployeeLayout>
                  <Routes>
                    <Route path="dashboard" element={<EmployeeDashboard />} />
                    <Route path="attendance" element={<MyAttendance />} />
                    <Route path="leave-requests" element={<LeaveRequests />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </EmployeeLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route - Redirect based on role */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  authService.isAuthenticated()
                    ? authService.isAdmin()
                      ? '/admin/dashboard'
                      : authService.isManager()
                      ? '/manager/dashboard'
                      : '/employee/dashboard'
                    : '/login'
                }
                replace
              />
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;