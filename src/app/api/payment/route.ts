import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    status: 'initiated',
    gateway: 'razorpay',
    orderId: `order_${Date.now()}`,
    ...body,
  });
}
