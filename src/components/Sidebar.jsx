import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Building2, 
  UserCheck,
  ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/employees', icon: Users, label: 'Employees' },
    ];

    // Add role-specific items
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push(
        { path: '/attendance', icon: Clock, label: 'Attendance' },
        { path: '/leave-requests', icon: Calendar, label: 'Leave Requests' },
      );
    }

    if (user?.role === 'ADMIN') {
      baseItems.push(
        { path: '/departments', icon: Building2, label: 'Departments' },
        { path: '/roles', icon: UserCheck, label: 'Roles' },
        { path: '/salary', icon: DollarSign, label: 'Salary Management' },
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon size={20} className="mr-3" />
        <span className="flex-1">{item.label}</span>
        {isActive && <ChevronRight size={16} />}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        {/* Sidebar header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-800">EMS</h2>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* User role indicator */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <UserCheck size={16} className="mr-2" />
            <span className="capitalize">{user?.role?.toLowerCase() || 'Employee'} Access</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;