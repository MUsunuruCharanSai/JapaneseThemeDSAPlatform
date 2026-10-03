import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../utils/firebase';
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

const userFromFirebase = (firebaseUser: FirebaseUser): User => {
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
  const email = firebaseUser.email || '';
  return {
    uid: firebaseUser.uid,
    email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    role: email && adminEmail && email.toLowerCase() === adminEmail ? 'admin' : 'user',
  };
};

const resolveUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    const idToken = await firebaseUser.getIdToken();
    const response = await authService.verifyToken(idToken);
    if (response.success && response.user) {
      return response.user;
    }
  } catch {
    // Production API can be down; Firebase session is still valid
  }
  return userFromFirebase(firebaseUser);
};

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
    const user = await resolveUser(userCredential.user);
    updateAuthState({
      user,
      loading: false,
      error: null,
    });
    navigateToDashboard(user);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      clearError();
      updateAuthState({ loading: true });

      if (!isFirebaseConfigured) {
        throw new Error('auth/invalid-api-key');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      updateAuthState({
        loading: false,
        error: getFirebaseErrorMessage(error.code || error.message),
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
        error: error.message === 'Passwords do not match'
          ? error.message
          : getFirebaseErrorMessage(error.code),
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      clearError();
      updateAuthState({ loading: true });

      if (!isFirebaseConfigured) {
        throw new Error('auth/invalid-api-key');
      }

      try {
        const result = await signInWithPopup(auth, googleProvider);
        await handleAuthSuccess(result);
      } catch (popupError: any) {
        if (
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/operation-not-supported-in-this-environment' ||
          popupError.code === 'auth/cancelled-popup-request'
        ) {
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupError;
      }
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
    if (!isFirebaseConfigured) {
      updateAuthState({
        user: null,
        loading: false,
        error: getFirebaseErrorMessage('auth/invalid-api-key'),
      });
      return;
    }

    let cancelled = false;

    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user && !cancelled) {
          await handleAuthSuccess(result);
        }
      })
      .catch(() => undefined);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await resolveUser(firebaseUser);
        if (!cancelled) {
          updateAuthState({
            user,
            loading: false,
            error: null,
          });
        }
      } else if (!cancelled) {
        updateAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

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
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Wrong email or password. Please try again.';
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
    case 'auth/unauthorized-domain': {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'your-vercel-domain';
      return `Add this exact domain in Firebase → Authentication → Settings → Authorized domains: ${host}`;
    }
    case 'auth/operation-not-allowed':
      return 'This sign-in method is disabled in Firebase Authentication.';
    case 'auth/invalid-api-key':
      return 'Firebase API key is missing or invalid. Set VITE_FIREBASE_* in Vercel and redeploy.';
    default:
      return 'An error occurred. Please try again.';
  }
};
