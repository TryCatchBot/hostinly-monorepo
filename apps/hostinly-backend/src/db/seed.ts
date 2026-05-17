import { PrismaClient } from '../generated/client/index.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      userType: 'SUPER_ADMIN',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
    },
    create: {
      email,
      name: 'Super Admin',
      passwordHash,
      userType: 'SUPER_ADMIN',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log('Super admin seeded:', superAdmin.email);

  // Seed the specific user that was reported as missing
  const testUser = await prisma.user.upsert({
    where: { id: '1f35ec5f-2462-482e-8c37-f0f8dd5b3839' },
    update: {},
    create: {
      id: '1f35ec5f-2462-482e-8c37-f0f8dd5b3839',
      email: 'test@yopmail.com',
      name: 'Test User',
      passwordHash: await bcrypt.hash('Password1*', 10),
      userType: 'HOST',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
    },
  });
  console.log('Test user seeded:', testUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
