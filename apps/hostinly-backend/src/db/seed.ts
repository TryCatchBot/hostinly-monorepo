import { PrismaClient } from '@org/hostinly-backend-client';
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
