import { invalidateSummaries } from '../../cache/request.cache';
import { ROLES } from '../../constants/roles';
import { RequestStatus } from '../../constants/service-request';
import { HttpError } from '../../middleware/error/error-handler';
import type { Actor } from '../../models/auth/auth.model';
import { serviceRequestRepository } from '../../repositories/service-request.repository';
import { requestSchema, requestUpdateSchema, filterSchema, statusSchema } from '../../validation/service-request/service-request.validation';

function visibleOwnerId(actor: Actor) {
  return actor.role === ROLES.ADMIN ? undefined : actor.id;
}

export function listRequests(actor: Actor, rawFilters: unknown) {
  const filters = filterSchema.parse(rawFilters);
  return serviceRequestRepository.list(visibleOwnerId(actor), filters);
}

export async function getRequest(actor: Actor, id: string) {
  const request = await serviceRequestRepository.findVisible(id, visibleOwnerId(actor));
  if (!request) throw new HttpError(404, 'Request not found');
  return request;
}

export async function createRequest(actor: Actor, rawFields: unknown) {
  const fields = requestSchema.parse(rawFields);
  const request = await serviceRequestRepository.create(actor.id, fields);
  await invalidateSummaries(actor.id);
  return request;
}

export async function updateRequest(actor: Actor, id: string, rawFields: unknown) {
  const fields = requestUpdateSchema.parse(rawFields);
  const existing = await getRequest(actor, id);
  if (actor.role === ROLES.EMPLOYEE) {
    const result = await serviceRequestRepository.updateOpenOwned(id, actor.id, fields);
    if (!result.count) throw new HttpError(403, 'Only Open requests can be edited');
  } else {
    await serviceRequestRepository.update(id, fields);
  }
  await invalidateSummaries(existing.ownerId);
  return getRequest(actor, id);
}

export async function changeStatus(id: string, rawInput: unknown) {
  const { status } = statusSchema.parse(rawInput);
  const existing = await serviceRequestRepository.findById(id);
  if (!existing) throw new HttpError(404, 'Request not found');
  const overdue = status !== RequestStatus.RESOLVED && existing.createdAt.getTime() < Date.now() - 86_400_000;
  const request = await serviceRequestRepository.updateStatus(id, status, overdue);
  await invalidateSummaries(existing.ownerId);
  return request;
}

export async function deleteRequest(actor: Actor, id: string) {
  const existing = await getRequest(actor, id);
  if (actor.role === ROLES.EMPLOYEE) {
    const result = await serviceRequestRepository.deleteOpenOwned(id, actor.id);
    if (!result.count) throw new HttpError(403, 'Only Open requests can be deleted');
  } else {
    await serviceRequestRepository.delete(id);
  }
  await invalidateSummaries(existing.ownerId);
}
