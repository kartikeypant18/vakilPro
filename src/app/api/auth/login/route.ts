import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';
import { comparePassword, setAuthCookies, signAuthToken } from '@/lib/auth';

interface LoginPayload {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginPayload;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = signAuthToken({ sub: user._id.toString(), role: user.role });
    const response = NextResponse.json({ user: user.toJSON() });
    setAuthCookies(response, token, user.role);

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Unable to login right now.' }, { status: 500 });
  }
}
