import { Router } from 'express';
import { authenticate } from '../../middleware/auth/authenticate';
import { authorizeAdmin, authorizeEmployee } from '../../middleware/auth/authorize';
import { asyncHandler } from '../../middleware/error/error-handler';
import { list, get, create, update, updateStatus, remove } from '../../controller/service-request/service-request.controller';

export const requestRoutes = Router();
requestRoutes.use(authenticate);
requestRoutes.get('/', asyncHandler(list));
requestRoutes.post('/', authorizeEmployee, asyncHandler(create));
requestRoutes.get('/:id', asyncHandler(get));
requestRoutes.patch('/:id', asyncHandler(update));
requestRoutes.patch('/:id/status', authorizeAdmin, asyncHandler(updateStatus));
requestRoutes.delete('/:id', asyncHandler(remove));
