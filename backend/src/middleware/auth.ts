import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { User, FirebaseCustomClaims } from '../types/auth';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const idToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : req.body.idToken;

    if (!idToken) {
      res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
      return;
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(decodedToken.uid);

    // Determine user role
    const role = userRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    // Set custom claims if not already set (for admin users)
    if (role === 'admin') {
      const customClaims: FirebaseCustomClaims = { role: 'admin' };
      await auth.setCustomUserClaims(decodedToken.uid, customClaims);
    }

    // Create user object
    const user: User = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName: userRecord.displayName || undefined,
      photoURL: userRecord.photoURL || undefined,
      emailVerified: userRecord.emailVerified,
      role,
      createdAt: new Date(userRecord.metadata.creationTime),
      lastLoginAt: new Date(userRecord.metadata.lastSignInTime),
    };

    // Attach user to request object
    req.user = user;

    next();
  } catch (error: any) {

    let message = 'Authentication failed';
    if (error.code === 'auth/id-token-expired') {
      message = 'Token has expired. Please sign in again.';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Token has been revoked. Please sign in again.';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This account has been disabled.';
    }

    res.status(401).json({
      success: false,
      message,
    });
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
    return;
  }
  next();
};
