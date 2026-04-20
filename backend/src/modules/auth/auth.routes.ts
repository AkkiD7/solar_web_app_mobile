import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginValidator } from './auth.validator';
import * as authController from './auth.controller';

const router = Router();

// Public — login only. Registration is invite-only via Super Admin panel.
router.post('/login', loginValidator, asyncHandler(authController.login));

export default router;
