import { useState } from 'react';
import { mockPayrollRecords } from '@/app/data/mockPayroll';
import { mockEmployees } from '@/app/data/mockEmployees';
import { DollarSign, Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { PayrollRecord } from '@/app/types/payroll';

export function PayrollPage() {
  const [payrollRecords] = useState(mockPayrollRecords);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const filteredRecords = payrollRecords.filter((record) => {
    if (statusFilter === '') return true;
    return record.status === statusFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Processed':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const calculateStats = () => {
    const totalGross = filteredRecords.reduce((sum, r) => sum + r.grossPay, 0);
    const totalNet = filteredRecords.reduce((sum, r) => sum + r.netPay, 0);
    const totalDeductions = filteredRecords.reduce(
      (sum, r) => sum + r.deductions.tax + r.deductions.insurance + r.deductions.pension,
      0
    );

    return {
      totalEmployees: filteredRecords.length,
      totalGross,
      totalNet,
      totalDeductions,
    };
  };

  const stats = calculateStats();

  const handleExportPayslip = (record: PayrollRecord) => {
    const employee = mockEmployees.find((e) => e.id === record.employeeId);
    if (!employee) return;

    const payslipData = `
PAYSLIP - ${record.month} ${record.year}
=====================================
Employee: ${employee.firstName} ${employee.lastName}
ID: ${employee.id}
Department: ${employee.department}
Position: ${employee.position}

EARNINGS
--------
Base Salary: ${formatCurrency(record.baseSalary)}
Housing Allowance: ${formatCurrency(record.allowances.housing)}
Transport Allowance: ${formatCurrency(record.allowances.transport)}
Meal Allowance: ${formatCurrency(record.allowances.meal)}
Other Allowances: ${formatCurrency(record.allowances.other)}
Bonuses: ${formatCurrency(record.bonuses)}
Overtime: ${formatCurrency(record.overtime)}
--------
Gross Pay: ${formatCurrency(record.grossPay)}

DEDUCTIONS
----------
Tax: ${formatCurrency(record.deductions.tax)}
Insurance: ${formatCurrency(record.deductions.insurance)}
Pension: ${formatCurrency(record.deductions.pension)}
----------
Total Deductions: ${formatCurrency(
      record.deductions.tax + record.deductions.insurance + record.deductions.pension
    )}

NET PAY: ${formatCurrency(record.netPay)}
=====================================
Payment Date: ${record.paymentDate}
Status: ${record.status}
    `.trim();

    const blob = new Blob([payslipData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip_${employee.firstName}_${employee.lastName}_${record.month}_${record.year}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-indigo-600" />
          Payroll Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage employee salaries, allowances, and payroll processing
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Gross Pay</p>
          <p className="text-2xl font-semibold text-indigo-600 mt-1">
            {formatCurrency(stats.totalGross)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Deductions</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {formatCurrency(stats.totalDeductions)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Net Pay</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {formatCurrency(stats.totalNet)}
          </p>
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
            onClick={() => setStatusFilter('Processed')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === 'Processed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Processed
          </button>
          <button
            onClick={() => setStatusFilter('Paid')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === 'Paid'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* Payroll Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const employee = mockEmployees.find((e) => e.id === record.employeeId);
          if (!employee) return null;

          const isExpanded = expandedRecord === record.id;

          return (
            <div key={record.id} className="bg-white rounded-lg shadow">
              <div
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {employee.department} - {employee.position}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Period: {record.month} {record.year} | Payment Date: {record.paymentDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Net Pay</p>
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(record.netPay)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Earnings */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Earnings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Salary</span>
                          <span className="font-medium">
                            {formatCurrency(record.baseSalary)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Housing Allowance</span>
                          <span className="font-medium">
                            {formatCurrency(record.allowances.housing)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Transport Allowance</span>
                          <span className="font-medium">
                            {formatCurrency(record.allowances.transport)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Meal Allowance</span>
                          <span className="font-medium">
                            {formatCurrency(record.allowances.meal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Other Allowances</span>
                          <span className="font-medium">
                            {formatCurrency(record.allowances.other)}
                          </span>
                        </div>
                        {record.bonuses > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Bonuses</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(record.bonuses)}
                            </span>
                          </div>
                        )}
                        {record.overtime > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Overtime</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(record.overtime)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                          <span className="font-medium text-gray-900">Gross Pay</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(record.grossPay)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Deductions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(record.deductions.tax)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Insurance</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(record.deductions.insurance)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pension</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(record.deductions.pension)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                          <span className="font-medium text-gray-900">Total Deductions</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(
                              record.deductions.tax +
                                record.deductions.insurance +
                                record.deductions.pension
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-base pt-4 border-t-2 border-gray-300">
                          <span className="font-semibold text-gray-900">Net Pay</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(record.netPay)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportPayslip(record);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                    >
                      <Download className="w-4 h-4" />
                      Download Payslip
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
