export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: {
    housing: number;
    transport: number;
    meal: number;
    other: number;
  };
  bonuses: number;
  overtime: number;
  deductions: {
    tax: number;
    insurance: number;
    pension: number;
    other: number;
  };
  grossPay: number;
  netPay: number;
  paymentDate: string;
  status: 'Pending' | 'Processed' | 'Paid' | 'Cancelled';
}

export interface PayrollSummary {
  month: string;
  year: number;
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalDeductions: number;
  status: 'Draft' | 'Approved' | 'Paid';
}
