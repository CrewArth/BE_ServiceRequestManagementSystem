import { Category, Priority, RequestStatus } from '@prisma/client';

export function getRequestMeta() {
  return {
    categories: Object.values(Category),
    priorities: Object.values(Priority),
    statuses: Object.values(RequestStatus),
  };
}
