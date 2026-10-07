import { Router } from 'express';
import { getMeta } from '../../controller/meta/meta.controller';
import { authenticate } from '../../middleware/auth/authenticate';

export const metaRoutes = Router();
metaRoutes.get('/', authenticate, getMeta);
