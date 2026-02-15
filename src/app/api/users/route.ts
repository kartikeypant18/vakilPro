import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse, hasRole } from '@/lib/apiAuth';

export async function GET(request: Request) {
  // Verify authentication - only admins can list all users
  const user = await verifyAuth(request);
  if (!user) {
    return unauthorizedResponse();
  }
  
  if (!hasRole(user, 'admin')) {
    return forbiddenResponse('Only admins can view all users');
  }

  try {
    await connectToDatabase();
    const users = await UserModel.find({}).lean();
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  // This endpoint is typically handled by /api/auth/register
  // Keeping it for backward compatibility or admin user creation
  return NextResponse.json({ error: 'Use /api/auth/register to create users' }, { status: 400 });
}
