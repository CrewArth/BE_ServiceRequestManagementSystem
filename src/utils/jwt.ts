import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/env';

export class InvalidTokenError extends Error {}

export function createToken(userId: string): string {
  return jwt.sign({ sub: userId }, jwtSecret(), { expiresIn: '8h' });
}

export function verifyToken(token: string): string {
  try {
    const payload = jwt.verify(token, jwtSecret());
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      throw new InvalidTokenError('Invalid token');
    }
    return payload.sub;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError('Invalid or expired token');
    }
    throw error;
  }
}
