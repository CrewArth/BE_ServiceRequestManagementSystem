export const Category = { IT: 'IT', MAINTENANCE: 'MAINTENANCE', GENERAL: 'GENERAL' } as const;
export type Category = typeof Category[keyof typeof Category];

export const Priority = { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' } as const;
export type Priority = typeof Priority[keyof typeof Priority];

export const RequestStatus = { OPEN: 'OPEN', IN_PROGRESS: 'IN_PROGRESS', RESOLVED: 'RESOLVED' } as const;
export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];
