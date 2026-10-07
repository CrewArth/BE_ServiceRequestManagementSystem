import { Priority, RequestStatus } from '@prisma/client';
import { readSummary, writeSummary } from '../../cache/request.cache';
import { prisma } from '../../config/database';
import { ROLES } from '../../constants/roles';
import type { Actor } from '../../models/auth/auth.model';

export async function getDashboardSummary(actor: Actor) {
  const key = actor.role === ROLES.ADMIN ? 'summary:admin' : `summary:employee:${actor.id}`;
  const cached = await readSummary(key);
  if (cached) return cached;

  const scope = actor.role === ROLES.ADMIN ? {} : { ownerId: actor.id };
  const [total, open, inProgress, resolved, highPriority, overdue, scheduler] = await Promise.all([
    prisma.serviceRequest.count({ where: scope }),
    prisma.serviceRequest.count({ where: { ...scope, status: RequestStatus.OPEN } }),
    prisma.serviceRequest.count({ where: { ...scope, status: RequestStatus.IN_PROGRESS } }),
    prisma.serviceRequest.count({ where: { ...scope, status: RequestStatus.RESOLVED } }),
    prisma.serviceRequest.count({ where: { ...scope, priority: Priority.HIGH } }),
    prisma.serviceRequest.count({ where: {
      ...scope,
      status: { in: [RequestStatus.OPEN, RequestStatus.IN_PROGRESS] },
      createdAt: { lt: new Date(Date.now() - 86_400_000) },
    } }),
    prisma.schedulerState.findUnique({ where: { key: 'overdue' } }),
  ]);
  const summary = { total, open, inProgress, resolved, highPriority, overdue, lastOverdueCheck: scheduler?.lastSuccessfulRun ?? null };
  await writeSummary(key, summary);
  return summary;
}
