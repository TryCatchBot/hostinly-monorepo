import { PrismaClient } from '@org/hostinly-backend-client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/hostinly-backend/.env') });

const prisma = new PrismaClient();

async function main() {
  try {
    const properties = await prisma.property.findMany({ take: 1 });
    console.log('Successfully queried properties. Columns exist.');
  } catch (e: any) {
    console.error('Error querying properties:', e.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
