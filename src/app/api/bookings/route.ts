import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BookingModel } from '@/models/Booking';
import { verifyAuth, unauthorizedResponse, forbiddenResponse, hasRole } from '@/lib/apiAuth';
import { generateUniqueOTP } from '@/lib/generateOTP';

// GET /api/bookings?clientId=xxx or ?lawyerId=xxx
export async function GET(request: Request) {
  // Verify authentication
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  const lawyerId = searchParams.get('lawyerId');
  let status = searchParams.get('status');
  if (status) status = status.trim();

  let query: any = {};
  const { Types } = await import('mongoose');

  // Clients can only see their own bookings
  if (user.role === 'client') {
    query.clientId = Types.ObjectId.isValid(user.id) ? new Types.ObjectId(user.id) : user.id;
  } 
  // Lawyers can see bookings assigned to them, or filter by lawyerId param
  else if (user.role === 'lawyer') {
    if (lawyerId) {
      query.lawyerId = Types.ObjectId.isValid(lawyerId) ? new Types.ObjectId(lawyerId) : lawyerId;
    } else {
      query.lawyerId = Types.ObjectId.isValid(user.id) ? new Types.ObjectId(user.id) : user.id;
    }
  }
  // Admins can see all bookings
  else if (user.role === 'admin') {
    if (clientId) query.clientId = Types.ObjectId.isValid(clientId) ? new Types.ObjectId(clientId) : clientId;
    if (lawyerId) query.lawyerId = Types.ObjectId.isValid(lawyerId) ? new Types.ObjectId(lawyerId) : lawyerId;
  }
  if (status) query.status = status;

  const bookings = await BookingModel.find(query)
    .populate({ path: 'clientId', model: 'User', select: 'name email' })
    .lean();
  return NextResponse.json({ data: bookings });
}

// POST /api/bookings
export async function POST(request: Request) {
  // Verify authentication
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }

  // Only clients can create bookings
  if (!hasRole(user, ['client', 'admin'])) {
    return forbiddenResponse('Only clients can create bookings');
  }

  await connectToDatabase();
  const payload = await request.json();
  const { lawyerId, date, slot, note } = payload;

  // Validate required fields
  if (!lawyerId || !date || !slot) {
    return NextResponse.json({ error: 'Missing required fields: lawyerId, date, slot' }, { status: 400 });
  }

  // Generate a unique 6-digit OTP
  const otp = await generateUniqueOTP();

  // Use authenticated user's ID as clientId (don't trust client-provided clientId)
  const booking = await BookingModel.create({
    clientId: user.id,
    lawyerId,
    date,
    slot,
    note: note || '',
    status: 'pending',
    rejectionReason: '',
    otp,
  });


  return NextResponse.json({ data: booking }, { status: 201 });
}

// PATCH /api/bookings - Update booking status
export async function PATCH(request: Request) {
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }

  await connectToDatabase();
  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  // Only assigned lawyer (by userId) or admin can update status
  const booking = await BookingModel.findById(id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  
  let isAssignedLawyer = false;
  if (user.role === 'lawyer') {
    // Find the lawyer profile for this user
    const { LawyerModel } = await import('@/models/Lawyer');
    const lawyerProfile = await LawyerModel.findOne({ userId: user.id });
    if (lawyerProfile && booking.lawyerId?.toString() === lawyerProfile._id.toString()) {
      isAssignedLawyer = true;
    }
  }
  
  const isAdmin = user.role === 'admin';
  if (!isAssignedLawyer && !isAdmin) {
    return forbiddenResponse('You do not have permission to update this booking');
  }
  
  booking.status = status;
  await booking.save();
  return NextResponse.json({ data: booking });
}
