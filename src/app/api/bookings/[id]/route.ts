import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { BookingModel } from '@/models/Booking';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
	// Verify authentication
	const user = await verifyAuth(request);
	if (!user) {
		return unauthorizedResponse();
	}

	const { id } = await context.params;
	await connectToDatabase();

	const booking = await BookingModel.findById(id).lean() as any;
	if (!booking) {
		return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
	}

	// Authorization: Only allow access to own bookings (unless admin)
	const isOwner = booking.clientId?.toString() === user.id;
	const isAssignedLawyer = booking.lawyerId?.toString() === user.id;
	const isAdmin = user.role === 'admin';

	if (!isOwner && !isAssignedLawyer && !isAdmin) {
		return forbiddenResponse('You do not have access to this booking');
	}

	return NextResponse.json({ data: booking });
}
