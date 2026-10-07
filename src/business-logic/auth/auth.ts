import bcrypt from 'bcryptjs';
import { ROLES } from '../../constants/roles';
import { HttpError } from '../../middleware/error/error-handler';
import { userRepository } from '../../repositories/user.repository';
import { createToken } from '../../utils/jwt';
import { registerSchema, loginSchema } from '../../validation/auth/auth.validation';

function session(user: { id: string; name: string; email: string; role: typeof ROLES[keyof typeof ROLES] }) {
  return { token: createToken(user.id), user };
}

export async function registerEmployee(rawInput: unknown) {
  const input = registerSchema.parse(rawInput);
  const { password, ...fields } = input;
  const user = await userRepository.create({
    ...fields,
    passwordHash: await bcrypt.hash(password, 12),
    role: ROLES.EMPLOYEE,
  });
  return session(user);
}

export async function loginUser(rawInput: unknown) {
  const input = loginSchema.parse(rawInput);
  const user = await userRepository.findByEmail(input.email);
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  return session({ id: user.id, name: user.name, email: user.email, role: user.role });
}
