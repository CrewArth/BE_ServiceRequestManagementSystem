import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: error.flatten() });
  } else if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json({ error: 'An account with this email already exists' });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    res.status(404).json({ error: 'Request not found' });
  } else if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ error: 'Invalid JSON' });
  } else {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
