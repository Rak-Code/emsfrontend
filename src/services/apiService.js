// src/services/apiService.js

import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API calls
  async makeRequest(url, options = {}) {
    const config = {
      headers: authService.getAuthHeaders(),
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Department APIs
  async getDepartments() {
    return this.makeRequest('/departments');
  }

  async getDepartmentById(id) {
    return this.makeRequest(`/departments/${id}`);
  }

  async createDepartment(data) {
    return this.makeRequest('/departments', {
      method: 'POST',
      body: data,
    });
  }

  async updateDepartment(id, data) {
    return this.makeRequest(`/departments/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteDepartment(id) {
    return this.makeRequest(`/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Role APIs
  async getRoles() {
    return this.makeRequest('/roles');
  }

  async getRoleById(id) {
    return this.makeRequest(`/roles/${id}`);
  }

  async createRole(data) {
    return this.makeRequest('/roles', {
      method: 'POST',
      body: data,
    });
  }

  async updateRole(id, data) {
    return this.makeRequest(`/roles/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteRole(id) {
    return this.makeRequest(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // Leave Type APIs
  async getLeaveTypes() {
    return this.makeRequest('/leave-types');
  }

  async getLeaveTypeById(id) {
    return this.makeRequest(`/leave-types/${id}`);
  }

  async createLeaveType(data) {
    return this.makeRequest('/leave-types', {
      method: 'POST',
      body: data,
    });
  }

  async updateLeaveType(id, data) {
    return this.makeRequest(`/leave-types/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteLeaveType(id) {
    return this.makeRequest(`/leave-types/${id}`, {
      method: 'DELETE',
    });
  }

  // Employee APIs
  async getEmployees() {
    return this.makeRequest('/employees');
  }

  async getEmployeeById(id) {
    return this.makeRequest(`/employees/${id}`);
  }

  async getEmployeesByDepartment(departmentId) {
    return this.makeRequest(`/employees/department/${departmentId}`);
  }

  async getEmployeesByRole(roleId) {
    return this.makeRequest(`/employees/role/${roleId}`);
  }

  async createEmployee(data) {
    return this.makeRequest('/employees', {
      method: 'POST',
      body: data,
    });
  }

  async updateEmployee(id, data) {
    return this.makeRequest(`/employees/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async updateEmployeeStatus(id, status) {
    return this.makeRequest(`/employees/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
  }

  async deleteEmployee(id) {
    return this.makeRequest(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance APIs
  async punchIn(employeeId) {
    return this.makeRequest(`/attendance/punch-in/${employeeId}`, {
      method: 'POST',
    });
  }

  async punchOut(employeeId) {
    return this.makeRequest(`/attendance/punch-out/${employeeId}`, {
      method: 'POST',
    });
  }

  async getAttendanceByEmployeeAndDate(employeeId, date) {
    return this.makeRequest(`/attendance/employee/${employeeId}/date/${date}`);
  }

  async getAttendanceByEmployee(employeeId) {
    return this.makeRequest(`/attendance/employee/${employeeId}`);
  }

  async getAttendanceByDateRange(employeeId, startDate, endDate) {
    return this.makeRequest(`/attendance/employee/${employeeId}/range?startDate=${startDate}&endDate=${endDate}`);
  }

  async getMonthlyAttendance(employeeId, year, month) {
    return this.makeRequest(`/attendance/employee/${employeeId}/monthly?year=${year}&month=${month}`);
  }

  async getDailyAttendance(date) {
    return this.makeRequest(`/attendance/daily/${date}`);
  }

  async getAllAttendance() {
    return this.makeRequest('/attendance/all');
  }

  async updateAttendance(id, data) {
    return this.makeRequest(`/attendance/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteAttendance(id) {
    return this.makeRequest(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  // Leave Request APIs
  async getLeaveRequests() {
    return this.makeRequest('/leave-requests');
  }

  async getLeaveRequestsByEmployee(employeeId) {
    return this.makeRequest(`/leave-requests/employee/${employeeId}`);
  }

  async createLeaveRequest(data) {
    return this.makeRequest('/leave-requests', {
      method: 'POST',
      body: data,
    });
  }

  async approveLeaveRequest(id, approverId) {
    return this.makeRequest(`/leave-requests/${id}/approve/${approverId}`, {
      method: 'PUT',
    });
  }

  async rejectLeaveRequest(id, approverId) {
    return this.makeRequest(`/leave-requests/${id}/reject/${approverId}`, {
      method: 'PUT',
    });
  }

  async deleteLeaveRequest(id) {
    return this.makeRequest(`/leave-requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Salary APIs
  async getSalaries() {
    return this.makeRequest('/salaries');
  }

  async getSalaryById(id) {
    return this.makeRequest(`/salaries/${id}`);
  }

  async getSalariesByEmployee(employeeId) {
    return this.makeRequest(`/salaries/employee/${employeeId}`);
  }

  async createSalary(data) {
    return this.makeRequest('/salaries', {
      method: 'POST',
      body: data,
    });
  }

  async updateSalary(id, data) {
    return this.makeRequest(`/salaries/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deactivateSalary(id) {
    return this.makeRequest(`/salaries/${id}/deactivate`, {
      method: 'PUT',
    });
  }

  async deleteSalary(id) {
    return this.makeRequest(`/salaries/${id}`, {
      method: 'DELETE',
    });
  }

  // Email Notification APIs
  async getEmailNotifications() {
    return this.makeRequest('/email-notifications');
  }

  async getEmailNotificationById(id) {
    return this.makeRequest(`/email-notifications/${id}`);
  }

  async getEmailNotificationsByRecipient(email) {
    return this.makeRequest(`/email-notifications/recipient/${email}`);
  }

  async createEmailNotification(data) {
    return this.makeRequest('/email-notifications', {
      method: 'POST',
      body: data,
    });
  }

  async deleteEmailNotification(id) {
    return this.makeRequest(`/email-notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();