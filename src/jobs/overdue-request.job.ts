import { reconcileOverdueRecords } from '../repositories/system.repository';

let running = false;

export async function reconcileOverdue() {
  if (running) return;
  running = true;
  try {
    await reconcileOverdueRecords(86_400_000);
  } finally { running = false; }
}
