import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/index';
import { initializeAuth } from './store/authSlice';

// Layout Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';

// CSS
import './App.css';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Employee Management */}
          <Route path="employees" element={<Employees />} />
          <Route 
            path="employees/new" 
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <EmployeeForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="employees/edit/:id" 
            element={
              <ProtectedRoute requiredRole="MANAGER">
                <EmployeeForm />
              </ProtectedRoute>
            } 
          />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          
          {/* Placeholder routes for future features */}
          <Route 
            path="attendance" 
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Attendance Management</h2>
                <p className="text-gray-600">This feature will be implemented in the next phase.</p>
              </div>
            } 
          />
          <Route 
            path="leave-requests" 
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Leave Requests</h2>
                <p className="text-gray-600">This feature will be implemented in the next phase.</p>
              </div>
            } 
          />
          <Route 
            path="departments" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Department Management</h2>
                  <p className="text-gray-600">This feature will be implemented in the next phase.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="roles" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Role Management</h2>
                  <p className="text-gray-600">This feature will be implemented in the next phase.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="salary" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Salary Management</h2>
                  <p className="text-gray-600">This feature will be implemented in the next phase.</p>
                </div>
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a 
                  href="/dashboard" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
