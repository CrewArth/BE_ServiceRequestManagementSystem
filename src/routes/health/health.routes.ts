import { Router } from 'express';
import { getHealth } from '../../controller/health/health.controller';
import { asyncHandler } from '../../middleware/error/error-handler';

export const healthRoutes = Router();
healthRoutes.get('/', asyncHandler(getHealth));
