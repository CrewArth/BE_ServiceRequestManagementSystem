export const ROLES = { EMPLOYEE: 'EMPLOYEE', ADMIN: 'ADMIN' } as const;
export type Role = typeof ROLES[keyof typeof ROLES];
