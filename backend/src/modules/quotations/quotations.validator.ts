import { body } from 'express-validator';

export const createQuoteValidator = [
  body('leadId').isMongoId().withMessage('Invalid lead ID'),
  body('systemSizeKW')
    .isFloat({ gt: 0 }).withMessage('System size must be greater than 0'),
  body('panelCostPerKW')
    .isFloat({ min: 0 }).withMessage('Panel cost per kW must be >= 0'),
  body('inverterCost')
    .isFloat({ min: 0 }).withMessage('Inverter cost must be >= 0'),
  body('installationCost')
    .isFloat({ min: 0 }).withMessage('Installation cost must be >= 0'),
  body('notes').optional().trim(),
];
