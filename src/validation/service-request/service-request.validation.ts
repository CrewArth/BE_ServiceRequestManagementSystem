import { Category, Priority, RequestStatus } from '@prisma/client';
import { z } from 'zod';

export const requestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.nativeEnum(Category),
  priority: z.nativeEnum(Priority),
}).strict();

export const requestUpdateSchema = requestSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Provide at least one field',
);

export const filterSchema = z.object({
  status: z.nativeEnum(RequestStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
}).strict();

export const statusSchema = z.object({ status: z.nativeEnum(RequestStatus) }).strict();
