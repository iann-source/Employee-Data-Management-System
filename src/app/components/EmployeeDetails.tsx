import { Employee } from '@/app/types/employee';
import { X, Mail, Phone, Calendar, DollarSign, Briefcase, Building2 } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
}

export function EmployeeDetails({ employee, onClose }: EmployeeDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Employee Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-gray-500 mt-1">{employee.position}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                employee.status
              )}`}
            >
              {employee.status}
            </span>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{employee.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{employee.phone}</p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-sm text-gray-900">{employee.department}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Position Level</p>
                <p className="text-sm text-gray-900">{employee.position}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Annual Salary</p>
                <p className="text-sm text-gray-900">{formatCurrency(employee.salary)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="text-sm text-gray-900">{formatDate(employee.hireDate)}</p>
              </div>
            </div>
          </div>

          {/* Employee ID */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Employee ID: <span className="text-gray-900 font-medium">{employee.id}</span>
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
