import { RequestStatus } from '@prisma/client';
import { prisma } from '../config/database';

let running = false;

export async function reconcileOverdue() {
  if (running) return;
  running = true;
  try {
    await prisma.$transaction(async (tx) => {
      const lock = await tx.$queryRaw<Array<{ acquired: boolean }>>`
        SELECT pg_try_advisory_xact_lock(715914, 1) AS acquired
      `;
      if (!lock[0]?.acquired) return;
      const cutoff = new Date(Date.now() - 86_400_000);
      await tx.serviceRequest.updateMany({
        where: { status: { in: [RequestStatus.OPEN, RequestStatus.IN_PROGRESS] }, createdAt: { lt: cutoff }, overdue: false },
        data: { overdue: true },
      });
      await tx.serviceRequest.updateMany({
        where: { OR: [{ status: RequestStatus.RESOLVED }, { createdAt: { gte: cutoff } }], overdue: true },
        data: { overdue: false },
      });
      await tx.schedulerState.upsert({
        where: { key: 'overdue' },
        create: { key: 'overdue', lastSuccessfulRun: new Date() },
        update: { lastSuccessfulRun: new Date() },
      });
    }, { timeout: 30_000 });
  } finally { running = false; }
}
