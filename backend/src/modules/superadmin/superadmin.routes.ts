import { Router } from 'express';
import { requireSuperAdmin } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as controller from './superadmin.controller';

const router = Router();

// Public — super admin login
router.post('/login', asyncHandler(controller.login));

// All routes below require super admin JWT
router.use(requireSuperAdmin);

// Global stats + audit
router.get('/stats', asyncHandler(controller.getStats));
router.get('/audit-logs', asyncHandler(controller.getAuditLogs));

// Company management
router.get('/companies', asyncHandler(controller.getCompanies));
router.post('/companies', asyncHandler(controller.createCompany));
router.post('/companies/:id/users', asyncHandler(controller.createUser));
router.patch('/companies/:id/status', asyncHandler(controller.updateStatus));
router.patch('/companies/:id/plan', asyncHandler(controller.updatePlan));

export default router;
