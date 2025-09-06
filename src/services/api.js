// API configuration and service layer for EMS backend
const API_BASE_URL = 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE operations)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  },
  
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  },
};

// Employee API
export const employeeAPI = {
  getAllEmployees: async () => {
    return apiRequest('/employees');
  },
  
  getEmployeeById: async (id) => {
    return apiRequest(`/employees/${id}`);
  },
  
  createEmployee: async (employeeData) => {
    return apiRequest('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  },
  
  updateEmployee: async (id, employeeData) => {
    return apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  },
  
  updateEmployeeStatus: async (id, status) => {
    return apiRequest(`/employees/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
  },
  
  deleteEmployee: async (id) => {
    return apiRequest(`/employees/${id}`, {
      method: 'DELETE',
    });
  },
  
  getEmployeesByDepartment: async (deptId) => {
    return apiRequest(`/employees/department/${deptId}`);
  },
  
  getEmployeesByRole: async (roleId) => {
    return apiRequest(`/employees/role/${roleId}`);
  },
};

// Department API
export const departmentAPI = {
  getAllDepartments: async () => {
    return apiRequest('/departments');
  },
  
  getDepartmentById: async (id) => {
    return apiRequest(`/departments/${id}`);
  },
  
  createDepartment: async (departmentData) => {
    return apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  },
  
  deleteDepartment: async (id) => {
    return apiRequest(`/departments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Role API
export const roleAPI = {
  getAllRoles: async () => {
    return apiRequest('/roles');
  },
  
  getRoleById: async (id) => {
    return apiRequest(`/roles/${id}`);
  },
  
  createRole: async (roleData) => {
    return apiRequest('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },
  
  deleteRole: async (id) => {
    return apiRequest(`/roles/${id}`, {
      method: 'DELETE',
    });
  },
};

// Leave Request API
export const leaveAPI = {
  getAllLeaveRequests: async () => {
    return apiRequest('/leave-requests');
  },
  
  getLeaveRequestsByEmployee: async (employeeId) => {
    return apiRequest(`/leave-requests/employee/${employeeId}`);
  },
  
  createLeaveRequest: async (leaveData) => {
    return apiRequest('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  },
  
  approveLeaveRequest: async (id, approverId) => {
    return apiRequest(`/leave-requests/${id}/approve/${approverId}`, {
      method: 'PUT',
    });
  },
  
  rejectLeaveRequest: async (id, approverId) => {
    return apiRequest(`/leave-requests/${id}/reject/${approverId}`, {
      method: 'PUT',
    });
  },
  
  deleteLeaveRequest: async (id) => {
    return apiRequest(`/leave-requests/${id}`, {
      method: 'DELETE',
    });
  },
};

// Attendance API
export const attendanceAPI = {
  punchIn: async (employeeId) => {
    return apiRequest(`/attendance/punch-in/${employeeId}`, {
      method: 'POST',
    });
  },
  
  punchOut: async (employeeId) => {
    return apiRequest(`/attendance/punch-out/${employeeId}`, {
      method: 'POST',
    });
  },
  
  getEmployeeAttendance: async (employeeId) => {
    return apiRequest(`/attendance/employee/${employeeId}`);
  },
  
  getAttendanceByDate: async (employeeId, date) => {
    return apiRequest(`/attendance/employee/${employeeId}/date/${date}`);
  },
  
  getMonthlyAttendance: async (employeeId, year, month) => {
    return apiRequest(`/attendance/employee/${employeeId}/monthly?year=${year}&month=${month}`);
  },
  
  getAllAttendance: async () => {
    return apiRequest('/attendance/all');
  },
  
  updateAttendance: async (id, attendanceData) => {
    return apiRequest(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
    });
  },
  
  deleteAttendance: async (id) => {
    return apiRequest(`/attendance/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utility functions
export const authUtils = {
  setAuthToken: (token) => {
    localStorage.setItem('authToken', token);
  },
  
  removeAuthToken: () => {
    localStorage.removeItem('authToken');
  },
  
  getAuthToken,
  
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

export default {
  authAPI,
  employeeAPI,
  departmentAPI,
  roleAPI,
  leaveAPI,
  attendanceAPI,
  authUtils,
};