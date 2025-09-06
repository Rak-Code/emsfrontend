import React from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  UserCheck, 
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const EmployeeCard = ({ 
  employee, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}) => {
  const { user } = useSelector((state) => state.auth);
  const canModify = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {getStatusBadge(employee.status)}
            </div>
          </div>
        </div>

        {/* Actions dropdown */}
        {showActions && canModify && (
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <MoreVertical size={16} />
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="py-1">
                <button
                  onClick={() => onView && onView(employee)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye size={16} className="mr-2" />
                  View Details
                </button>
                <button
                  onClick={() => onEdit && onEdit(employee)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Employee
                </button>
                <button
                  onClick={() => onDelete && onDelete(employee)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee details */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2 text-gray-400" />
          <span>{employee.email}</span>
        </div>

        {employee.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone size={16} className="mr-2 text-gray-400" />
            <span>{employee.phone}</span>
          </div>
        )}

        {employee.address && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-gray-400" />
            <span className="truncate">{employee.address}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Building2 size={16} className="mr-2 text-gray-400" />
          <span>{employee.department?.name || 'No Department'}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <UserCheck size={16} className="mr-2 text-gray-400" />
          <span>{employee.role?.roleName || 'No Role'}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>Joined: {formatDate(employee.joiningDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {employee.id}</span>
          <span>Updated: {formatDate(employee.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;