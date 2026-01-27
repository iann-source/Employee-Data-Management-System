import { useState } from 'react';
import { LeaveRequest, LeaveType } from '@/app/types/leave';
import { X } from 'lucide-react';
import { mockEmployees } from '@/app/data/mockEmployees';

interface LeaveRequestFormProps {
  onSubmit: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  onCancel: () => void;
}

const leaveTypes: LeaveType[] = [
  'Annual Leave',
  'Sick Leave',
  'Personal Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Unpaid Leave',
];

export function LeaveRequestForm({ onSubmit, onCancel }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const totalDays = calculateDays(formData.startDate, formData.endDate);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.leaveType) newErrors.leaveType = 'Please select a leave type';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      employeeId: formData.employeeId,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays,
      reason: formData.reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Leave Request</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee *
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, employeeId: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Employee</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} - {emp.department}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
              )}
            </div>

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, leaveType: e.target.value as LeaveType }))
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.leaveType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.leaveType && (
                <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Total Days */}
            {totalDays > 0 && (
              <div className="bg-indigo-50 p-4 rounded-md">
                <p className="text-sm text-indigo-900">
                  Total Days: <strong>{totalDays}</strong> day{totalDays !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please provide a reason for your leave request..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
