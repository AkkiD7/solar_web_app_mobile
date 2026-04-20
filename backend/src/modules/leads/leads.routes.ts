import { Router } from 'express';
import { protect } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { createLeadValidator, updateLeadValidator } from './leads.validator';
import * as leadsController from './leads.controller';

const router = Router();

// All leads routes require authentication (single-user scope)
router.use(protect);

router.get('/', asyncHandler(leadsController.getLeads));
router.get('/:id', asyncHandler(leadsController.getLeadById));
router.post('/', createLeadValidator, asyncHandler(leadsController.createLead));
router.put('/:id', updateLeadValidator, asyncHandler(leadsController.updateLead));
router.delete('/:id', asyncHandler(leadsController.deleteLead));

export default router;
