export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  premiumAccess?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthRequest {
  idToken: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface FirebaseCustomClaims {
  role: 'user' | 'admin';
}
