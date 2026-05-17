import { PrismaClient } from '@org/hostinly-backend-client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/hostinly-backend/.env') });

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    select: { id: true, email: true, name: true }
  });
  console.log('Current users in DB:', JSON.stringify(users, null, 2));
  
  const targetUser = await prisma.user.findUnique({
    where: { id: '1f35ec5f-2462-482e-8c37-f0f8dd5b3839' }
  });
  console.log('Target user exists:', !!targetUser);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
