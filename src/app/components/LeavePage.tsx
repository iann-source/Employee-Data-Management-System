import { useState } from 'react';
import { LeaveRequest } from '@/app/types/leave';
import { mockLeaveRequests, mockLeaveBalances } from '@/app/data/mockLeave';
import { mockEmployees } from '@/app/data/mockEmployees';
import { Calendar, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LeaveRequestForm } from './LeaveRequestForm';

export function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const filteredRequests = leaveRequests.filter((request) => {
    if (statusFilter === '') return true;
    return request.status === statusFilter;
  });

  const handleApprove = (id: string) => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Approved' as const,
              reviewedBy: 'admin@company.com',
              reviewedDate: new Date().toISOString().split('T')[0],
            }
          : req
      )
    );
  };

  const handleReject = (id: string) => {
    const notes = prompt('Enter rejection reason:');
    if (notes) {
      setLeaveRequests(
        leaveRequests.map((req) =>
          req.id === id
            ? {
                ...req,
                status: 'Rejected' as const,
                reviewedBy: 'admin@company.com',
                reviewedDate: new Date().toISOString().split('T')[0],
                reviewNotes: notes,
              }
            : req
        )
      );
    }
  };

  const handleSubmitRequest = (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsFormOpen(false);
  };

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const calculateStats = () => {
    return {
      total: leaveRequests.length,
      pending: leaveRequests.filter((r) => r.status === 'Pending').length,
      approved: leaveRequests.filter((r) => r.status === 'Approved').length,
      rejected: leaveRequests.filter((r) => r.status === 'Rejected').length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              Leave Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage employee leave requests and balances
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            New Leave Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === ''
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === 'Pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('Approved')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === 'Approved'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter('Rejected')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === 'Rejected'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const employee = mockEmployees.find((e) => e.id === request.employeeId);
                if (!employee) return null;

                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.leaveType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.totalDays}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {request.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Form Modal */}
      {isFormOpen && (
        <LeaveRequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
