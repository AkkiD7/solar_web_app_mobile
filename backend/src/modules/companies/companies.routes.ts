import { Router } from 'express';
import multer from 'multer';
import { protect } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as controller from './companies.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// All routes require company user auth
router.use(protect);

// Company profile
router.get('/me', asyncHandler(controller.getMyCompany));
router.put('/me', asyncHandler(controller.updateMyCompany));
router.put('/me/logo', upload.single('logo'), asyncHandler(controller.uploadLogo));

// Quote / PDF branding
router.get('/me/quote-settings', asyncHandler(controller.getQuoteSettings));
router.put('/me/quote-settings', asyncHandler(controller.updateQuoteSettings));
router.put(
  '/me/quote-settings/signature',
  upload.single('signature'),
  asyncHandler(controller.uploadSignature)
);

// Pricing defaults
router.get('/me/pricing-config', asyncHandler(controller.getPricingConfig));
router.put('/me/pricing-config', asyncHandler(controller.updatePricingConfig));

// Locale preferences
router.get('/me/settings', asyncHandler(controller.getSettings));
router.put('/me/settings', asyncHandler(controller.updateSettings));

export default router;
