import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './database';
import { ROLES } from '../constants/roles';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters).');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.role !== ROLES.ADMIN) {
    throw new Error('Admin email belongs to an employee; choose another address.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { name: 'Administrator', email, passwordHash, role: ROLES.ADMIN },
    update: { passwordHash },
  });
  console.log(`Admin account ready: ${email}`);
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
