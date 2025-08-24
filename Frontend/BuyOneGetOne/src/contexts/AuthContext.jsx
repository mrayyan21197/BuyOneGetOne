import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { USER_ROLES } from '../constants';

// Auth context
const AuthContext = createContext(null);

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        userMode: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'SET_USER_MODE':
      return {
        ...state,
        userMode: action.payload
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  userMode: null // For business users: 'business' or 'user'
};

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.getMe();
      
      if (response.data.success) {
        const user = response.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        
        // Set default user mode for business users
        if (user.role === USER_ROLES.BUSINESS) {
          const savedMode = localStorage.getItem('userMode');
          dispatch({ 
            type: 'SET_USER_MODE', 
            payload: savedMode || 'business' 
          });
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        const user = response.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        
        // Set default user mode for business users
        if (user.role === USER_ROLES.BUSINESS) {
          dispatch({ type: 'SET_USER_MODE', payload: 'business' });
          localStorage.setItem('userMode', 'business');
        }
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const user = response.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        
        // Set default user mode for business users
        if (user.role === USER_ROLES.BUSINESS) {
          dispatch({ type: 'SET_USER_MODE', payload: 'business' });
          localStorage.setItem('userMode', 'business');
        }
        
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('userMode');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      
      if (response.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.user });
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await authAPI.updatePassword(passwordData);
      
      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password update failed';
      return { success: false, error: errorMessage };
    }
  };

  const switchUserMode = (mode) => {
    if (state.user?.role === USER_ROLES.BUSINESS) {
      dispatch({ type: 'SET_USER_MODE', payload: mode });
      localStorage.setItem('userMode', mode);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Helper functions
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  const isBusinessMode = () => {
    return state.user?.role === USER_ROLES.BUSINESS && state.userMode === 'business';
  };

  const isUserMode = () => {
    return state.user?.role === USER_ROLES.USER || 
           (state.user?.role === USER_ROLES.BUSINESS && state.userMode === 'user');
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    switchUserMode,
    clearError,
    
    // Helpers
    hasRole,
    hasAnyRole,
    isBusinessMode,
    isUserMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}