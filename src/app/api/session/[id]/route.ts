import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { BookingModel } from '@/models/Booking';
import { UserModel } from '@/models/User';
import { LawyerModel } from '@/models/Lawyer';
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

  // Get names for JWT
  let clientName = 'Client';
  let lawyerName = 'Lawyer';
  
  try {
    const clientUser = await UserModel.findById(booking.clientId).lean();
    console.log('Client user found:', clientUser);
    if (clientUser) clientName = clientUser.name;
    
    const lawyer = await LawyerModel.findById(booking.lawyerId).lean() as any;
    console.log('Lawyer found:', lawyer);
    if (lawyer) {
      const lawyerUser = await UserModel.findById(lawyer.userId).lean();
      console.log('Lawyer user found:', lawyerUser);
      if (lawyerUser) lawyerName = lawyerUser.name;
    }
    console.log('Final names - Client:', clientName, 'Lawyer:', lawyerName);
  } catch (err) {
    console.error('Error fetching names for JWT:', err);
  }

  if (!JWT_SECRET) {
    return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
  }

  // Create JWT for call room auth - include names
  const token = jwt.sign(
    {
      bookingId: booking._id?.toString?.() ?? booking._id,
      clientId: booking.clientId?.toString?.() ?? booking.clientId,
      lawyerId: booking.lawyerId?.toString?.() ?? booking.lawyerId,
      role: user?.role || 'client',
      name: user?.name || (isLawyer ? lawyerName : clientName),
      clientName,
      lawyerName,
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
