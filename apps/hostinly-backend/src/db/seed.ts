import { PrismaClient } from '@org/hostinly-backend-client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const isProd = process.env.NODE_ENV === 'production';

  // Define super admins based on environment
  const superAdmins: Array<{ email: string; password: string; name: string }> = [];

  // Add CEO super admin
  const ceoEmail = isProd ? process.env.PROD_SUPER_ADMIN_EMAIL_CEO : process.env.DEV_SUPER_ADMIN_EMAIL;
  const ceoPassword = isProd ? process.env.PROD_SUPER_ADMIN_PASSWORD_CEO : process.env.DEV_SUPER_ADMIN_PASSWORD;
  if (ceoEmail && ceoPassword) {
    superAdmins.push({ email: ceoEmail, password: ceoPassword, name: isProd ? 'CEO' : 'Super Admin' });
  }

  // Add CTO super admin (only in prod)
  if (isProd) {
    const ctoEmail = process.env.PROD_SUPER_ADMIN_EMAIL_CTO;
    const ctoPassword = process.env.PROD_SUPER_ADMIN_PASSWORD_CTO;
    if (ctoEmail && ctoPassword) {
      superAdmins.push({ email: ctoEmail, password: ctoPassword, name: 'CTO' });
    }
  }

  if (superAdmins.length === 0) {
    console.error('No super admin credentials found in .env');
    process.exit(1);
  }

  for (const admin of superAdmins) {
    const passwordHash = await bcrypt.hash(admin.password, 10);

    const superAdmin = await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        passwordHash,
        userType: 'SUPER_ADMIN',
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
      },
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash,
        userType: 'SUPER_ADMIN',
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
      },
    });

    console.log('Super admin seeded:', superAdmin.email);
  }

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
