import { reconcileOverdue } from './overdue-request.job';

const INTERVAL_MS = 5 * 60 * 1000;

export function startOverdueScheduler() {
  async function run() {
    try { await reconcileOverdue(); }
    catch (error) { console.error('Overdue reconciliation failed', error); }
  }

  void run();
  const timer = setInterval(() => void run(), INTERVAL_MS);
  return () => clearInterval(timer);
}
