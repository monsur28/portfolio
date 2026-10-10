import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function getAdminSession() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return null;

  return session;
}
