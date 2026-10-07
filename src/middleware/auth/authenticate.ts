import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { prisma } from '../../config/database';
import { jwtSecret } from '../../config/env';
import { HttpError } from '../error/error-handler';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: Role };
    }
  }
}

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.header('authorization')?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) throw new HttpError(401, 'Authentication required');
    const payload = jwt.verify(token, jwtSecret());
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      throw new HttpError(401, 'Invalid token');
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) throw new HttpError(401, 'Account not found');
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof jwt.JsonWebTokenError ? new HttpError(401, 'Invalid or expired token') : error);
  }
};
