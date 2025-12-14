import { NextResponse } from 'next/server';
import { getUserById, sanitizeUser } from '@/server/data-store';
import { getSessionUserId } from '@/server/auth/session';

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: sanitizeUser(user) });
}

