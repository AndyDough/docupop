import { NextRequest, NextResponse } from 'next/server';
import { sanitizeUser, verifyCredentials } from '@/server/data-store';
import { applySessionCookie, createSessionToken } from '@/server/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createSessionToken(user.id);
    const response = NextResponse.json({ user: sanitizeUser(user) });
    applySessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ error: 'Unable to sign in right now' }, { status: 500 });
  }
}

