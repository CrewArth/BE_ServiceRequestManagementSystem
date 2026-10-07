import { Category, Priority, RequestStatus } from '../constants/service-request';
import { prisma } from './database';

type RequestFields = {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
};
type RequestFilters = { status?: RequestStatus; priority?: Priority };

const owner = { owner: { select: { id: true, name: true, email: true } } } as const;
const scope = (ownerId?: string) => ownerId ? { ownerId } : {};

export const serviceRequestRepository = {
  list(ownerId: string | undefined, filters: RequestFilters) {
    return prisma.serviceRequest.findMany({
      where: { ...scope(ownerId), ...filters }, include: owner, orderBy: { createdAt: 'desc' },
    });
  },
  findVisible(id: string, ownerId?: string) {
    return prisma.serviceRequest.findFirst({ where: { id, ...scope(ownerId) }, include: owner });
  },
  findById(id: string) {
    return prisma.serviceRequest.findUnique({ where: { id } });
  },
  create(ownerId: string, fields: RequestFields) {
    return prisma.serviceRequest.create({ data: { ...fields, ownerId }, include: owner });
  },
  updateOpenOwned(id: string, ownerId: string, fields: Partial<RequestFields>) {
    return prisma.serviceRequest.updateMany({
      where: { id, ownerId, status: RequestStatus.OPEN }, data: fields,
    });
  },
  update(id: string, fields: Partial<RequestFields>) {
    return prisma.serviceRequest.update({ where: { id }, data: fields });
  },
  updateStatus(id: string, status: RequestStatus, overdue: boolean) {
    return prisma.serviceRequest.update({ where: { id }, data: { status, overdue }, include: owner });
  },
  deleteOpenOwned(id: string, ownerId: string) {
    return prisma.serviceRequest.deleteMany({ where: { id, ownerId, status: RequestStatus.OPEN } });
  },
  delete(id: string) {
    return prisma.serviceRequest.delete({ where: { id } });
  },
};
