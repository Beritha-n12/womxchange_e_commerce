
import { PrismaClient } from '@prisma/client';

console.log('🔧 Initializing Prisma Client...');
console.log('🔧 DATABASE_URL exists:', !!process.env.DATABASE_URL || 'postgresql://beritha:t2vsQn2nIx0RD88GW1N36YDlPWBvMUtD@dpg-d1va01s9c44c73dmkqm0-a.oregon-postgres.render.com/womxchangerwanda');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected successfully');
  })
  .catch((error) => {
    console.error('❌ Prisma connection failed:', error);
  });

export default prisma;
