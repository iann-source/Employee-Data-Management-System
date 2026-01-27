import { AttendanceRecord } from '@/app/types/attendance';

// Generate attendance records for the current month
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const employeeIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  employeeIds.forEach((employeeId) => {
    for (let day = 1; day <= Math.min(daysInMonth, today.getDate()); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const isAbsent = Math.random() < 0.05; // 5% absence rate
      const isLate = Math.random() < 0.15; // 15% late rate
      const hasBreak = Math.random() < 0.8; // 80% take breaks

      let clockIn = null;
      let clockOut = null;
      let breakStart = null;
      let breakEnd = null;
      let totalHours = 0;
      let status: AttendanceRecord['status'] = 'Present';

      if (!isAbsent) {
        const baseClockIn = isLate ? 9 + Math.random() * 0.5 : 8.5 + Math.random() * 0.5;
        const clockInHour = Math.floor(baseClockIn);
        const clockInMinute = Math.floor((baseClockIn % 1) * 60);
        clockIn = `${String(clockInHour).padStart(2, '0')}:${String(clockInMinute).padStart(2, '0')}`;

        const baseClockOut = 17 + Math.random() * 1;
        const clockOutHour = Math.floor(baseClockOut);
        const clockOutMinute = Math.floor((baseClockOut % 1) * 60);
        clockOut = `${String(clockOutHour).padStart(2, '0')}:${String(clockOutMinute).padStart(2, '0')}`;

        if (hasBreak) {
          breakStart = '12:00';
          breakEnd = '13:00';
        }

        // Calculate total hours
        const clockInTime = clockInHour + clockInMinute / 60;
        const clockOutTime = clockOutHour + clockOutMinute / 60;
        totalHours = clockOutTime - clockInTime - (hasBreak ? 1 : 0);

        status = isLate ? 'Late' : 'Present';
      } else {
        status = 'Absent';
      }

      records.push({
        id: `${employeeId}-${date.toISOString().split('T')[0]}`,
        employeeId,
        date: date.toISOString().split('T')[0],
        clockIn,
        clockOut,
        breakStart,
        breakEnd,
        totalHours: Math.round(totalHours * 100) / 100,
        status,
        notes: '',
      });
    }
  });

  return records;
};

export const mockAttendanceRecords = generateAttendanceRecords();
