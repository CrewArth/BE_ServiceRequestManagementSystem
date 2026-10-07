import type { RequestHandler } from 'express';
import { getRequestMeta } from '../../business-logic/meta/meta';

export const getMeta: RequestHandler = (_req, res) => {
  const result = getRequestMeta();
  res.json(result);
};
