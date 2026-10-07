import type { RequestHandler } from 'express';
import { isDatabaseAvailable } from '../../business-logic/health/health';

export const getHealth: RequestHandler = async (_req, res) => {
  const available = await isDatabaseAvailable();
  res.status(available ? 200 : 503).json({ status: available ? 'ok' : 'unavailable' });
};
