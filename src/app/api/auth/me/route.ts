import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/apiAuth';

export async function GET(request: Request) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
