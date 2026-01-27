import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { LoginPage } from '@/app/components/LoginPage';
import { Header } from '@/app/components/Header';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { AttendancePage } from '@/app/components/AttendancePage';
import { LeavePage } from '@/app/components/LeavePage';
import { PerformancePage } from '@/app/components/PerformancePage';
import { PayrollPage } from '@/app/components/PayrollPage';
import { PersonnelPage } from '@/app/components/PersonnelPage';
import { EmployeeSelfService } from '@/app/components/EmployeeSelfService';

export function MainApp() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(
    user?.role === 'admin' ? 'dashboard' : 'self-service'
  );

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const isAdmin = user?.role === 'admin';

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'attendance':
          return <AttendancePage />;
        case 'leave':
          return <LeavePage />;
        case 'performance':
          return <PerformancePage />;
        case 'payroll':
          return <PayrollPage />;
        case 'personnel':
          return <PersonnelPage />;
        default:
          return <AdminDashboard />;
      }
    } else {
      return <EmployeeSelfService />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
