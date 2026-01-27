import { useAuth } from '@/app/context/AuthContext';
import { Users, LogOut, User } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navItems = isAdmin
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'leave', label: 'Leave Management' },
        { id: 'performance', label: 'Performance' },
        { id: 'payroll', label: 'Payroll' },
        { id: 'personnel', label: 'Personnel' },
      ]
    : [
        { id: 'self-service', label: 'My Dashboard' },
        { id: 'my-attendance', label: 'My Attendance' },
        { id: 'my-leave', label: 'My Leave' },
        { id: 'my-performance', label: 'My Performance' },
        { id: 'my-payroll', label: 'My Payroll' },
      ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">EMS</h1>
              <p className="text-xs text-gray-500">{isAdmin ? 'Admin Portal' : 'Employee Portal'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
