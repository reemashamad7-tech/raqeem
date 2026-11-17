import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { initialStudentProfile } from '../data/majmaahData';

interface AuthContextType {
  student: StudentProfile | null;
  isAuthenticated: boolean;
  login: (email: string, studentId?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('raqeem_student');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nameAr && parsed.nameAr.includes('ريان')) {
          return {
            ...parsed,
            nameAr: 'ريماس أبوحيمد',
            nameEn: 'Remas Abuhimed',
            email: 'r.abuhimed@s.mu.edu.sa',
          };
        }
        return parsed;
      } catch {
        return initialStudentProfile;
      }
    }
    return initialStudentProfile; // Pre-authenticated with official student demo for immediate usability
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    if (student) {
      localStorage.setItem('raqeem_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('raqeem_student');
    }
  }, [student]);

  const login = (email: string, studentId?: string) => {
    // Check if domain belongs to Majmaah University
    const trimmedEmail = email.trim().toLowerCase();
    const isMuDomain = trimmedEmail.endsWith('@s.mu.edu.sa') || 
                       trimmedEmail.endsWith('@mu.edu.sa') || 
                       trimmedEmail === 'demo' ||
                       trimmedEmail === 'student@mu.edu.sa';

    if (!isMuDomain) {
      return { 
        success: false, 
        error: 'يجب أن يكون البريد الإلكتروني مسجلاً بنطاق جامعة المجمعة (@s.mu.edu.sa)' 
      };
    }

    const newStudent: StudentProfile = {
      ...initialStudentProfile,
      email: trimmedEmail === 'demo' ? '421105824@s.mu.edu.sa' : trimmedEmail,
      studentId: studentId || '421105824',
    };

    setStudent(newStudent);
    setShowAuthModal(false);
    return { success: true };
  };

  const logout = () => {
    setStudent(null);
    setShowAuthModal(true);
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    if (student) {
      setStudent({ ...student, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        isAuthenticated: !!student,
        login,
        logout,
        updateProfile,
        showAuthModal,
        setShowAuthModal,
      }}
    >
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

