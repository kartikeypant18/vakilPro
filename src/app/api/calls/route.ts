import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CallModel } from '@/models/Call';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    await connectToDatabase();
    const { bookingId, roomId } = await request.json();

    if (!bookingId || !roomId) {
      return NextResponse.json({ error: 'Missing bookingId or roomId' }, { status: 400 });
    }

    // Check if a call already exists for this roomId
    let call = await CallModel.findOne({ roomId });
    
    if (call) {
      // Call already exists, return it
      return NextResponse.json({ data: call }, { status: 200 });
    }

    // Create a new call if one doesn't exist
    call = await CallModel.create({
      bookingId,
      roomId,
      status: 'created',
      participants: [], // will be populated when joining
    });

    return NextResponse.json({ data: call }, { status: 201 });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}