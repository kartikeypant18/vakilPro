import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { BookingModel } from '@/models/Booking';
import { CallModel } from '@/models/Call';
import { verifyAuth } from '@/lib/apiAuth';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id: bookingId } = await params;

  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json({ error: 'OTP missing' }, { status: 400 });
  }

  const booking: any = await BookingModel.findById(bookingId).lean();
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  if (booking.otp !== otp) {
    return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 });
  }

  // Note: Call document will be created when the actual WebRTC call starts (when lawyer clicks "Start Call"),
  // not at OTP verification. This ensures we only track actual calls that occur.

  // Identify caller role to craft redirect path
  const user = await verifyAuth(request);
  const isLawyer = user?.role === 'lawyer';

  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
  }

  // Create JWT for call room auth
  const token = jwt.sign(
    {
      bookingId: booking._id?.toString?.() ?? booking._id,
      clientId: booking.clientId?.toString?.() ?? booking.clientId,
      lawyerId: booking.lawyerId?.toString?.() ?? booking.lawyerId,
      role: user?.role || 'client',
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const basePath = isLawyer ? '/lawyer/session' : '/user/session';
  return NextResponse.json({
    success: true,
    redirectUrl: `${basePath}/${bookingId}/call?token=${token}`,
  });
}
