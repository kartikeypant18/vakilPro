import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/apiAuth';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  await connectToDatabase();
  const { id } = await params;
  const user = await UserModel.findById(id).lean();
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ data: user });
}

export async function PATCH(request: Request, { params }: Params) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  
  // Users can only update their own profile, admins can update anyone
  if (authUser.id !== id && authUser.role !== 'admin') {
    return forbiddenResponse('You can only update your own profile');
  }

  await connectToDatabase();
  const body = await request.json();

  // Whitelist allowed fields for update
  const allowed: any = {};
  if (body.name !== undefined) allowed.name = body.name;
  if (body.phone !== undefined) allowed.phone = body.phone;
  if (body.notes !== undefined) allowed.notes = body.notes;
  if (body.city !== undefined) allowed.city = body.city;
  
  // Only admin can change role
  if (body.role !== undefined && authUser.role === 'admin') {
    allowed.role = body.role;
  }

  const updated = await UserModel.findByIdAndUpdate(id, { $set: allowed }, { new: true }).lean();
  if (!updated) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request, { params }: Params) {
  const authUser = await verifyAuth(request);
  if (!authUser) {
    return unauthorizedResponse();
  }

  // Only admins can delete users
  if (authUser.role !== 'admin') {
    return forbiddenResponse('Only admins can delete users');
  }

  const { id } = await params;
  await connectToDatabase();
  
  const deleted = await UserModel.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json({ message: 'User deleted successfully' });
}
