// ====================================================================
// AUTHENTICATION & USER ROLES CONTEXT
// Super Admin | Club Admin | Presenter / Coordinator | Participant
// ====================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-2',
  email: 'coordinator@embedx.srmtrp.edu.in',
  fullName: 'EMBEDX Coordinator',
  role: 'presenter',
  department: 'Department of Electrical & Electronics Engineering',
  college: 'SRM TRP Engineering College'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('embedx_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('embedx_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('embedx_auth_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'presenter') => {
    let fullName = 'EMBEDX Presenter';
    if (role === 'super_admin') fullName = 'Head Administrator (EEE)';
    else if (role === 'club_admin') fullName = 'Club Lead / Admin';
    else if (role === 'participant') fullName = 'Student Attendee';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName,
      role,
      department: 'Department of Electrical & Electronics Engineering',
      college: 'SRM TRP Engineering College'
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    setUser({ ...user, role: newRole });
  };

  const role = user?.role || 'participant';
  const isAuthenticated = Boolean(user && user.role !== 'participant');

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
