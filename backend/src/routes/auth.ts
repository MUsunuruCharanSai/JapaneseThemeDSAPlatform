import { Router } from 'express';
import { body } from 'express-validator';
import { verifyToken, logout, getCurrentUser, updateProfile, getAllUsers, updateUserPremiumAccess, getMyPremiumAccess } from '../controllers/authController';
import { verifyFirebaseToken, requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateToken = [
  body('idToken')
    .notEmpty()
    .withMessage('ID token is required')
    .isString()
    .withMessage('ID token must be a string'),
];

const validateProfileUpdate = [
  body('displayName')
    .notEmpty()
    .withMessage('Display name is required')
    .isString()
    .withMessage('Display name must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Display name must be between 1 and 50 characters'),
];

const validatePremiumAccess = [
  body('premiumAccess')
    .isBoolean()
    .withMessage('premiumAccess must be a boolean'),
];

// Routes
router.post('/verify', validateToken, verifyToken);
router.post('/logout', logout);
router.get('/me', verifyFirebaseToken, requireAuth, getCurrentUser);
router.put('/profile', verifyFirebaseToken, requireAuth, validateProfileUpdate, updateProfile);
router.get('/admin/users', verifyFirebaseToken, requireAuth, requireAdmin, getAllUsers);
router.put('/admin/users/:userId/premium', verifyFirebaseToken, requireAuth, requireAdmin, validatePremiumAccess, updateUserPremiumAccess);
router.get('/premium-access', verifyFirebaseToken, requireAuth, getMyPremiumAccess);

export default router;
