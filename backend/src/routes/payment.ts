import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUPISettingsController,
  updateUPISettingsController,
  createPaymentRequestController,
  getAllPaymentRequestsController,
  getUserPaymentRequestsController,
  updatePaymentRequestStatusController,
} from '../controllers/paymentController';
import { verifyFirebaseToken, requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateUPISettings = [
  body('upiId')
    .notEmpty()
    .withMessage('UPI ID is required')
    .isString()
    .withMessage('UPI ID must be a string')
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)
    .withMessage('Invalid UPI ID format'),
  body('subscriptionAmount')
    .isFloat({ min: 1 })
    .withMessage('Subscription amount must be a positive number'),
];

const validatePaymentRequest = [
  body('utrNumber')
    .notEmpty()
    .withMessage('UTR Number is required')
    .isString()
    .withMessage('UTR Number must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('UTR Number must be between 1 and 50 characters'),
  body('fullName')
    .notEmpty()
    .withMessage('Full Name is required')
    .isString()
    .withMessage('Full Name must be a string')
    .isLength({ min: 1, max: 100 })
    .withMessage('Full Name must be between 1 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
];

const validatePaymentStatus = [
  body('status')
    .isIn(['Approved', 'Rejected'])
    .withMessage('Status must be either Approved or Rejected'),
];

// UPI Settings Routes
// Public read access for authenticated users, admin-only write access
router.get('/upi-settings', verifyFirebaseToken, requireAuth, getUPISettingsController);
router.put('/upi-settings', verifyFirebaseToken, requireAuth, requireAdmin, validateUPISettings, updateUPISettingsController);

// Payment Request Routes
router.post('/payment-requests', verifyFirebaseToken, requireAuth, validatePaymentRequest, createPaymentRequestController);
router.get('/payment-requests', verifyFirebaseToken, requireAuth, requireAdmin, getAllPaymentRequestsController);
router.get('/payment-requests/my', verifyFirebaseToken, requireAuth, getUserPaymentRequestsController);
router.put('/payment-requests/:paymentId/status', verifyFirebaseToken, requireAuth, requireAdmin, validatePaymentStatus, updatePaymentRequestStatusController);

export default router;

