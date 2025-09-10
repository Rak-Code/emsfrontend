import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { authService } from '../../services/authService';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [stats, setStats] = useState({
    totalLeavesThisMonth: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    attendancePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    fetchEmployeeDashboardData();
    checkTodayAttendance();
  }, []);

  const fetchEmployeeDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      // Fetch employee data
      const employeeResponse = await apiService.getAllEmployees();
      const currentEmployee = employeeResponse.data?.find(emp => emp.user?.username === user.username);
      setEmployeeData(currentEmployee);
      
      // Fetch attendance history
      const attendanceResponse = await apiService.getAllAttendance();
      const userAttendance = (attendanceResponse.data || []).filter(
        attendance => attendance.employee?.id === currentEmployee?.id
      );
      setAttendanceData(userAttendance);
      
      // Fetch leave requests
      const leavesResponse = await apiService.getAllLeaveRequests();
      const userLeaves = (leavesResponse.data || []).filter(
        leave => leave.employee?.id === currentEmployee?.id
      );
      setLeaveRequests(userLeaves);
      
      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthLeaves = userLeaves.filter(leave => {
        const leaveDate = new Date(leave.startDate);
        return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear;
      });
      
      const pendingLeaves = userLeaves.filter(leave => leave.status === 'PENDING');
      const approvedLeaves = userLeaves.filter(leave => leave.status === 'APPROVED');
      
      // Calculate attendance percentage (simplified)
      const attendancePercentage = userAttendance.length > 0 ? 85 : 0; // Mock calculation
      
      setStats({
        totalLeavesThisMonth: thisMonthLeaves.length,
        pendingLeaves: pendingLeaves.length,
        approvedLeaves: approvedLeaves.length,
        attendancePercentage
      });
      
    } catch (error) {
      console.error('Error fetching employee dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toDateString();
      const attendanceResponse = await apiService.getAllAttendance();
      const todayRecord = (attendanceResponse.data || []).find(attendance => {
        const attendanceDate = new Date(attendance.date).toDateString();
        return attendanceDate === today && attendance.employee?.user?.username === authService.getCurrentUser()?.username;
      });
      
      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setIsCheckedIn(true);
      }
    } catch (error) {
      console.error('Error checking today\'s attendance:', error);
    }
  };

  const handlePunchIn = async () => {
    try {
      const attendanceData = {
        employeeId: employeeData?.id,
        date: new Date().toISOString().split('T')[0],
        checkInTime: new Date().toISOString(),
        status: 'PRESENT'
      };
      
      await apiService.createAttendance(attendanceData);
      setIsCheckedIn(true);
      checkTodayAttendance();
      fetchEmployeeDashboardData();
    } catch (error) {
      console.error('Error punching in:', error);
    }
  };

  const handlePunchOut = async () => {
    try {
      if (todayAttendance) {
        const updatedAttendance = {
          ...todayAttendance,
          checkOutTime: new Date().toISOString()
        };
        
        await apiService.updateAttendance(todayAttendance.id, updatedAttendance);
        setIsCheckedIn(false);
        checkTodayAttendance();
      }
    } catch (error) {
      console.error('Error punching out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {employeeData?.firstName?.charAt(0)}{employeeData?.lastName?.charAt(0)}
              </div>
            </div>
            <div className="ml-5">
              <h1 className="text-2xl font-bold">
                Welcome back, {employeeData?.firstName} {employeeData?.lastName}!
              </h1>
              <p className="mt-1 text-blue-100">
                {employeeData?.position} • {employeeData?.department?.name}
              </p>
              <p className="text-sm text-blue-200">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Punch In/Out Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Status</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              {!isCheckedIn ? (
                <button
                  onClick={handlePunchIn}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Punch In
                </button>
              ) : (
                <button
                  onClick={handlePunchOut}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Punch Out
                </button>
              )}
              {todayAttendance && (
                <div className="mt-2 text-xs text-gray-500">
                  Check-in: {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
                  {todayAttendance.checkOutTime && (
                    <span> • Check-out: {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apply Leave Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Quick Action</dt>
                  <dd className="text-lg font-medium text-gray-900">Apply for Leave</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Apply Leave
              </button>
            </div>
          </div>
        </div>

        {/* View Payslip Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Payroll</dt>
                  <dd className="text-lg font-medium text-gray-900">View Payslip</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Payslip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Attendance %</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.attendancePercentage}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Leaves</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingLeaves}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved Leaves</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.approvedLeaves}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Leaves This Month</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalLeavesThisMonth}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Attendance</h3>
            <div className="mt-4">
              {attendanceData.length === 0 ? (
                <p className="text-sm text-gray-500">No attendance records found</p>
              ) : (
                <div className="space-y-3">
                  {attendanceData.slice(0, 5).map((attendance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(attendance.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attendance.checkInTime && `In: ${new Date(attendance.checkInTime).toLocaleTimeString()}`}
                          {attendance.checkOutTime && ` • Out: ${new Date(attendance.checkOutTime).toLocaleTimeString()}`}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        attendance.status === 'PRESENT' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendance.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Leave Requests</h3>
            <div className="mt-4">
              {leaveRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No leave requests found</p>
              ) : (
                <div className="space-y-3">
                  {leaveRequests.slice(0, 4).map((leave) => (
                    <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{leave.reason}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          leave.status === 'APPROVED' 
                            ? 'bg-green-100 text-green-800'
                            : leave.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Profile Summary */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Summary</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.employeeId || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.phone || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.department?.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="mt-1 text-sm text-gray-900">{employeeData?.position || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Join Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {employeeData?.hireDate ? new Date(employeeData.hireDate).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;