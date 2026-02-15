import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BookingModel } from '@/models/Booking';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

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

  // Only assigned lawyer or admin can update status
  const booking = await BookingModel.findById(id);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  const isAssignedLawyer = booking.lawyerId?.toString() === user.id;
  const isAdmin = user.role === 'admin';
  if (!isAssignedLawyer && !isAdmin) {
    return forbiddenResponse('You do not have permission to update this booking');
  }
  booking.status = status;
  await booking.save();
  return NextResponse.json({ data: booking });
}
