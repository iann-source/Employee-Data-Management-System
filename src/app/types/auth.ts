export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
