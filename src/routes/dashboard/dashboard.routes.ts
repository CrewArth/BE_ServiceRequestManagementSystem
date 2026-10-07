import { Router } from 'express';
import { summary } from '../../controller/dashboard/dashboard.controller';
import { authenticate } from '../../middleware/auth/authenticate';
import { asyncHandler } from '../../middleware/error/error-handler';

export const dashboardRoutes = Router();
dashboardRoutes.get('/summary', authenticate, asyncHandler(summary));
