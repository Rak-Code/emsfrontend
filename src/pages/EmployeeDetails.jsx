import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeById, clearCurrentEmployee } from '../store/employeeSlice';
import Loader from '../components/Loader';
import { 
  ArrowLeft, 
  Edit,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  UserCheck,
  Clock
} from 'lucide-react';

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentEmployee, loading } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);

  const canModify = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
    
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/employees');
  };

  const handleEdit = () => {
    navigate(`/employees/edit/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <Loader fullscreen text="Loading employee details..." />;
  }

  if (!currentEmployee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found</p>
        <button
          onClick={handleBack}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
            <p className="text-gray-600 mt-1">View employee information</p>
          </div>
        </div>

        {canModify && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <Edit size={16} className="mr-2" />
            Edit Employee
          </button>
        )}
      </div>

      {/* Employee Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{currentEmployee.name}</h2>
              <p className="text-primary-100 mt-1">
                {currentEmployee.role?.roleName} • {currentEmployee.department?.name}
              </p>
              <div className="mt-2">
                {getStatusBadge(currentEmployee.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{currentEmployee.email}</p>
                  </div>
                </div>

                {currentEmployee.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{currentEmployee.phone}</p>
                    </div>
                  </div>
                )}

                {currentEmployee.address && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                      <MapPin size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{currentEmployee.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Work Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{currentEmployee.department?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <UserCheck size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">{currentEmployee.role?.roleName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p className="font-medium text-gray-900">{formatDate(currentEmployee.joiningDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">{formatDate(currentEmployee.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Employee ID: {currentEmployee.id}</span>
              <span>Created: {formatDate(currentEmployee.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;