import type { RequestHandler } from 'express';
import { listRequests, getRequest, createRequest, updateRequest, changeStatus, deleteRequest } from '../../business-logic/service-request/service-request';

export const list: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const filters = req.query;
  const result = await listRequests(actor, filters);
  res.json(result);
};

export const get: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const { id } = req.params;
  const result = await getRequest(actor, id);
  res.json(result);
};

export const create: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const input = req.body;
  const result = await createRequest(actor, input);
  res.status(201).json(result);
};

export const update: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const { id } = req.params;
  const input = req.body;
  const result = await updateRequest(actor, id, input);
  res.json(result);
};

export const updateStatus: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const input = req.body;
  const result = await changeStatus(id, input);
  res.json(result);
};

export const remove: RequestHandler = async (req, res) => {
  const actor = req.user!;
  const { id } = req.params;
  await deleteRequest(actor, id);
  res.status(204).send();
};
