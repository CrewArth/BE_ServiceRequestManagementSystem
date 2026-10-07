import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function disconnectDatabase() {
  return prisma.$disconnect();
}

export function databaseErrorKind(error: unknown): 'unique' | 'missing' | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;
  if (error.code === 'P2002') return 'unique';
  if (error.code === 'P2025') return 'missing';
  return null;
}
