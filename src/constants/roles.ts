import { Role } from "@prisma/client";

export const ROLES = { EMPLOYEE: Role.EMPLOYEE, ADMIN: Role.ADMIN } as const;
