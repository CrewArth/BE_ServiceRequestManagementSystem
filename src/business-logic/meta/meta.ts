import { Category, Priority, RequestStatus } from '../../constants/service-request';

export function getRequestMeta() {
  return {
    categories: Object.values(Category),
    priorities: Object.values(Priority),
    statuses: Object.values(RequestStatus),
  };
}
