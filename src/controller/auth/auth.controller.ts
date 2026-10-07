import type { RequestHandler } from 'express';
import { registerEmployee, loginUser } from '../../business-logic/auth/auth';

export const register: RequestHandler = async (req, res) => {
  const input = req.body;
  const result = await registerEmployee(input);
  res.status(201).json(result);
};
export const login: RequestHandler = async (req, res) => {
  const input = req.body;
  const result = await loginUser(input);
  res.json(result);
};
export const me: RequestHandler = (req, res) => {
  const user = req.user;
  res.json(user);
};
