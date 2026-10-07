import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { ROLES } from '../../constants/roles';
import { HttpError } from '../../middleware/error/error-handler';
import { createToken } from '../../utils/jwt';
import { registerSchema, loginSchema } from '../../validation/auth/auth.validation';

function session(user: { id: string; name: string; email: string; role: typeof ROLES[keyof typeof ROLES] }) {
  return { token: createToken(user.id), user };
}

export async function registerEmployee(rawInput: unknown) {
  const input = registerSchema.parse(rawInput);
  const { password, ...fields } = input;
  const user = await prisma.user.create({
    data: { ...fields, passwordHash: await bcrypt.hash(password, 12), role: ROLES.EMPLOYEE },
    select: { id: true, name: true, email: true, role: true },
  });
  return session(user);
}

export async function loginUser(rawInput: unknown) {
  const input = loginSchema.parse(rawInput);
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  return session({ id: user.id, name: user.name, email: user.email, role: user.role });
}
