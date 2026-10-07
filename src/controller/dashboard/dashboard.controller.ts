import type { RequestHandler } from 'express';
import { getDashboardSummary } from '../../business-logic/dashboard/dashboard';

export const summary: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const result = await getDashboardSummary(actor);
  res.json(result);
};
