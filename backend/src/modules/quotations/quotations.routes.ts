import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { createQuoteValidator } from './quotations.validator';
import * as quotationsController from './quotations.controller';

const router = Router();

router.use(protect);

router.post('/', createQuoteValidator, asyncHandler(quotationsController.createQuote));
router.get('/', asyncHandler(quotationsController.getQuotes));
router.get('/lead/:leadId', asyncHandler(quotationsController.getQuotesByLead));
router.get('/:id/pdf', asyncHandler(quotationsController.generatePdf));
router.get('/:id', asyncHandler(quotationsController.getQuoteById));

export default router;
