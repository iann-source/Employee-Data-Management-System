import { useState } from 'react';
import { Employee } from '@/app/types/employee';
import { mockEmployees } from '@/app/data/mockEmployees';
import { EmployeeTable } from '@/app/components/EmployeeTable';
import { EmployeeForm } from '@/app/components/EmployeeForm';
import { EmployeeDetails } from '@/app/components/EmployeeDetails';
import { SearchAndFilter } from '@/app/components/SearchAndFilter';
import { Plus, Users, Download } from 'lucide-react';

export function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [viewingEmployee, setViewingEmployee] = useState<Employee | undefined>();

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchTerm === '' ||
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm);

    const matchesDepartment =
      selectedDepartment === '' || employee.department === selectedDepartment;

    const matchesStatus = selectedStatus === '' || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = (employeeData: Omit<Employee, 'id'> & { id?: string }) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
    } as Employee;
    setEmployees([...employees, newEmployee]);
    setIsFormOpen(false);
  };

  const handleEditEmployee = (employeeData: Omit<Employee, 'id'> & { id?: string }) => {
    if (!employeeData.id) return;
    setEmployees(
      employees.map((emp) => (emp.id === employeeData.id ? (employeeData as Employee) : emp))
    );
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const openViewDetails = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const getStats = () => {
    return {
      total: employees.length,
      active: employees.filter((e) => e.status === 'Active').length,
      onLeave: employees.filter((e) => e.status === 'On Leave').length,
      inactive: employees.filter((e) => e.status === 'Inactive').length,
    };
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Position',
      'Salary',
      'Hire Date',
      'Status',
    ];

    const csvData = filteredEmployees.map((emp) => [
      emp.id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
      emp.salary,
      emp.hireDate,
      emp.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              Employee Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and organize your employee database
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">On Leave</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.onLeave}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-semibold text-gray-600 mt-1">{stats.inactive}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onEdit={openEditForm}
        onDelete={handleDeleteEmployee}
        onView={openViewDetails}
      />

      {/* Add/Edit Form Modal */}
      {(isFormOpen || editingEmployee) && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingEmployee(undefined);
          }}
        />
      )}

      {/* View Details Modal */}
      {viewingEmployee && (
        <EmployeeDetails
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(undefined)}
        />
      )}
    </div>
  );
}
