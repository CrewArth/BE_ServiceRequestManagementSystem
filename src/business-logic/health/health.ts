import { isDatabaseReachable } from '../../repositories/system.repository';

export async function isDatabaseAvailable() {
  return isDatabaseReachable();
}
