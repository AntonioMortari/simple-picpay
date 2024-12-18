import { PrismaClient } from '@prisma/client';

const isDev = process.env.NODE_ENV === 'dev';

export const prisma = new PrismaClient({
  log: isDev ? ['query', 'info', 'warn', 'error'] : [],
});
