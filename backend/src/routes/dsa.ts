import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getDSASheetData,
  createHeading,
  updateHeading,
  deleteHeading,
  createSubheading,
  updateSubheading,
  deleteSubheading,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getUserProgress,
  updateUserProgress
} from '../controllers/dsaController';
import { verifyFirebaseToken, requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateHeading = [
  body('name')
    .notEmpty()
    .withMessage('Heading name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Heading name must be between 1 and 200 characters'),
];

const validateSubheading = [
  body('name')
    .notEmpty()
    .withMessage('Subheading name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Subheading name must be between 1 and 200 characters'),
  body('headingId')
    .notEmpty()
    .withMessage('Heading ID is required')
    .isString()
    .withMessage('Heading ID must be a string'),
];

const validateQuestion = [
  body('name')
    .notEmpty()
    .withMessage('Question name is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Question name must be between 1 and 300 characters'),
  body('article')
    .notEmpty()
    .withMessage('Question article is required')
    .isLength({ min: 1, max: 10000 })
    .withMessage('Question article must be between 1 and 10000 characters'),
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('headingId')
    .notEmpty()
    .withMessage('Heading ID is required')
    .isString()
    .withMessage('Heading ID must be a string'),
  body('subheadingId')
    .notEmpty()
    .withMessage('Subheading ID is required')
    .isString()
    .withMessage('Subheading ID must be a string'),
  body('youtubeLink')
    .optional()
    .isURL()
    .withMessage('YouTube link must be a valid URL'),
  body('questionLink')
    .optional()
    .isURL()
    .withMessage('Question link must be a valid URL'),
];

const validateId = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string'),
];

const validateProgressUpdate = [
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isString()
    .withMessage('Question ID must be a string'),
  body('completed')
    .isBoolean()
    .withMessage('Completed must be a boolean'),
];

const validateQuestionUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 300 })
    .withMessage('Question name must be between 1 and 300 characters'),
  body('article')
    .optional()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Question article must be between 1 and 10000 characters'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('youtubeLink')
    .optional()
    .isURL()
    .withMessage('YouTube link must be a valid URL'),
  body('questionLink')
    .optional()
    .isURL()
    .withMessage('Question link must be a valid URL'),
];

// Public routes (for users to view DSA sheet)
router.get('/sheet', getDSASheetData);

// Admin-only routes (for managing DSA content)
router.post('/headings', verifyFirebaseToken, requireAuth, requireAdmin, validateHeading, createHeading);
router.put('/headings/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, validateHeading, updateHeading);
router.delete('/headings/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, deleteHeading);

router.post('/subheadings', verifyFirebaseToken, requireAuth, requireAdmin, validateSubheading, createSubheading);
router.put('/subheadings/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, validateSubheading, updateSubheading);
router.delete('/subheadings/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, deleteSubheading);

router.post('/questions', verifyFirebaseToken, requireAuth, requireAdmin, validateQuestion, createQuestion);
router.put('/questions/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, validateQuestionUpdate, updateQuestion);
router.delete('/questions/:id', verifyFirebaseToken, requireAuth, requireAdmin, validateId, deleteQuestion);

// User progress routes (for regular users)
router.get('/progress', verifyFirebaseToken, requireAuth, getUserProgress);
router.put('/progress', verifyFirebaseToken, requireAuth, validateProgressUpdate, updateUserProgress);

export default router;
