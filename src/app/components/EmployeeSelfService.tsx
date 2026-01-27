import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { mockEmployees } from '@/app/data/mockEmployees';
import { mockAttendanceRecords } from '@/app/data/mockAttendance';
import { mockLeaveRequests, mockLeaveBalances } from '@/app/data/mockLeave';
import { mockPayrollRecords } from '@/app/data/mockPayroll';
import { mockPerformanceReviews, mockKPIs } from '@/app/data/mockPerformance';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Building2,
  Briefcase,
} from 'lucide-react';

export function EmployeeSelfService() {
  const { user } = useAuth();
  const employee = mockEmployees.find((e) => e.id === user?.employeeId);

  if (!employee) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Employee data not found.</p>
      </div>
    );
  }

  // Get employee data
  const attendanceRecords = mockAttendanceRecords.filter(
    (r) => r.employeeId === employee.id
  );
  const leaveRequests = mockLeaveRequests.filter((r) => r.employeeId === employee.id);
  const leaveBalance = mockLeaveBalances.find((b) => b.employeeId === employee.id);
  const payrollRecords = mockPayrollRecords.filter((r) => r.employeeId === employee.id);
  const latestPayroll = payrollRecords[0];
  const performanceReviews = mockPerformanceReviews.filter(
    (r) => r.employeeId === employee.id
  );
  const kpis = mockKPIs.filter((k) => k.employeeId === employee.id);

  // Calculate attendance stats
  const thisMonthAttendance = attendanceRecords.filter((r) => {
    const recordDate = new Date(r.date);
    const now = new Date();
    return (
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  });

  const presentDays = thisMonthAttendance.filter((r) => r.status === 'Present').length;
  const lateDays = thisMonthAttendance.filter((r) => r.status === 'Late').length;
  const totalHours = thisMonthAttendance.reduce((sum, r) => sum + r.totalHours, 0);

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
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome, {employee.firstName}!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Access your personal information, attendance, and benefits
        </p>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-sm text-gray-900">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Hire Date</p>
              <p className="text-sm text-gray-900">{formatDate(employee.hireDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-sm text-gray-900">{employee.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">This Month</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{presentDays} Days</p>
          <p className="text-xs text-gray-500 mt-1">Present</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Late Days</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-600">{lateDays}</p>
          <p className="text-xs text-gray-500 mt-1">This Month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Leave Balance</p>
          </div>
          <p className="text-2xl font-semibold text-green-600">
            {leaveBalance ? leaveBalance.annualLeave - leaveBalance.usedAnnualLeave : 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Annual Leave Days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Last Salary</p>
          </div>
          <p className="text-2xl font-semibold text-indigo-600">
            {latestPayroll ? formatCurrency(latestPayroll.netPay) : '-'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Net Pay</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Recent Attendance
          </h3>
          <div className="space-y-3">
            {thisMonthAttendance.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {record.clockIn} - {record.clockOut}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{record.totalHours}h</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Total Hours This Month: <strong>{totalHours.toFixed(1)}h</strong>
          </p>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Leave Requests
          </h3>
          <div className="space-y-3">
            {leaveRequests.length > 0 ? (
              leaveRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.leaveType}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No leave requests</p>
            )}
          </div>
          {leaveBalance && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Annual</p>
                  <p className="text-sm font-medium text-gray-900">
                    {leaveBalance.annualLeave - leaveBalance.usedAnnualLeave}/
                    {leaveBalance.annualLeave}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sick</p>
                  <p className="text-sm font-medium text-gray-900">
                    {leaveBalance.sickLeave - leaveBalance.usedSickLeave}/{leaveBalance.sickLeave}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Personal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {leaveBalance.personalLeave - leaveBalance.usedPersonalLeave}/
                    {leaveBalance.personalLeave}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Performance Overview
          </h3>
          {performanceReviews.length > 0 ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Latest Review</span>
                  <span className="text-sm font-medium text-gray-900">
                    {performanceReviews[0].reviewPeriod}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-indigo-600">
                    {performanceReviews[0].overallRating.toFixed(1)}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(performanceReviews[0].overallRating / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(performanceReviews[0].ratings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No performance reviews yet</p>
          )}
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            My KPIs
          </h3>
          <div className="space-y-4">
            {kpis.length > 0 ? (
              kpis.map((kpi) => {
                const progress = (kpi.actual / kpi.target) * 100;
                return (
                  <div key={kpi.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{kpi.kpiName}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          kpi.status === 'Exceeded'
                            ? 'bg-green-100 text-green-800'
                            : kpi.status === 'Met'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {kpi.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {kpi.actual}
                        {kpi.unit}
                      </span>
                      <span>
                        Target: {kpi.target}
                        {kpi.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          progress >= 100 ? 'bg-green-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No KPIs assigned yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
