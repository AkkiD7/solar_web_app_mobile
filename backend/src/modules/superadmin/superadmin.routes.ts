import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireSuperAdmin } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as controller from './superadmin.controller';
import * as v from './superadmin.validator';

const router = Router();

// Rate limit login — 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public — super admin login
router.post('/login', loginLimiter, asyncHandler(controller.login));

// ── All routes below require super admin JWT ────────────────────────────────
router.use(requireSuperAdmin);

// Profile
router.put('/profile/password', v.changePasswordRules, asyncHandler(controller.changePassword));

// Platform admin management
router.get('/admins', asyncHandler(controller.listAdmins));
router.post('/admins', asyncHandler(controller.createAdminUser));
router.delete('/admins/:id', asyncHandler(controller.deleteAdminUser));

// Global stats + audit
router.get('/stats', asyncHandler(controller.getStats));
router.get('/audit-logs', asyncHandler(controller.getAuditLogs));

// System health
router.get('/system/health', asyncHandler(controller.systemHealth));

// Plan config
router.get('/plan-config', asyncHandler(controller.getPlanConfigs));
router.put('/plan-config/:plan', v.updatePlanConfigRules, asyncHandler(controller.updatePlanConfig));

// Company management
router.get('/companies', v.listCompaniesRules, asyncHandler(controller.getCompanies));
router.post('/companies', v.createCompanyRules, asyncHandler(controller.createCompany));

// Bulk operations
router.patch('/companies/bulk/status', v.bulkStatusRules, asyncHandler(controller.bulkStatus));
router.patch('/companies/bulk/plan', v.bulkPlanRules, asyncHandler(controller.bulkPlan));

// Single company operations (MUST come after /bulk routes)
router.get('/companies/:id', asyncHandler(controller.getCompanyDetail));
router.put('/companies/:id', v.updateCompanyRules, asyncHandler(controller.updateCompany));
router.delete('/companies/:id', asyncHandler(controller.deleteCompany));
router.patch('/companies/:id/status', v.updateStatusRules, asyncHandler(controller.updateStatus));
router.patch('/companies/:id/plan', v.updatePlanRules, asyncHandler(controller.updatePlan));
router.post('/companies/:id/impersonate', asyncHandler(controller.impersonate));
router.get('/companies/:id/analytics', asyncHandler(controller.getCompanyAnalytics));

// Company user management
router.get('/companies/:id/users', asyncHandler(controller.listUsers));
router.post('/companies/:id/users', v.createUserRules, asyncHandler(controller.createUser));
router.put('/companies/:id/users/:userId', v.updateUserRules, asyncHandler(controller.updateUser));
router.delete('/companies/:id/users/:userId', asyncHandler(controller.deleteUser));
router.put('/companies/:id/users/:userId/reset-password', v.resetPasswordRules, asyncHandler(controller.resetPassword));

// Export
router.get('/export/companies', asyncHandler(controller.exportCompanies));
router.get('/export/audit-logs', asyncHandler(controller.exportAuditLogs));
router.get('/export/companies/:id/data', asyncHandler(controller.exportCompanyData));

export default router;
