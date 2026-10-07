import { readSummary, writeSummary } from '../../cache/request.cache';
import { ROLES } from '../../constants/roles';
import { Priority, RequestStatus } from '../../constants/service-request';
import type { Actor } from '../../models/auth/auth.model';
import { getDashboardCounts } from '../../repositories/dashboard.repository';

export async function getDashboardSummary(actor: Actor) {
  const key = actor.role === ROLES.ADMIN ? 'summary:admin' : `summary:employee:${actor.id}`;
  const cached = await readSummary(key);
  if (cached) return cached;

  const ownerId = actor.role === ROLES.ADMIN ? undefined : actor.id;
  const [groups, overdue, scheduler] = await getDashboardCounts(ownerId, new Date(Date.now() - 86_400_000));
  const counts = groups.reduce((result, group) => {
    const count = group._count._all;
    result.total += count;
    if (group.status === RequestStatus.OPEN) result.open += count;
    if (group.status === RequestStatus.IN_PROGRESS) result.inProgress += count;
    if (group.status === RequestStatus.RESOLVED) result.resolved += count;
    if (group.priority === Priority.HIGH) result.highPriority += count;
    return result;
  }, { total: 0, open: 0, inProgress: 0, resolved: 0, highPriority: 0 });
  const summary = { ...counts, overdue, lastOverdueCheck: scheduler?.lastSuccessfulRun ?? null };
  await writeSummary(key, summary);
  return summary;
}
