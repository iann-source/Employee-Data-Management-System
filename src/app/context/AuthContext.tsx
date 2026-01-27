import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/app/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'sarah.johnson@company.com',
    password: 'employee123',
    role: 'employee' as const,
    employeeId: '1',
  },
  {
    id: '3',
    email: 'michael.chen@company.com',
    password: 'employee123',
    role: 'employee' as const,
    employeeId: '2',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
