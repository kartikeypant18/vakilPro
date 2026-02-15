import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { CallModel } from '@/models/Call';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    await connectToDatabase();
    const { id } = await params;
    const { status, recordingUrl } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing call id' }, { status: 400 });
    }

    const call = await CallModel.findById(id);
    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Optional: Check if user is participant
    // For now, allow authenticated users

    if (status === 'active') {
      call.status = 'active';
      if (!call.startedAt) {
        call.startedAt = new Date();
      }
    } else if (status === 'ended') {
      call.status = 'ended';
      call.endedAt = new Date();
      if (call.startedAt) {
        call.durationSeconds = Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
      }
    }

    if (recordingUrl) {
      call.recordingUrl = recordingUrl;
    }

    await call.save();

    return NextResponse.json({ data: call });
  } catch (error) {
    console.error('Error updating call:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return unauthorizedResponse();
    }

    await connectToDatabase();
    const { id } = await params;

    const call = await CallModel.findById(id).populate('bookingId').lean();
    if (!call) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 });
    }

    // Optional: Check permissions

    return NextResponse.json({ data: call });
  } catch (error) {
    console.error('Error fetching call:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}