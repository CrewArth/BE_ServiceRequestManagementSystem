import { RequestStatus } from '../constants/service-request';
import { prisma } from './database';

export async function getDashboardCounts(ownerId: string | undefined, cutoff: Date) {
  const scope = ownerId ? { ownerId } : {};
  return Promise.all([
    prisma.serviceRequest.groupBy({
      by: ['status', 'priority'],
      where: scope,
      _count: { _all: true },
    }),
    prisma.serviceRequest.count({ where: {
      ...scope,
      status: { in: [RequestStatus.OPEN, RequestStatus.IN_PROGRESS] },
      createdAt: { lt: cutoff },
    } }),
    prisma.schedulerState.findUnique({ where: { key: 'overdue' } }),
  ]);
}
