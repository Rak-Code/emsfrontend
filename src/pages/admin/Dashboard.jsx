// src/pages/admin/Dashboard.jsx

import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle
} from 'lucide-react';
import apiService from '../../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    totalSalaries: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const [employees, departments, leaveRequests, salaries, attendance] = await Promise.all([
        apiService.getEmployees().catch(() => []),
        apiService.getDepartments().catch(() => []),
        apiService.getLeaveRequests().catch(() => []),
        apiService.getSalaries().catch(() => []),
        apiService.getDailyAttendance(new Date().toISOString().split('T')[0]).catch(() => [])
      ]);

      // Calculate stats
      const pendingLeaves = leaveRequests.filter(leave => leave.status === 'PENDING').length;
      const presentToday = attendance.filter(att => att.status === 'PRESENT').length;
      const absentToday = attendance.filter(att => att.status === 'ABSENT').length;
      const lateToday = attendance.filter(att => att.status === 'LATE').length;

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        pendingLeaves,
        totalSalaries: salaries.length,
        presentToday,
        absentToday,
        lateToday,
      });

      // Generate recent activities (mock data based on real data)
      const activities = [
        { id: 1, type: 'employee', message: `${employees.length} employees registered in system`, time: '2 hours ago', icon: Users },
        { id: 2, type: 'leave', message: `${pendingLeaves} leave requests pending approval`, time: '3 hours ago', icon: Calendar },
        { id: 3, type: 'attendance', message: `${presentToday} employees marked present today`, time: '4 hours ago', icon: CheckCircle },
        { id: 4, type: 'department', message: `${departments.length} departments configured`, time: '1 day ago', icon: Building2 },
      ];
      
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        totalEmployees: 0,
        totalDepartments: 0,
        pendingLeaves: 0,
        totalSalaries: 0,
        presentToday: 0,
        absentToday: 0,
        lateToday: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'blue',
      trend: { type: 'up', value: '+5.2%' }
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'green',
      trend: { type: 'up', value: '+2.1%' }
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'yellow',
      trend: { type: 'down', value: '-1.3%' }
    },
    {
      title: 'Active Salaries',
      value: stats.totalSalaries,
      icon: DollarSign,
      color: 'purple',
      trend: { type: 'up', value: '+3.8%' }
    }
  ];

  const attendanceCards = [
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Absent Today',
      value: stats.absentToday,
      icon: Clock,
      color: 'red'
    },
    {
      title: 'Late Today',
      value: stats.lateToday,
      icon: Clock,
      color: 'yellow'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your Employee Management System</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trend.type === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={card.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendIcon className={`h-4 w-4 mr-1 ${card.trend.type === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${card.trend.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trend.value}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attendanceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="text-center">
                <div className={`mx-auto w-12 h-12 bg-${card.color}-100 rounded-full flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-left">
              <Users className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="text-sm font-medium text-indigo-900">Add Employee</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <Building2 className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-green-900">Add Department</p>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left">
              <Calendar className="h-6 w-6 text-yellow-600 mb-2" />
              <p className="text-sm font-medium text-yellow-900">Review Leaves</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-purple-900">Manage Salaries</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;