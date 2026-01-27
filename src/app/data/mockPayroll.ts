import { PayrollRecord } from '@/app/types/payroll';
import { mockEmployees } from './mockEmployees';

const calculatePayroll = (baseSalary: number): PayrollRecord['allowances'] & PayrollRecord['deductions'] & { bonuses: number; overtime: number } => {
  const monthlyBaseSalary = baseSalary / 12;
  
  return {
    housing: Math.round(monthlyBaseSalary * 0.2),
    transport: Math.round(monthlyBaseSalary * 0.1),
    meal: Math.round(monthlyBaseSalary * 0.05),
    other: Math.round(monthlyBaseSalary * 0.02),
    bonuses: Math.random() > 0.7 ? Math.round(monthlyBaseSalary * 0.15) : 0,
    overtime: Math.random() > 0.6 ? Math.round(Math.random() * 500) : 0,
    tax: Math.round(monthlyBaseSalary * 0.15),
    insurance: Math.round(monthlyBaseSalary * 0.05),
    pension: Math.round(monthlyBaseSalary * 0.08),
  };
};

export const mockPayrollRecords: PayrollRecord[] = mockEmployees.map((employee, index) => {
  const monthlyBaseSalary = employee.salary / 12;
  const calculations = calculatePayroll(employee.salary);
  
  const grossPay =
    monthlyBaseSalary +
    calculations.housing +
    calculations.transport +
    calculations.meal +
    calculations.other +
    calculations.bonuses +
    calculations.overtime;
  
  const totalDeductions =
    calculations.tax +
    calculations.insurance +
    calculations.pension;
  
  const netPay = grossPay - totalDeductions;

  return {
    id: `payroll-${employee.id}-2026-01`,
    employeeId: employee.id,
    month: 'January',
    year: 2026,
    baseSalary: Math.round(monthlyBaseSalary),
    allowances: {
      housing: calculations.housing,
      transport: calculations.transport,
      meal: calculations.meal,
      other: calculations.other,
    },
    bonuses: calculations.bonuses,
    overtime: calculations.overtime,
    deductions: {
      tax: calculations.tax,
      insurance: calculations.insurance,
      pension: calculations.pension,
      other: 0,
    },
    grossPay: Math.round(grossPay),
    netPay: Math.round(netPay),
    paymentDate: '2026-01-31',
    status: index < 5 ? 'Paid' : index < 10 ? 'Processed' : 'Pending',
  };
});
