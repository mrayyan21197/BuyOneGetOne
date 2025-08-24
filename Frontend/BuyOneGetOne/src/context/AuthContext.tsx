import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await api.get<AuthResponse>('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Not logged in', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Register user
  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/register', userData);
      
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Something went wrong",
      });
    }
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.put<AuthResponse>('/auth/update-profile', userData);
      
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update profile error', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.put<AuthResponse>('/auth/update-password', { currentPassword, newPassword });
      
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update password error', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/forgot-password', { email });
      
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Password reset email sent",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Forgot password error', error);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.response?.data?.message || "Something went wrong",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>(`/auth/reset-password/${token}`, { password });
      
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Password reset successful. You can now log in with your new password.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Reset password error', error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.response?.data?.message || "Invalid or expired token",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};