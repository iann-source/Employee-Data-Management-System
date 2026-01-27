import { useState } from 'react';
import { mockEmployees } from '@/app/data/mockEmployees';
import { Employee } from '@/app/types/employee';
import { FileText, Upload, Download, Eye } from 'lucide-react';

interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
}

const mockDocuments: EmployeeDocument[] = [
  {
    id: '1',
    employeeId: '1',
    documentType: 'Resume',
    fileName: 'sarah_johnson_resume.pdf',
    uploadDate: '2021-03-10',
    fileSize: '245 KB',
  },
  {
    id: '2',
    employeeId: '1',
    documentType: 'ID Proof',
    fileName: 'id_proof.pdf',
    uploadDate: '2021-03-10',
    fileSize: '180 KB',
  },
  {
    id: '3',
    employeeId: '1',
    documentType: 'Educational Certificate',
    fileName: 'degree_certificate.pdf',
    uploadDate: '2021-03-10',
    fileSize: '320 KB',
  },
  {
    id: '4',
    employeeId: '2',
    documentType: 'Resume',
    fileName: 'michael_chen_resume.pdf',
    uploadDate: '2020-07-15',
    fileSize: '280 KB',
  },
];

export function PersonnelPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [documents] = useState(mockDocuments);

  const employeeDocuments = selectedEmployee
    ? documents.filter((d) => d.employeeId === selectedEmployee.id)
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          Personnel Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage employee records, documents, and personnel files
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Employees</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
              {mockEmployees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedEmployee?.id === employee.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{employee.department}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {selectedEmployee.position} - {selectedEmployee.department}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      selectedEmployee.status
                    )}`}
                  >
                    {selectedEmployee.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Salary
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatCurrency(selectedEmployee.salary)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hire Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedEmployee.hireDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Status
                    </label>
                    <p className="text-sm text-gray-900">{selectedEmployee.status}</p>
                  </div>
                </div>
              </div>

              {/* Employment History */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Employment History
                </h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-indigo-600 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEmployee.position}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(selectedEmployee.hireDate)} - Present
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedEmployee.department}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Promoted from previous role with increased responsibilities
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>

                {employeeDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {employeeDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.documentType}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.fileName} • {doc.fileSize} • Uploaded on{' '}
                              {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-indigo-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <p className="text-sm text-gray-900">John Doe</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship
                    </label>
                    <p className="text-sm text-gray-900">Spouse</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-900">+1 (555) 999-8888</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">john.doe@email.com</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select an employee to view their personnel file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
