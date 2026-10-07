import { Router } from 'express';
import { register, login, me } from '../../controller/auth/auth.controller';
import { authenticate } from '../../middleware/auth/authenticate';
import { asyncHandler } from '../../middleware/error/error-handler';

export const authRoutes = Router();
authRoutes.post('/register', asyncHandler(register));
authRoutes.post('/login', asyncHandler(login));
authRoutes.get('/me', authenticate, me);
