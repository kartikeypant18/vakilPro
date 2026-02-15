import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CallModel } from '@/models/Call';
import { verifyAuth, unauthorizedResponse } from '@/lib/apiAuth';

// POST /api/calls/[id]/participants
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }
    await connectToDatabase();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing call id' }, { status: 400 });
    }
    const call = await CallModel.findById(id);
    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }
    // Add user to participants if not already present
    const already = call.participants.some((p: any) => p.userId.toString() === user.id);
    if (!already) {
      call.participants.push({
        userId: user.id,
        role: user.role,
        joinedAt: new Date(),
      });
      await call.save();
    }
    return NextResponse.json({ data: call });
  } catch (error) {
    console.error('Error adding participant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
