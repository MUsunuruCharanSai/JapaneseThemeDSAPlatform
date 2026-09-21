import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { AuthResponse, User } from '../types/auth';

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      const response: AuthResponse = {
        success: false,
        message: 'ID token is required',
      };
      res.status(400).json(response);
      return;
    }

    // Verify the Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user record from Firebase Auth
    const userRecord = await auth.getUser(decodedToken.uid);

    // Determine user role based on email
    const role = userRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    // Update custom claims for admin users
    if (role === 'admin') {
      await auth.setCustomUserClaims(decodedToken.uid, { role: 'admin' });
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

    // IMPORTANT: Do NOT manually update lastLoginAt or lastSignInTime
    // Firebase automatically manages these fields when users authenticate
    // Manual updates will cause "invalid UTC date string" errors

    const response: AuthResponse = {
      success: true,
      user,
      message: 'Authentication successful',
    };

    res.status(200).json(response);
  } catch (error: any) {

    let message = 'Authentication failed';
    let statusCode = 401;

    if (error.code === 'auth/id-token-expired') {
      message = 'Token has expired. Please sign in again.';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Token has been revoked. Please sign in again.';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This account has been disabled.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'User not found.';
      statusCode = 404;
    }

    const response: AuthResponse = {
      success: false,
      message,
    };

    res.status(statusCode).json(response);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In Firebase, logout is handled client-side
    // Server-side cleanup can be done here if needed
    // For example, clearing any server-side sessions

    const response: AuthResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    res.status(200).json(response);
  } catch (error: any) {

    const response: AuthResponse = {
      success: false,
      message: 'Logout failed',
    };

    res.status(500).json(response);
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: AuthResponse = {
        success: false,
        message: 'No authenticated user',
      };
      res.status(401).json(response);
      return;
    }

    const response: AuthResponse = {
      success: true,
      user: req.user,
      message: 'User retrieved successfully',
    };

    res.status(200).json(response);
  } catch (error: any) {

    const response: AuthResponse = {
      success: false,
      message: 'Failed to get user information',
    };

    res.status(500).json(response);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: AuthResponse = {
        success: false,
        message: 'No authenticated user',
      };
      res.status(401).json(response);
      return;
    }

    const { displayName } = req.body;

    // Validate input
    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      const response: AuthResponse = {
        success: false,
        message: 'Display name is required and must be a non-empty string',
      };
      res.status(400).json(response);
      return;
    }

    if (displayName.length > 50) {
      const response: AuthResponse = {
        success: false,
        message: 'Display name must be 50 characters or less',
      };
      res.status(400).json(response);
      return;
    }

    // Update user profile in Firebase Auth
    await auth.updateUser(req.user.uid, {
      displayName: displayName.trim(),
    });

    // Get updated user record
    const updatedUserRecord = await auth.getUser(req.user.uid);
    const role = updatedUserRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    // Create updated user object
    const updatedUser: User = {
      uid: updatedUserRecord.uid,
      email: updatedUserRecord.email || '',
      displayName: updatedUserRecord.displayName || undefined,
      photoURL: updatedUserRecord.photoURL || undefined,
      emailVerified: updatedUserRecord.emailVerified,
      role,
      createdAt: new Date(updatedUserRecord.metadata.creationTime),
      lastLoginAt: new Date(updatedUserRecord.metadata.lastSignInTime),
    };

    const response: AuthResponse = {
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    };

    res.status(200).json(response);
  } catch (error: any) {

    let message = 'Failed to update profile';
    let statusCode = 500;

    if (error.code === 'auth/user-not-found') {
      message = 'User not found';
      statusCode = 404;
    } else if (error.code === 'auth/invalid-display-name') {
      message = 'Invalid display name';
      statusCode = 400;
    }

    const response: AuthResponse = {
      success: false,
      message,
    };

    res.status(statusCode).json(response);
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all users from Firebase Auth
    const listUsersResult = await auth.listUsers();
    const userIds = listUsersResult.users.map(u => u.uid);
    
    // Get premium access status for all users
    const { getUsersPremiumAccess } = await import('../utils/userAccess.js');
    const premiumAccessMap = await getUsersPremiumAccess(userIds);
    
    const users = listUsersResult.users.map(userRecord => {
      const role = userRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

      return {
        uid: userRecord.uid,
        email: userRecord.email || '',
        displayName: userRecord.displayName || undefined,
        photoURL: userRecord.photoURL || undefined,
        emailVerified: userRecord.emailVerified,
        role,
        premiumAccess: premiumAccessMap[userRecord.uid] || false,
        createdAt: new Date(userRecord.metadata.creationTime),
        lastLoginAt: new Date(userRecord.metadata.lastSignInTime),
      };
    });

    res.status(200).json({
      success: true,
      users,
      message: 'Users retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users'
    });
  }
};

// Update user premium access
export const updateUserPremiumAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { premiumAccess } = req.body;

    if (typeof premiumAccess !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'premiumAccess must be a boolean'
      });
      return;
    }

    const { setUserPremiumAccess } = await import('../utils/userAccess.js');
    await setUserPremiumAccess(userId, premiumAccess);

    res.status(200).json({
      success: true,
      message: 'Premium access updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update premium access'
    });
  }
};

// Get current user's premium access
export const getMyPremiumAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;
    const { getUserPremiumAccess } = await import('../utils/userAccess.js');
    const premiumAccess = await getUserPremiumAccess(userId);

    res.status(200).json({
      success: true,
      premiumAccess,
      message: 'Premium access retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve premium access'
    });
  }
};
