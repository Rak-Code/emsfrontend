import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees, fetchDepartments, fetchRoles } from '../store/employeeSlice';
import { 
  Users, 
  Building2, 
  UserCheck, 
  Calendar, 
  Clock,
  TrendingUp,
  Activity,
  PieChart
} from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employees, departments, roles, loading } = useSelector((state) => state.employees);

  useEffect(() => {
    // Fetch initial data for dashboard
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'ACTIVE').length,
    totalDepartments: departments.length,
    totalRoles: roles.length,
  };

  const StatCard = ({ icon: Icon, title, value, subtext, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtext && (
              <p className="text-sm text-gray-600">{subtext}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = 'primary' }) => {
    const colorClasses = {
      primary: 'hover:bg-primary-50 focus:ring-primary-500',
      green: 'hover:bg-green-50 focus:ring-green-500',
      blue: 'hover:bg-blue-50 focus:ring-blue-500',
    };

    return (
      <button
        onClick={onClick}
        className={`w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses[color]}`}
      >
        <div className="flex items-start">
          <Icon size={24} className="text-gray-600 mt-1" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </button>
    );
  };

  const RecentActivity = () => {
    const recentEmployees = employees.slice(0, 5);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Employees</h3>
        {recentEmployees.length > 0 ? (
          <div className="space-y-3">
            {recentEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {employee.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {employee.department?.name} • {employee.role?.roleName}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No employees found</p>
        )}
      </div>
    );
  };

  if (loading) {
    return <Loader fullscreen text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening in your organization today.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={stats.totalEmployees}
          subtext={`${stats.activeEmployees} active`}
          color="primary"
        />
        <StatCard
          icon={Activity}
          title="Active Employees"
          value={stats.activeEmployees}
          subtext={`${((stats.activeEmployees / stats.totalEmployees) * 100 || 0).toFixed(1)}% of total`}
          color="green"
        />
        <StatCard
          icon={Building2}
          title="Departments"
          value={stats.totalDepartments}
          subtext="Organization units"
          color="blue"
        />
        <StatCard
          icon={UserCheck}
          title="Job Roles"
          value={stats.totalRoles}
          subtext="Available positions"
          color="purple"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="space-y-4">
            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
              <QuickActionCard
                icon={Users}
                title="Manage Employees"
                description="Add, edit, or remove employee records"
                onClick={() => window.location.href = '/employees'}
                color="primary"
              />
            )}
            <QuickActionCard
              icon={Clock}
              title="Attendance"
              description="View and manage attendance records"
              onClick={() => window.location.href = '/attendance'}
              color="green"
            />
            <QuickActionCard
              icon={Calendar}
              title="Leave Requests"
              description="Review and manage leave applications"
              onClick={() => window.location.href = '/leave-requests'}
              color="blue"
            />
          </div>
        </div>

        {/* Recent activity */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <RecentActivity />
        </div>
      </div>

      {/* Department overview */}
      {departments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => {
              const departmentEmployees = employees.filter(emp => emp.department?.id === department.id);
              return (
                <div key={department.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-500">
                        {departmentEmployees.length} employees
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;