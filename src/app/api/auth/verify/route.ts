import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code } = await request.json();
  if (code === '123456') {
    return NextResponse.json({ status: 'verified' });
  }
  return NextResponse.json({ status: 'invalid' }, { status: 400 });
}
