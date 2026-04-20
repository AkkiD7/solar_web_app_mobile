import { body, param } from 'express-validator';
import { LeadStatus } from './leads.types';

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^\d{10}$/).withMessage('Phone must be exactly 10 digits'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('location').optional().trim(),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage('Invalid status value'),
  body('systemSizeKW')
    .optional()
    .isFloat({ min: 0 }).withMessage('System size must be greater than or equal to 0'),
  body('notes').optional().trim(),
  body('followUpDate')
    .optional()
    .isISO8601().withMessage('Invalid date format - use ISO 8601'),
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional().trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone')
    .optional().trim()
    .matches(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address'),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus)).withMessage('Invalid status value'),
  body('systemSizeKW')
    .optional()
    .isFloat({ min: 0 }).withMessage('System size must be greater than or equal to 0'),
  body('notes').optional().trim(),
  body('followUpDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
];
