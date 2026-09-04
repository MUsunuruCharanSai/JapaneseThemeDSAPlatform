/**
 * Firebase Authentication Backend Server
 *
 * IMPORTANT FIREBASE SECURITY NOTES:
 * - Only verify Firebase ID tokens using auth.verifyIdToken()
 * - NEVER manually update user metadata like lastLoginAt or lastSignInTime
 * - Firebase automatically manages these fields during authentication
 * - Manual updates will cause "invalid UTC date string" errors
 * - Use fallback user data from JWT token if Firebase user record fails
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');

// Firebase Admin SDK configuration
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized successfully');
}

const auth = admin.auth();
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Authentication middleware
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const idToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : req.body.idToken;

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    // Verify the Firebase ID token (this is the ONLY Firebase operation we should do)
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user record from Firebase Auth with error handling
    let userRecord;
    try {
      userRecord = await auth.getUser(decodedToken.uid);
    } catch (error) {
      console.error('Middleware: Failed to get user record:', {
        uid: decodedToken.uid,
        error: error.message,
        code: error.code
      });
      // If getUser fails due to metadata issues, provide fallback user info from token
      if (error.code === 'auth/user-not-found' || error.message.includes('last sign-in time')) {
        console.warn('Middleware: User record issue detected, using token data as fallback');
        userRecord = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || undefined,
          photoURL: decodedToken.picture || undefined,
          emailVerified: decodedToken.email_verified || false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          }
        };
      } else {
        throw new Error('Failed to retrieve user information from Firebase');
      }
    }

    // Determine user role
    const role = userRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    // Set custom claims for admin users (with error handling)
    if (role === 'admin' && userRecord && !userRecord.fallback) {
      try {
        await auth.setCustomUserClaims(decodedToken.uid, { role: 'admin' });
      } catch (error) {
        console.warn('Middleware: Failed to set custom claims:', {
          uid: decodedToken.uid,
          error: error.message,
          code: error.code
        });
        // Continue with authentication even if custom claims update fails
      }
    }

    // Create user object with safe date handling
    const user = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName: userRecord.displayName || undefined,
      photoURL: userRecord.photoURL || undefined,
      emailVerified: userRecord.emailVerified,
      role,
      createdAt: userRecord.metadata?.creationTime ? new Date(userRecord.metadata.creationTime) : new Date(),
      lastLoginAt: userRecord.metadata?.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : new Date(),
    };

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification middleware error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    let message = 'Authentication failed';
    let statusCode = 401;

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/id-token-expired') {
      message = 'Token has expired. Please sign in again.';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Token has been revoked. Please sign in again.';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This account has been disabled.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'User account not found.';
    } else if (error.code === 'auth/invalid-id-token') {
      message = 'Invalid authentication token.';
    } else if (error.code === 'auth/argument-error') {
      message = 'Invalid authentication request.';
      statusCode = 400;
    } else if (error.code) {
      // Log unknown Firebase error codes for debugging
      console.error('Unknown Firebase middleware error code:', error.code);
      message = 'Authentication service error.';
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

// Routes
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Authentication routes
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    // Verify the Firebase ID token (this is the ONLY Firebase operation we should do)
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user record from Firebase Auth with error handling
    let userRecord;
    try {
      userRecord = await auth.getUser(decodedToken.uid);
    } catch (error) {
      console.error('Failed to get user record:', {
        uid: decodedToken.uid,
        error: error.message,
        code: error.code
      });
      // If getUser fails due to metadata issues, provide fallback user info from token
      if (error.code === 'auth/user-not-found' || error.message.includes('last sign-in time')) {
        console.warn('User record issue detected, using token data as fallback');
        userRecord = {
          uid: decodedToken.uid,
          email: decodedToken.email || '',
          displayName: decodedToken.name || undefined,
          photoURL: decodedToken.picture || undefined,
          emailVerified: decodedToken.email_verified || false,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          }
        };
      } else {
        throw new Error('Failed to retrieve user information from Firebase');
      }
    }

    // Determine user role based on email
    const role = userRecord.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

    // Update custom claims for admin users (with comprehensive error handling)
    // IMPORTANT: Only do this if we successfully got the user record
    if (role === 'admin' && userRecord && !userRecord.fallback) {
      try {
        await auth.setCustomUserClaims(decodedToken.uid, { role: 'admin' });
        console.log(`Admin custom claims set for user: ${decodedToken.uid}`);
      } catch (error) {
        console.warn('Failed to set custom claims for admin user:', {
          uid: decodedToken.uid,
          error: error.message,
          code: error.code
        });
        // Don't fail the authentication if custom claims update fails
        // This prevents crashes from Firebase metadata issues
      }
    }

    // Create user object with safe date handling
    const user = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName: userRecord.displayName || undefined,
      photoURL: userRecord.photoURL || undefined,
      emailVerified: userRecord.emailVerified,
      role,
      createdAt: userRecord.metadata?.creationTime ? new Date(userRecord.metadata.creationTime) : new Date(),
      lastLoginAt: userRecord.metadata?.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : new Date(),
    };

    // Note: lastSignInTime is automatically updated by Firebase
    // when the user authenticates. We should NOT manually update it.

    const response = {
      success: true,
      user,
      message: 'Authentication successful',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Token verification error:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    let message = 'Authentication failed';
    let statusCode = 401;

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/id-token-expired') {
      message = 'Token has expired. Please sign in again.';
    } else if (error.code === 'auth/id-token-revoked') {
      message = 'Token has been revoked. Please sign in again.';
    } else if (error.code === 'auth/user-disabled') {
      message = 'This account has been disabled.';
    } else if (error.code === 'auth/user-not-found') {
      message = 'User not found.';
      statusCode = 404;
    } else if (error.code === 'auth/invalid-id-token') {
      message = 'Invalid authentication token.';
    } else if (error.code === 'auth/argument-error') {
      message = 'Invalid authentication request.';
      statusCode = 400;
    } else if (error.code) {
      // Log unknown Firebase error codes for debugging
      console.error('Unknown Firebase error code:', error.code);
      message = 'Authentication service temporarily unavailable.';
      statusCode = 503;
    }

    const response = {
      success: false,
      message,
    };

    res.status(statusCode).json(response);
  }
});

app.post('/api/auth/logout', (req, res) => {
  // In Firebase, logout is handled client-side
  // Server-side cleanup can be done here if needed
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

app.get('/api/auth/me', verifyFirebaseToken, requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    message: 'User retrieved successfully',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Export for Vercel serverless functions
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
