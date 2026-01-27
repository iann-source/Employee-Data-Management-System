export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Personal Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
  attachment?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annualLeave: number;
  sickLeave: number;
  personalLeave: number;
  usedAnnualLeave: number;
  usedSickLeave: number;
  usedPersonalLeave: number;
}
