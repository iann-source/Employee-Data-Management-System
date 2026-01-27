export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breakStart: string | null;
  breakEnd: string | null;
  totalHours: number;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On Leave';
  notes: string;
}

export interface AttendanceSummary {
  employeeId: string;
  month: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
  averageHours: number;
}
