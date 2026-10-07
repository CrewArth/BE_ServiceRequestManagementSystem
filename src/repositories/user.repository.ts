import type { Role } from "../constants/roles";
import { prisma } from "./database";

type UserFields = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
};
const publicUser = { id: true, name: true, email: true, role: true } as const;

export const userRepository = {
  create(fields: UserFields) {
    return prisma.user.create({
      data: fields,
      select: publicUser,
    });
  },
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findPublicById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicUser });
  },
  upsertByEmail(email: string, create: UserFields, passwordHash: string) {
    return prisma.user.upsert({
      where: { email },
      create,
      update: { passwordHash },
    });
  },
};
