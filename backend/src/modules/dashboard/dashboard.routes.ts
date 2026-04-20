import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as dashboardController from './dashboard.controller';

const router = Router();

router.use(protect);
router.get('/stats', asyncHandler(dashboardController.getStats));

export default router;
