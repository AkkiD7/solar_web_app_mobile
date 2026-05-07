import { body, param, query } from 'express-validator';

// ── Company creation / update ────────────────────────────────────────────────
export const createCompanyRules = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('plan').optional().isIn(['FREE', 'STARTER', 'PRO']).withMessage('Invalid plan'),
  body('gstNumber').optional().trim(),
  body('website').optional().trim(),
];

export const updateCompanyRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim().notEmpty(),
  body('address').optional().trim().notEmpty(),
  body('gstNumber').optional().trim(),
  body('website').optional().trim(),
];

// ── Status / Plan ────────────────────────────────────────────────────────────
export const updateStatusRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  body('status').isIn(['ACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE or SUSPENDED'),
];

export const updatePlanRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  body('plan').isIn(['FREE', 'STARTER', 'PRO']).withMessage('Plan must be FREE, STARTER, or PRO'),
];

// ── Users ────────────────────────────────────────────────────────────────────
export const createUserRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER']).withMessage('Invalid role'),
];

export const updateUserRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['ADMIN', 'MANAGER', 'SALES_REP', 'VIEWER']),
  body('isActive').optional().isBoolean(),
];

export const resetPasswordRules = [
  param('id').isMongoId().withMessage('Invalid company ID'),
  param('userId').isMongoId().withMessage('Invalid user ID'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ── Bulk ─────────────────────────────────────────────────────────────────────
export const bulkStatusRules = [
  body('companyIds').isArray({ min: 1 }).withMessage('companyIds must be a non-empty array'),
  body('companyIds.*').isMongoId().withMessage('Each companyId must be a valid ID'),
  body('status').isIn(['ACTIVE', 'SUSPENDED']).withMessage('Status must be ACTIVE or SUSPENDED'),
];

export const bulkPlanRules = [
  body('companyIds').isArray({ min: 1 }).withMessage('companyIds must be a non-empty array'),
  body('companyIds.*').isMongoId().withMessage('Each companyId must be a valid ID'),
  body('plan').isIn(['FREE', 'STARTER', 'PRO']).withMessage('Plan must be FREE, STARTER, or PRO'),
];

// ── Plan Config ──────────────────────────────────────────────────────────────
export const updatePlanConfigRules = [
  param('plan').isIn(['FREE', 'STARTER', 'PRO']).withMessage('Invalid plan name'),
  body('maxLeads').optional().isInt({ min: -1 }),
  body('maxQuotes').optional().isInt({ min: -1 }),
  body('maxUsers').optional().isInt({ min: -1 }),
  body('features').optional().isArray(),
];

// ── Password change ─────────────────────────────────────────────────────────
export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

// ── Pagination queries ──────────────────────────────────────────────────────
export const listCompaniesRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('status').optional().isIn(['ACTIVE', 'SUSPENDED']),
  query('plan').optional().isIn(['FREE', 'STARTER', 'PRO']),
  query('sortBy').optional().isIn(['name', 'createdAt', 'plan', 'status']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];
