import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';
import { authService } from '../services/authService';
import { AuthState, User, LoginCredentials, SignupCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  navigateToDashboard: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  const clearError = () => {
    updateAuthState({ error: null });
  };

  const navigateToDashboard = (user: User) => {
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/user', { replace: true });
    }
  };

  const handleAuthSuccess = async (userCredential: UserCredential) => {
    try {
      const idToken = await userCredential.user.getIdToken();
      const response = await authService.verifyToken(idToken);

      if (response.success && response.user) {
        updateAuthState({
          user: response.user,
          loading: false,
          error: null,
        });

        // Navigate to appropriate dashboard after successful authentication
        navigateToDashboard(response.user);
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error: any) {
      updateAuthState({
        user: null,
        loading: false,
        error: error.message,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      clearError();
      updateAuthState({ loading: true });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      updateAuthState({
        loading: false,
        error: getFirebaseErrorMessage(error.code),
      });
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      clearError();
      updateAuthState({ loading: true });

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      updateAuthState({
        loading: false,
        error: getFirebaseErrorMessage(error.code),
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      updateAuthState({ loading: true });

      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(result);
    } catch (error: any) {
      updateAuthState({
        loading: false,
        error: getFirebaseErrorMessage(error.code),
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearError();
      updateAuthState({ loading: true });

      await authService.logout();
      await signOut(auth);

      updateAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      updateAuthState({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await authService.verifyToken(idToken);

          if (response.success && response.user) {
            // Only update state if we don't already have a user (prevents conflicts with direct auth flow)
            if (!authState.user) {
              updateAuthState({
                user: response.user,
                loading: false,
                error: null,
              });
            }
          } else {
            updateAuthState({
              user: null,
              loading: false,
              error: null,
            });
          }
        } catch (error: any) {
          updateAuthState({
            user: null,
            loading: false,
            error: error.message,
          });
        }
      } else {
        updateAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, [authState.user]); // Add authState.user as dependency to prevent unnecessary updates

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
    navigateToDashboard,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'User not found. Please check your email or sign up.';
    case 'auth/wrong-password':
      return 'Wrong password. Please try again.';
    case 'auth/email-already-in-use':
      return 'Email already exists. Please try logging in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    default:
      return 'An error occurred. Please try again.';
  }
};
